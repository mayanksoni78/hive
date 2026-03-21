const hostelData=(req,res)=>{
    console.log(req.user);
    return res.json({data:req.user})
}

export default hostelData