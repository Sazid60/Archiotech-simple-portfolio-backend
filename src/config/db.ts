import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const useSsl = process.env.DB_SSL === "true" || process.env.DB_HOST?.includes("rlwy.net");

export const db = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT) || 3306,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});