import {supabase} from "../supabase.js"

export const addBus=async(req,res)=>{
    try{
         const { hostel_id,transport_id,pickup,destination,date,day,start_time,end_time,student_count,batch,bus_count}= req.body;
        if(!hostel_id || !transport_id || !pickup || !destination|| !date || !start_time|| !end_time|| !day|| !student_count ||!batch ||!bus_count)
        {
            return res.json({error:"Missing required fields"})
        }
        const {data,error}=await supabase.from('transport_schedule').insert([{
           pickup,destination,day,date,start_time,end_time,student_count,batch,bus_count}
        ]).select();

        if(error)throw error;

        res.json({message:"Bus Added",data})

    }
    catch(error){
         console.error("Backend Error:", error);
    res.json({ error: error.message })
    }
}

          
        
          
          