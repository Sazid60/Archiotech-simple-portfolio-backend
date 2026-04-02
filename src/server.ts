import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

import { seedAdmin } from "./utils/seedAdmin";
import { initDb } from "./utils/initDb";
import workRoutes from "./routes/workRoutes";

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

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await initDb();
        await seedAdmin();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err: any) {
        console.error("Startup initialization failed:", {
            message: err?.message || "Unknown error",
            code: err?.code,
        });
        // Continue anyway; app can still serve requests even if DB init failed
        app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB init failed)`));
    }
})();