import {
  deleteInstructor,
  deleteStudent,
  getAdminById,
  // uploadAdminProfilePicture,
} from "../controllers/admin.controller.js";
import express from "express";
import { authenticate, allowAdmin } from "../middlewares/auth.middleware.js";
// import upload from "../utils/multer.js";

const router = express.Router();

// all admin route
router.get("/:adminId", authenticate, allowAdmin, getAdminById);



// Admin routes for managing instructors
router.delete(
  "/instructors/:instructorId",
  authenticate,
  allowAdmin,
  deleteInstructor
);

// admin routes for managing students
router.delete("/students/:studentId", authenticate, allowAdmin, deleteStudent);

export default router;
