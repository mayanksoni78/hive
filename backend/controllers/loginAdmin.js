import { supabase } from '../supabase.js'

export async function adminLogin(req, res) {
    const { email, password } = req.body;
    console.log(req.body)
    if(!email || !password){
        console.log("enter full details")
        return;
    }
    

    try {
        const { data, error } = await supabase
            .from("admin")
            .select("*")
            .eq("email",email.trim())

            console.log(data)
        if (error) {
            console.log(error);
            return res.status(500).json({ msg: "DB error" });
        }

        if (!data || data.length === 0) {
            return res.json({ msg: "admin not found" });
        }

        if (password !== data[0].password) {
            return res.json({ msg: "wrong password" });
        }

        return res.json({
            msg: "login successful",
            data: data[0]
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: "server error" }); // ✅ FIX
    }
}