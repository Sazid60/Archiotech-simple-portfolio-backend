import jwt from "jsonwebtoken";
import { env } from "../config/env";

type UserTokenPayload = {
  id: number;
  role?: string;
};

export const createUserToken = (payload: UserTokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
