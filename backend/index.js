import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import complainrouter  from "./routes/complainRoutes.js";
import hostelRouter    from "./routes/hostel.js";
import transportRouter from "./routes/transport.js";
import messRouter      from "./routes/messRoutes.js";
import feeRouter       from "./routes/feeRoutes.js";
import profileRouter   from "./routes/profileRoutes.js";
import adminRoute from "./routes/adminRoutes.js";

const PORT = process.env.PORT || 3000;
const app  = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/complain",  complainrouter);
app.use("/api/hostel",    hostelRouter);
app.use("/api/transport", transportRouter);
app.use("/api/mess",      messRouter);
app.use("/api/fee",       feeRouter);
app.use("/api/profile",   profileRouter);
app.use("/api/admin",     adminRoute);

app.get("/", (req, res) => res.send("HIVE Backend Running ✅"));

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
}

export default app;