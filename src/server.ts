import { Server } from "http";
import dotenv from "dotenv";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";
import { initDb } from "./app/utils/initDb";

dotenv.config();

const start = async () => {
    let server: Server;

    try {
        try {
            await initDb();
            await seedAdmin();
        } catch (err: any) {
            console.error("Startup initialization failed:", {
                message: err?.message || "Unknown error",
                code: err?.code,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
            });
        }

        const PORT = process.env.PORT || 5000;
        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log("Server closed gracefully.");
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        process.on("unhandledRejection", (error) => {
            console.log("Unhandled Rejection is detected, we are closing our server...");
            console.log(error);
            exitHandler();
        });

        process.on("uncaughtException", (error) => {
            console.log("Uncaught Exception detected, closing server...");
            console.error(error);
            exitHandler();
        });

        process.on("SIGTERM", () => {
            console.log("SIGTERM received, shutting down gracefully...");
            exitHandler();
        });

        process.on("SIGINT", () => {
            console.log("SIGINT (Ctrl+C) received, shutting down gracefully...");
            exitHandler();
        });
    } catch (err: any) {
        console.error("Startup failed:", {
            message: err?.message || "Unknown error",
            code: err?.code,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
        });
        process.exit(1);
    }
};

start();