import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

import { seedAdmin } from "./utils/seedAdmin";
import workRoutes from "./routes/workRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/works", workRoutes);


seedAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));