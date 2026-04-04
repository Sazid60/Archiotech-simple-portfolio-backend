import express from "express";
import { loginController } from "../controllers/authController";
import validateRequest from "../middlewares/validateRequest";
import { loginSchema } from "../validations/requestSchemas";
import { authLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.post(
	"/login",
	authLimiter,
	validateRequest(loginSchema),
	loginController
);

export default router;