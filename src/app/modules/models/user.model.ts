import { db } from "../../config/db";
import { User } from "../interfaces/user.interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";



export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<(User & RowDataPacket)[]>("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
};

export const createUser = async (email: string, hashedPassword: string, role = "admin"): Promise<number> => {
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role]
  );
  return result.insertId;
};