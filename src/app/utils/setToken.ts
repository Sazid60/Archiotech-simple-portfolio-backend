import { Response } from "express";
import httpStatus from "http-status";
import { setAuthCookie } from "./setCookie";

export const setTokenResponse = (
  res: Response,
  token: string,
  statusCode = httpStatus.OK
) : void => {
  setAuthCookie(res, token);
  res.status(statusCode).json({ token });
};
