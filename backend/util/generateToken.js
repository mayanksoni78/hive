import jwt from "jsonwebtoken";

export const generateToken = (email,role) => {
    return jwt.sign({ email ,role}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};