import express from "express";
import {
  addQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.controller";

import { authenticate, allowInstructor } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/:quizId", authenticate, allowInstructor, addQuestion); // Add question
router.get("/:quizId", authenticate, getQuestions); // Get all questions
router.get("/:quizId/:questionId", authenticate, getQuestionById); // Get one
router.put(
  "/:quizId/:questionId",
  authenticate,
  allowInstructor,
  updateQuestion
); // Update
router.delete(
  "/:quizId/:questionId",
  authenticate,
  allowInstructor,
  deleteQuestion
); // Delete

export default router;
