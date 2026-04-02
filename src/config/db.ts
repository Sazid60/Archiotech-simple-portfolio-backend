// src/config/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// helper function for queries with automatic connection release
export const runQuery = async (query: string, params: any[] = []) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(query, params);
    return rows;
  } finally {
    conn.release(); // always release connection
  }
};