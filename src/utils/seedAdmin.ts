
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createUser, findUserByEmail } from "../models/user.model";
dotenv.config();

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const existing = await findUserByEmail(adminEmail);

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await createUser(adminEmail, hashed, "admin");
    console.log(`Admin seeded: ${adminEmail}`);
  }
};