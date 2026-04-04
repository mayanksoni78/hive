import { supabase } from '../supabase.js'

export async function adminLogin(req, res) {
    const {email,password} =req.body;
    try {
        const response = await supabase.from("admin").select("*").eq("email",email)
        if(response.length==0)return res.json({msg:"admin donot fount"});
        if(password!==response[0].password)return res.json({msg:"wrong password"});
        return res.json({msg:"login successeful",data:response[0]});
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
}