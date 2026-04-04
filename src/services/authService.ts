import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { findUserByEmail } from "../models/user.model";
import ApiError from "../errors/ApiError";
import { createUserToken } from "../utils/userToken";

dotenv.config();

export const loginService = async (email: string, password: string): Promise<string> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, "Incorrect password");
  }

  if (typeof user.id !== "number") {
    throw new ApiError(500, "Internal server error");
  }

  return createUserToken({
    id: user.id,
    ...(user.role ? { role: user.role } : {}),
  });
};