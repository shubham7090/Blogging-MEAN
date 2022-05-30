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
//.....................
const User=require('./models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkAuth=require('./middleware/check-auth');         

//..........
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://shubham7090:shubham7090@cluster0.kij19.mongodb.net/node-angular").then(()=>{
    console.log("Connected to Database");
}).catch(()=>{
    console.log("Database Connection Failed!");
});

const Post=require('./models/post');
const user = require("./models/user");
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
app.use('/images',express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
})
//##################################################################
//#########################POST REQUEST#############################
//##################################################################
app.post("/api/posts",checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    const url=req.protocol+"://"+req.get("host");
    let filename=typeof(req.file)==undefined?"":req.file?.filename;
    // console.log(req.file?.filename);
    console.log(req.myUserData);
    // console.log(req.myUserData.userId);
    const post=new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url+"/images/"+filename,
        creator:req.myUserData.userId
    });

    post.save().then(createdPost=>{
        console.log("Post Created"+createdPost);
        res.status(201).json({
            message:"Post added successfully",
            postId: createdPost._id,
            imagePath:createdPost.imagePath,
            creator:req.myUserData.userId
        });
    });
    
})

app.put("/api/posts/:id",checkAuth, multer({storage:storage}).single("image"),(req,res,next)=>{
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
        // creator:req.myUserData.userId
    });
    console.log("reached here");
    console.log(req);
    Post.updateOne({_id:req.params.id,creator:req.myUserData.userId},{$set:{
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath,
        creator:req.myUserData.userId
    }}).then(result=>{
        console.log(result);
        if(result.modifiedCount>0){
            res.status(200).json({message:"Update Successful!"});
        }else{
            res.status(401).json({message:"Update Not Authorized!"});
        }
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

app.delete("/api/posts/:id",checkAuth,(req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator:req.myUserData.userId}).then(result=>{
        if(result.deletedCount>0){
            return res.status(200).json({message:"Deletion Successful!"});
        }else{
            return res.status(401).json({message:"Deletion Not Authorized!"});
        }
        // res.status(200).json({message:"Post deleted!"});
    });
});

//##################################################################
//######################### Auth Request #############################
//##################################################################
app.post("/api/user/signup",(req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(hash=>{
        const user=new User({
            email:req.body.email,
            password:hash,
            name:req.body.name,
            number:req.body.number,
        });
        user.save().then(result=>{
            res.status(201).json({
                message:'User Created!',
                result:result
            });
        }).catch(err=>{
            res.status(500).json({
                error:err
            })
        });
    });
});

app.post("/api/user/login",(req,res,next)=>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            return res.status(401).json({
                message:"Auth failed 1"
            })
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password,user.password);
    }).then(result=>{
        if(!result){
            return res.status(401).json({
                message:"Auth failed 2"
            })
        }
        const token=jwt.sign({
            email:fetchedUser.email,
            userId:fetchedUser._id,
            name:fetchedUser.name,
            number:fetchedUser.number
        },'bgs77fsdyfysd7fysd7fy78fy',{
            expiresIn:'2h'
        });
        console.log(res);
        res.status(200).json({
            message:"Auth Successful",
            token:token,
            userId: fetchedUser._id,
        })
    }).catch(err=>{
        console.log(err);
        return res.status(401).json({
            message:"Auth failed 3"
        })
    });
});

module.exports=app;