import jwt from 'jsonwebtoken'

export function generateToken(id){
    return jwt.sign(
        id,
        process.env.VITE_SUPABASE_JWT_KEY,
        {expiresIn:"7d"}
    )
}