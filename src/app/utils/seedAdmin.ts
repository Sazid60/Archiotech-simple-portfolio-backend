
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../modules/models/user.model";
import { env } from "../config/env";

export const seedAdmin = async () => {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  const existing = await findUserByEmail(adminEmail);

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await createUser(adminEmail, hashed, "admin");
    console.log(`Admin seeded: ${adminEmail}`);
  }
};