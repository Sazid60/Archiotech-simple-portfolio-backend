import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;
const parsedDbUrl = dbUrl ? new URL(dbUrl) : null;

const host = process.env.MYSQLHOST || parsedDbUrl?.hostname;
const user = process.env.MYSQLUSER || decodeURIComponent(parsedDbUrl?.username || "");
const password = process.env.MYSQLPASSWORD || decodeURIComponent(parsedDbUrl?.password || "");
const database = process.env.MYSQLDATABASE || parsedDbUrl?.pathname.replace(/^\//, "");
const port = Number(process.env.MYSQLPORT || parsedDbUrl?.port) || 3306;

export const db = mysql.createPool({
  host: host as string,
  user: user as string,
  password: password as string,
  database: database as string,
  port
});