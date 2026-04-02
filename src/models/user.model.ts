import { db } from "../config/db";
import { User } from "../interfaces/user.interface";


export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
};

export const createUser = async (email: string, hashedPassword: string, role = "admin"): Promise<number> => {
  const [result]: any = await db.query(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [email, hashedPassword, role]
  );
  return result.insertId;
};