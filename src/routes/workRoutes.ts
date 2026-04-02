import express from "express";
import multer from "multer";

import { auth } from "../middlewares/auth";
import { deleteWorkController, fetchWorksController, updateWorkController, uploadWorkController } from "../controllers/workController";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", fetchWorksController);
router.post("/", auth(["admin"]), upload.single("image"), uploadWorkController);
router.put("/:id", auth(["admin"]), upload.single("image"), updateWorkController);
router.delete("/:id", auth(["admin"]), deleteWorkController);

export default router;