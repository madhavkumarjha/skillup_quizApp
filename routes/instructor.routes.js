import {
  createInstructor,
  updateInstructor,
  getInstructorById,
  getInstructorStudents,
  getInstructorCourses,
  getAllInstructors,
  getInstructorQuizzes,
} from "../controllers/instructor.controller.js";

import express from "express";
import {
  authenticate,
  allowInstructor,
  allowAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Instructor routes
router.get("/all",getAllInstructors);
router.post("/create", authenticate, allowAdmin, createInstructor);
router.patch("/:instructorId", authenticate, allowInstructor, updateInstructor);
router.get("/:instructorId", authenticate, allowInstructor, getInstructorById);
router.get(
  "/:instructorId/students",
  authenticate,
  allowInstructor,
  getInstructorStudents
);

router.get(
  "/:instructorId/quizzes",
  authenticate,
  allowInstructor,
  getInstructorQuizzes
);

router.get(
  "/:instructorId/courses",
  authenticate,
  allowInstructor,
  getInstructorCourses
);

export default router;
