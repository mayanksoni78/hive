import { supabase } from "../supabase.js";

export async function adminSignup(req,res){
    const body=req.body
    try{
        
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"something went wrong"});
    }
}