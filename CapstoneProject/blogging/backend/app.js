const path=require("path");
const express=require('express');
const bodyParser=require("body-parser");
const app=express();
const multer=require("multer");

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"backend/images");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://shubham7090:shubham7090@cluster0.kij19.mongodb.net/node-angular?retryWrites=true&w=majority").then(()=>{
    console.log("Connected to Database");
}).catch(()=>{
    console.log("Database Connection Failed!");
});

const Post=require('./models/post')
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use('/images',express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
})
//#########################POST REQUEST#############################
app.post("/api/posts",multer({storage:storage}).single("image"),(req,res,next)=>{
    const url=req.protocol+"://"+req.get("host");
    let filename=typeof(req.file)==undefined?"":req.file?.filename;
    console.log(req.file?.filename);

    const post=new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+"/images/"+filename
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:"Post added successfully",
            postId: createdPost._id,
            imagePath:createdPost.imagePath
        });
    });
    
})

app.put("/api/posts/:id",multer({storage:storage}).single("image"),(req,res,next)=>{
    let imagePath=req.body.imagePath;
    if(req.file){
        const url=req.protocol+"://"+req.get("host");
        let filename=typeof(req.file)==undefined?"":req.file?.filename;
        imagePath=url+"/images/"+filename;
    }
    const post=new Post({
        _id: req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath,
    });
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message:"Update Successful!"});
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
app.get("/api/posts/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:"Post not Found!"});
        }
    })
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