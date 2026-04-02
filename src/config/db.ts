import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.MYSQLHOST as string,
  user: process.env.MYSQLUSER as string,
  password: process.env.MYSQLPASSWORD as string,
  database: process.env.MYSQLDATABASE as string,
  port: Number(process.env.MYSQLPORT) || 3306
});