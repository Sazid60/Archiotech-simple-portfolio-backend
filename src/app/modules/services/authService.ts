import bcrypt from "bcrypt";
import { findUserByEmail } from "../models/user.model";
import ApiError from "../../errors/ApiError";
import { createUserToken } from "../../utils/userToken";
import httpStatus from "http-status";

export const loginService = async (email: string, password: string): Promise<string> => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  if (typeof user.id !== "number") {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
  }

  return createUserToken({
    id: user.id,
    ...(user.role ? { role: user.role } : {}),
  });
};