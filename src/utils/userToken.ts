import jwt from "jsonwebtoken";

type UserTokenPayload = {
  id: number;
  role?: string;
};

export const createUserToken = (payload: UserTokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
