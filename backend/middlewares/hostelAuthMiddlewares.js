import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}
