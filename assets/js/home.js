console.log("Script loaded!!");

let deleteIcons=document.querySelectorAll("#delete-icon");

Array.from(deleteIcons).forEach(function(icon){

    icon.addEventListener("click",function(event){
        let ans=confirm("Are you sure you want to delete this entry?");
        if(!ans)
            event.preventDefault();
    })

});



