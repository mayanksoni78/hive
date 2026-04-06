import jwt from 'jsonwebtoken'

export async function verifyStudent(req,res,next){
    const token =req.cookies?.token;
    try{
        const decoded = jwt.decode(token,process.env.JWT_SECRET);
        console.log(decoded)
        if("student"!=decoded.role)return res.json({msg:"Unauthorized"}).status(401)
        req.user=req.email;
        next();
    }catch(e){
        console.log("error:",e);
        res.status(500);
    }
}