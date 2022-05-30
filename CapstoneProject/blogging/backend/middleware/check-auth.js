const jwt = require("jsonwebtoken");

module.exports=(req,res,next)=>{
    
    try{
        console.log(req.headers.authorization);
        const token=req.headers.authorization.split(" ")[1];
        const decodedtoken=jwt.verify(token,'bgs77fsdyfysd7fysd7fy78fy');
        req.myUserData={email:decodedtoken.email,userId:decodedtoken.userId};

        next();
    }catch(error){
        res.status(401).json({message:"Auth Failed!"});
    }


};