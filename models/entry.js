const mongoose=require("mongoose");

const entrySchema=new mongoose.Schema({
    Message:{
        type:String
    },
    Amount:{
        type:Number
    },
    Date:{
        type:String
    },
    Time:{
        type:String
    },
    Type:
    {
        type:String
    },
    Month:
    {
        type:String
    },
    Year:
    {
        type:String
    }
});

const Entry=mongoose.model("Entry",entrySchema);

module.exports=Entry;