const express=require("express");
const port=1000;
const path=require("path");

const app=express();

app.set("view engine","ejs");  //setting the view engine
app.set("views",path.join(__dirname,"./views"))   //setting the view path

app.use(express.static("assets"));
app.use(express.urlencoded());

const db=require("./config/mongoose");
const Entry=require("./models/entry");



let month_mapper=["","Janaury","February","March","April","May","June","July","August","September","October","November","December"];



var date = new Date();
var day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();

month = (month < 10 ? "0" : "") + month;
day = (day < 10 ? "0" : "") + day;

var today = day + "-" + month + "-" + year;




app.get("/",function(req,res){
    let date_header_display=today;

    Entry.find({ Date:today },null,{ sort:{Date:1,Time:1} },function(err,entries){
        if(err)
        {
            console.log("Error in fetching the entries!!");
            return;
        }

        let total_cash_in=0,total_cash_out=0;
        entries.forEach(function(entry){
            if(entry.Type=="in")
                total_cash_in+=entry.Amount;
            else
                total_cash_out+=entry.Amount;
        })

        return res.render("home",{
            entries:entries,
            total_cash_in:total_cash_in,
            total_cash_out:total_cash_out,
            curr_date:day,
            curr_month:month,
            curr_year:year,
            date_header_display:date_header_display
        })
    })
    
})




app.get("/query/:query_name",function(req,res){
    return res.render("query",{
        query_name:req.params.query_name,
        curr_year:year
    });
})




app.get("/search/:query_name",function(req,res){

    // console.log(req.body);
        let find_obj;
        let date_header_display;
    if(req.params.query_name=="Day")
    {
        let str=req.query.Date;
        let y=str.slice(0,4);
        let m=str.slice(5,7);
        let d=str.slice(8,10);
        let req_date=d+'-'+m+'-'+y;
        find_obj={
            Date:req_date
        }
        date_header_display=req_date;
    }
    else if(req.params.query_name=="Month")
    {
        let str=req.query.Month;
        let y=str.slice(0,4);
        let m=str.slice(5,7);
        find_obj={
            Month:m,
            Year:y
        }
        
        date_header_display=month_mapper[parseInt(m)]+' '+y;
        
    }
    else
    {
        find_obj={
            Year:req.query.Year
        }
        date_header_display=req.query.Year;
    }
    
    Entry.find(find_obj,null,{ sort:{Date:1, Time:1} },function(err,entries){
        if(err)
        {
            console.log("Error in fetching the entries!!");
            return;
        }

        let total_cash_in=0,total_cash_out=0;
        entries.forEach(function(entry){
            if(entry.Type=="in")
                total_cash_in+=entry.Amount;
            else
                total_cash_out+=entry.Amount;
        })

        return res.render("home",{
            entries:entries,
            total_cash_in:total_cash_in,
            total_cash_out:total_cash_out,
            curr_date:day,
            curr_month:month,
            curr_year:year,
            date_header_display:date_header_display
        })
    })
    

})





app.get("/form/:type",function(req,res){
    return res.render("form",{
        type:req.params.type
    });
})





app.post("/saveEntry/:type",function(req,res){
    
    let str=req.body.Date;
    let y=str.slice(0,4);
    let m=str.slice(5,7);
    let d=str.slice(8,10);
    let req_date=d+'-'+m+'-'+y;

    let new_entry=new Entry({
        Message:req.body.Message,
        Amount:req.body.Amount,
        Date:req_date,
        Time:req.body.Time,
        Type:req.params.type,
        Month:m,
        Year:y
    });
    new_entry.save(function(err,obj){
        if(err)
        {
            console.log("Error in creating the entry!!",err);
            return;
        }
        // console.log(obj);   //__v is version key
        return res.redirect("/");

    })
    
})





app.get("/deleteEntry/:id",function(req,res){

    Entry.deleteOne( {_id:req.params.id}, function(err){
        if(err)
        {
            console.log("Error deleting the entry!!",err);
            return;
        }
        return res.redirect("back");
    })
})





app.listen(port,function(err){
    if(err)
    {
        console.log("Error starting the server!!",err);
        return;
    }
    console.log("Woahh!!The server is up and running...");
})
