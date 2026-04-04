import { Response } from "express";
import { env } from "../config/env";

export const setAuthCookie = (res: Response, token: string) => {
  const isProduction = env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  });
};
