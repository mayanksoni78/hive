import { supabase } from "../supabase.js";

export async function markPaid(req, res) {
    const  request  = req.body;
    console.log(req.params.id);
    try {
        const { data, error } = await supabase.from("fee").update({paid_date: new Date(),"status":request.status}).eq('fee_id',req.params.id).select("*")
        console.log(data);
        if(error){
            console.log(error)
        }
        return res.json({msg:"marked as paid"});
    } catch (e) {
        console.log("error:", e);
        return res.status(500);
    }
}