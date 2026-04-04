import type { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        try {
            await schema.parseAsync(req.body);
        } catch {
            await schema.parseAsync({
                body: req.body,
            });
        }
        return next();
    }
    catch (err) {
        next(err)
    }
};

export default validateRequest;