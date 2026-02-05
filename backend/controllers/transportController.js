import {supabase} from "../supabase.js"

export const addBus=async(req,res)=>{
    try{
         const {route,date,day,time_range,student_count,batch,bus_count}= req.body;
        if(!route|| !date || !day|| !time_range||!student_count ||!batch ||!bus_count)
        {
            return res.json({error:"Missing required fields"})
        }
        const {data,error}=await supabase.from('transport_schedule').insert([{
           route,date,day,time_range,student_count,batch,bus_count}
        ]).select();

        if(error)throw error;

        res.json({message:"Bus Added",data})

    }
    catch(error){
         console.error("Backend Error:", error);
    res.json({ error: error.message })
    }
}