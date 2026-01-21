import express from "express";
import multer from "multer";
import { getAuthParams,uploadImage,uploadMedia } from "../controllers/media.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({storage:multer.memoryStorage()});

router.get("/auth",getAuthParams);

router.post("/course",upload.single("file"),authenticate,uploadImage);
router.post("/media",upload.single("file"),authenticate,uploadMedia);

export default router;