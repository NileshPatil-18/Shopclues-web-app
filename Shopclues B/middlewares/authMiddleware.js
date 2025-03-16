const{verifyToken} = require("../utils/jwt");

const authMiddleware = (req,res,next)=>{
    const token = req.header('Authorization')?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Access Denied:No token provided"});

    }

    const decode = verifyToken(token);
    if(!decode){
        return res.status(401).json({message:"Invalid or expired token"});
    }

    req.user = decode;
    next();
};

module.exports = authMiddleware;