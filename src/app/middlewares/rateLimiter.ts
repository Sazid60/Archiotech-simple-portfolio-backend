import { NextFunction, Request, Response } from "express";

type LimiterOptions = {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
};

type CounterState = {
  count: number;
  startedAt: number;
};

const createRateLimiter = (options: LimiterOptions) => {
  const store = new Map<string, CounterState>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const current = store.get(key);
    if (!current || now - current.startedAt > options.windowMs) {
      store.set(key, { count: 1, startedAt: now });
    } else {
      current.count += 1;
      store.set(key, current);
    }

    const state = store.get(key)!;

    if (options.skipSuccessfulRequests) {
      res.on("finish", () => {
        if (res.statusCode < 400) {
          const latest = store.get(key);
          if (!latest) {
            return;
          }

          latest.count = Math.max(0, latest.count - 1);
          store.set(key, latest);
        }
      });
    }

    if (state.count > options.max) {
      return res.status(429).json({ message: options.message });
    }

    return next();
  };
};

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 59,
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});
