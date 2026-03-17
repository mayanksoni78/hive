import { getSupabase } from "../config.js";

const supabase = getSupabase();


const createComplain=async(req,res)=>{
    try{
        const {name,enroll_id,room_no,description,complain_type,image_url}= req.body;
        if(!room_no || !description || !complain_type ||!image_url ||!name ||!enroll_id )
        {
            return res.json({error:"Missing required fields"})
        }
        const {data,error}=await supabase.from('complaints').insert([{
            name,enroll_id,room_no,description,complain_type,image_url,status:'Pending'}
        ]).select();

        if(error)throw error;
        
        res.json({message:"Complain created",data})
        }
    catch(error){
        console.log("Backend Error:", error);
         res.json({ error: error.message })
    }
}
export default createComplain;