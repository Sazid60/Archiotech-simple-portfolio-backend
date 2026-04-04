import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const auth = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = req.cookies?.token ?? req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded;

            if (roles.length > 0 && !roles.includes(decoded.role)) return res.status(403).json({ message: "Forbidden" });

            next();
        } catch {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};