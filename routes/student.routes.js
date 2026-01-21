import {
  createStudent,
  getStudentById,
  getStudentLeaderboard,
  enrollStudentInCourse,
  getStudentCourses,
  updateStudent,
  getAllStudents,
} from "../controllers/student.controller.js";

import express from "express";
import { authenticate, allowStudent, allowAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student routes for managing students
router.get("/all",authenticate,allowAdmin,getAllStudents);
router.post("/create", createStudent);
router.post("/enroll/:studentId/:courseId", authenticate, allowStudent, enrollStudentInCourse);
router.patch("/:studentId", authenticate, allowStudent, updateStudent);
router.get("/:studentId", authenticate, allowStudent, getStudentById);
router.get(
  "/leaderboard/:studentId",
  authenticate,
  allowStudent,
  getStudentLeaderboard
);
router.get(
  "/courses/:studentId",
  authenticate,
  allowStudent,
  getStudentCourses
);

export default router;
