import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { findUserByEmail } from "../models/user.model";
dotenv.config();

export const loginService = async (email: string, password: string): Promise<string> => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Incorrect password");

  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};