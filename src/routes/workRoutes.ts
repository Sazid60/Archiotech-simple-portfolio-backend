import express from "express";

import { auth } from "../middlewares/auth";
import { deleteWorkController, fetchWorksController, updateWorkController, uploadWorkController } from "../controllers/workController";
import validateRequest from "../middlewares/validateRequest";
import { createWorkRequestSchema, updateWorkRequestSchema } from "../validations/requestSchemas";
import upload from "../config/multer.config";



const router = express.Router();

router.get("/", fetchWorksController);
router.post(
	"/",
	auth(["admin"]),
	upload.single("image"),
	validateRequest(createWorkRequestSchema),
	uploadWorkController
);
router.put(
	"/:id",
	auth(["admin"]),
	upload.single("image"),
	validateRequest(updateWorkRequestSchema),
	updateWorkController
);
router.delete("/:id", auth(["admin"]), deleteWorkController);

export default router;