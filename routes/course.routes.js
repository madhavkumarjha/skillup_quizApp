import express from "express";
import {
  authenticate,
  allowInstructor,
} from "../middlewares/auth.middleware.js";
import {
  createCourse,
  updateCourse,
  getCourseById,
  getPublishedCourses,
  deleteCourse,
  updateCourseStatus,
  getAllCourses,

} from "../controllers/course.controller.js";

const router = express.Router();

// Course routes
router.post("/create", authenticate, allowInstructor, createCourse);
router.patch("/status/:courseId", authenticate, allowInstructor, updateCourseStatus);
router.patch("/:courseId", authenticate, allowInstructor, updateCourse);
router.get("/get/:courseId", getCourseById);
router.get("/published", getPublishedCourses);
router.get("/all",getAllCourses );
router.delete("/:courseId", authenticate, allowInstructor, deleteCourse);


export default router;