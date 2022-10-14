const jwt = require('jsonwebtoken');

exports.verify=(req,res,next)=>{

    const authen=req.headers.authorization
    
    if(authen){
        const token=authen.split(" ")[1];
        console.log(token)
        jwt.verify(token,"MySecretKeyForSomething",(err,mobile)=>{
            if(err)
                return res.status(403).json("Token is not valid!")
            req.mobile=mobile;
            next();
        });
    }
    else{
        return res.status(401).json("You are not authenticated!");
    }
}