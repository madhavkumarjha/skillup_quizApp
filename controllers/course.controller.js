import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import { deleteCourseMedia } from "./media.controller.js";

// create a new Course
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail, chapters, } = req.body;
    const instructorId = req.user._id;
    // console.log("Creating course for instructor:", req.user);

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can create courses" , success: false, instructor:instructor});
    }

    const newCourse = new Course({
      title,
      description,
      category,
      thumbnail,
      chapters,
      instructor: instructorId,
    });

    await newCourse.save();

    await User.findByIdAndUpdate(
      instructorId,
      {
        $push: { courses: newCourse._id },
        $inc: { totalCoursesCreated: 1 },
      },
      { new: true }
    );

    res.status(201).json({ success: true,message: "Course created successfully" });
  } catch (error) {
    res.status(500).json({ message: error || "Server error" });
  }
};

// publish or unpublish a Course
export const updateCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log(status);
    
    course.status = status;
    await course.save();
    res
      .status(200)
      .json({ success: true,message: "Course status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update Course details
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    Object.assign(course, req.body); // 🔥 Fast partial update
    await course.save();

    res.status(200).json({success: true, message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get Course details by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate(
      "instructor",
      "name email bio"
    );
    if (!course) {
      return res.status(404).json({ success: true,message: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete a Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }



    await User.findByIdAndUpdate(course.instructor, {
      $inc: { totalCoursesCreated: -1 },
      $pull: { courses: courseId },
    });

    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    await deleteCourseMedia(course);

    res.status(200).json({ success: true,message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// get all Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate(
      "instructor",
      "name email bio"
    );

    res.status(200).json({ success: true,courses });
  } catch (error) {
    console.log("COURSE ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all published Courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate(
      "instructor",
      "name email bio"
    );
    res.status(200).json({ success: true,courses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
