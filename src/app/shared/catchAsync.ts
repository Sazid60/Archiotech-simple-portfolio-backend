import type { NextFunction, Request, Response } from "express"



type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
        if (process.env.node_env === "development") {
            console.log(err);
        }
        next(err)
    })
}
