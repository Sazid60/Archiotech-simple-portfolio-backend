import { Request, Response } from "express";
import httpStatus from "http-status";
import { loginService } from "../services/authService";
import { catchAsync } from "../../shared/catchAsync";
import { setTokenResponse } from "../../utils/setToken";



export const loginController = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await loginService(email, password);
  setTokenResponse(res, token, httpStatus.OK);
});