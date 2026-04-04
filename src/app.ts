import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./app/modules/routes/authRoutes";
import workRoutes from "./app/modules/routes/workRoutes";
import { apiLimiter } from "./app/middlewares/rateLimiter";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { env } from "./app/config/env";

const app = express();

const corsOrigins = env.CORS_ORIGIN
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsCredentials = env.CORS_CREDENTIALS === "true";
const corsOriginConfig =
  corsOrigins.length > 0 ? corsOrigins : env.NODE_ENV === "production" ? false : true;

app.set("trust proxy", 1);
app.use(
  cors({
    origin: corsOriginConfig,
    credentials: corsCredentials,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(apiLimiter);

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/works", workRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;