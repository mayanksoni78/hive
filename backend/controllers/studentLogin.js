import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../util/generateToken.js";

export async function studentLogin(req,res){
    const body = req.body;
    // console.log(req.body)
    console.log(body)
    try{
        const {data,error}= await supabase.from("student").select('*').eq("enroll_id",body.enroll_id);
        if(data.length==0)return res.json({msg:"No student found."});

        if(error)throw error;
        // console.log(body.password);
        // const hashedPassword=await bcrypt.hash(body.password,10);
        // console.log(hashedPassword)
        // console.log(data[0].password);
        const isCorrectPassword = await bcrypt.compare(
            body.password,
            data[0].password
        );
        console.log(isCorrectPassword);
        if(!isCorrectPassword)return res.json({msg:"wrong password"})
        const token= generateToken(body.email,"student");
        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({msg:"login success"}).status(200);
    }catch(e){
        console.log(e)
        return res.json({msg:"something went wrong from controller"}).status(500);
    }
}