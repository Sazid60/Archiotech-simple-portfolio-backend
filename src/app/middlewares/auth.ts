import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import { env } from "../config/env";

type JwtPayload = {
    id: number;
    role?: string;
};

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const auth = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = req.cookies?.token ?? req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "No token provided"));
        }

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
            req.user = decoded;
            const role = decoded.role ?? "";

            if (roles.length > 0 && !roles.includes(role)) {
                return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
            }

            return next();
        } catch {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid token"));
        }
    };
};