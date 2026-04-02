import { db } from "../config/db";

export const initDb = async () => {
    try {
        // Create users table if not exists
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin'
      )
    `);

        // Create works table if not exists
        await db.query(`
      CREATE TABLE IF NOT EXISTS works (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log("Database tables initialized");
    } catch (error: any) {
        console.error("Database initialization failed:", {
            message: error?.message,
            code: error?.code,
        });
    }
};
