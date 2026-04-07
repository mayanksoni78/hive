import jwt from "jsonwebtoken";

export const verifyHostel = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "your_secret_key");

    req.hostel_id = decoded.hostel_id; // ✅ attach to request

    next();
  } catch (err) {
    return res.json({ error: "Invalid token" });
  }
};