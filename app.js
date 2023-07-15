// use async and await funciton wherever you are using find(),delete() etc
//  funcitons of database 
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const lodash=require("lodash")
// const date=require(__dirname+"/date.js");
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/test');
const Schema = mongoose.Schema;
const sch=new mongoose.Schema({
    name:String, 
})
const sch2=new mongoose.Schema({
    name:String,
    items:[sch]
})

const list=new mongoose.model("list",sch2);

const item=new mongoose.model("item",sch);

var defaultArray=[];


app.get("/",function(req,res){
    defaultArray=[]
    async function getData() {
        try {
            const new_item = await item.find({},{name:1}); // Using await to wait for the promise to resolve
            for(var i=0;i<new_item.length;i++){
                // make sure to add this await keyword otherwise as compiler works asynchronuosly 
                // will leave this delete statement incomplete and will move on to next statement 
                // which may lead to incorrect output.
               await defaultArray.push(new_item[i]);
            }
            res.render("list", { ListTitle: "Today", newItem: defaultArray || []  });
        } catch (error) {
            console.error(error);
        }
    }
    getData()
});
app.get("/:customList",async function(req,res){
    const customList=lodash.capitalize(req.params.customList);
    console.log(req.params.customList);
    const list_item= await list.findOne({name:customList})

    if(!list_item){
        const l1=new list({
            name:customList,
            items:defaultArray
        })
        l1.save()
        console.log("doesn't  exists");
        res.render("list", { ListTitle: customList, newItem: defaultArray || []  })
    }
    else{
        console.log("already exists");
        res.render("list", { ListTitle: customList, newItem: list_item.items})

    }
  
    // res.redirect("/")
}
)

app.post("/", async function(req,res){
        const ListName=req.body.list;
        const new_item2=new item({
            name:req.body.names
        })

        if(ListName==="Today"){
            new_item2.save().then(()=>console.log("yey!!"));
            defaultArray=[];
            res.redirect("/");

        }
        else{
            const list_item= await list.findOne({name:ListName})
            list_item.items.push(new_item2);
            list_item.save();
            res.redirect("/"+ListName)
            
        }
       
});
app.post("/delete",async function(req,res){
    const id=req.body.check;
    const ListName=req.body.ListName;
    console.log("name of list" +ListName)
    console.log(id)

//    await item.deleteOne({_id:id});
   if(ListName==="Today"){
        await item.deleteOne({_id:id});
        res.redirect("/")
   }

    else{
        // to delete the item from the array of  list
        await list.updateOne({name:ListName},{$pull:{items:{_id:id}}});

        res.redirect("/"+ListName)

    }
})


app.listen(3000,function(){
    console.log("server has started");
});