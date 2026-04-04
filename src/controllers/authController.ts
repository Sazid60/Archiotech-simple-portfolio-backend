import { Request, Response } from "express";
import httpStatus from "http-status";
import { loginService } from "../services/authService";

import { setTokenResponse } from "../utils/setToken";
import { catchAsync } from "../shared/catchAsync";

export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginService(email, password);
  setTokenResponse(res, token, httpStatus.OK);
});