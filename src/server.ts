import { Server } from "http";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";
import { initDb } from "./app/utils/initDb";
import { env } from "./app/config/env";

const start = async () => {
    let server: Server;

    try {
        await initDb();
        await seedAdmin();

        const PORT = env.PORT;
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
        });
        process.exit(1);
    }
};

start();