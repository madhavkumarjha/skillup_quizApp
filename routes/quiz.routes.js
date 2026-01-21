import express from "express";
import {
  authenticate,
  allowInstructor,
} from "../middlewares/auth.middleware.js";
import {
  uploadQuizFromExcel,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizzesByCourse,
  getQuizzesByInstructor,
  getQuizzes,
  updateQuizStatus
} from "../controllers/quiz.controller.js";
import { uploadExcel } from "../middlewares/uploadExcel.js";
const router = express.Router();

// Quiz routes
router.post(
  "/upload",
  authenticate,
  allowInstructor,
  uploadExcel.single("file"),
  uploadQuizFromExcel
);
router.get("/all", getQuizzes);
router.get("/get/:quizId", getQuizById);
router.patch("/:quizId", authenticate, allowInstructor, updateQuiz);
router.delete("/:quizId", authenticate, allowInstructor, deleteQuiz);
router.get("/course/:courseId", getQuizzesByCourse);
router.get(
  "/instructor/me",
  authenticate,
  allowInstructor,
  getQuizzesByInstructor
);
router.patch("/status/:quizId",authenticate,allowInstructor,updateQuizStatus)

export default router;
