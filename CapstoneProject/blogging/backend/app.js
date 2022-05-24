const express=require('express');
const bodyParser=require("body-parser");
const app=express();

const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://shubham7090:shubham7090@cluster0.kij19.mongodb.net/node-angular?retryWrites=true&w=majority").then(()=>{
    console.log("Connected to Database");
}).catch(()=>{
    console.log("Database Connection Failed!");
});

const Post=require('./models/post')
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
    next();
})

app.post("/api/posts",(req,res,next)=>{
    const post=new Post({
        title:req.body.title,
        content:req.body.content
    });

    post.save().then(createdPost=>{
        res.status(201).json({
            message:"Post added successfully",
            postId: createdPost._id
        });
    });
    
})

app.get('/api/posts',(req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:"Posts fetched successfully",
            posts: documents
        });
    });
   
});

app.delete("/api/posts/:id",(req,res,next)=>{
    console.log("delte function ke andar");
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(`here is id ${req.params.id}`);
        console.log(result)
        res.status(200).json({message:"Post deleted!"});
    });
});
module.exports=app;