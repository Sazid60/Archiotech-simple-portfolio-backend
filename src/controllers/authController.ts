import { Request, Response } from "express";
import { loginService } from "../services/authService";
import { loginSchema } from "../validations/requestSchemas";

export const loginController = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const token = await loginService(parsed.email, parsed.password);
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({ token });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ message: "Invalid login payload", issues: err.issues });
        }

        if (err?.message === "User not found" || err?.message === "Incorrect password") {
            return res.status(401).json({ message: err.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};