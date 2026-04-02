// src/utils/seedAdmin.ts
import bcrypt from "bcrypt";
import { runQuery } from "../config/db";

export const seedAdmin = async () => {
  try {
    // check if admin exists
    const users: any = await runQuery("SELECT * FROM users WHERE email = ?", [
      process.env.ADMIN_EMAIL,
    ]);

    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD as string,
        10
      );

      await runQuery(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [process.env.ADMIN_EMAIL, hashedPassword, "admin"]
      );
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err: any) {
    console.error("seedAdmin failed:", {
      message: err?.message || "Unknown error",
      code: err?.code,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    });
  }
};