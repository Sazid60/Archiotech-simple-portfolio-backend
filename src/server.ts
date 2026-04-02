import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

import { seedAdmin } from "./utils/seedAdmin";
import workRoutes from "./routes/workRoutes";
import { db } from "./config/db";

dotenv.config();
const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsCredentials = process.env.CORS_CREDENTIALS === "true";

app.use(cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: corsCredentials,
}));

app.use(express.json());
app.use(cookieParser());
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/works", workRoutes);

const requiredDbVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

const getMissingDbVars = () => {
    return requiredDbVars.filter((key) => !process.env[key]);
};

const startServer = async () => {
    const missingVars = getMissingDbVars();
    if (missingVars.length > 0) {
        throw new Error(`Missing DB environment variables: ${missingVars.join(", ")}`);
    }

    await db.query("SELECT 1");
    await seedAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((err: any) => {
    console.error("Startup failed:", {
        message: err?.message || "Unknown error",
        code: err?.code,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
    });
    process.exit(1);
});