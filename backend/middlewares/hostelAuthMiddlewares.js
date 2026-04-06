import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  // console.log(req.cookies);
  const token = req.cookies?.token;
  // console.log("token :",token)
  if (!token) {
    return res.json({ msg: "Unauthorized: No token" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded.email;
    console.log("decoded : ", decoded)
    next();

  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
}