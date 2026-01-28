import { User } from '../models/user.models.js';
import { filterUserData } from '../utils/filteredUserData.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken.js';

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Student already exists' });
    }
    const newStudent = new User({ name, email, password, role: 'student' });
    const accessToken = generateAccessToken(newStudent);
    const refreshToken = generateRefreshToken(newStudent);

    newStudent.refreshToken = refreshToken;
    await newStudent.save();
    res
      .status(201)
      .json({ token: accessToken, refreshToken, user: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const filteredStudents = students.map((student) => filterUserData(student));
    res.status(200).json({ students: filteredStudents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOne({
      _id: studentId,
      role: 'student',
    }).populate('enrolledCourses');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const safeStudent = filterUserData(student);
    res.status(200).json({ student: safeStudent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student details
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, phone } = req.body;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get all courses of a student
export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      _id: studentId,
      role: 'student',
    })
      .populate({
        path: 'enrolledCourses',
        populate: { path: 'instructor', select: 'name email bio' },
      })
      .select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ courses: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// enroll a student in a course
export const enrollStudentInCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: 'Student already enrolled in this course' });
    }
    student.enrolledCourses.push(courseId);
    await student.save();
    res
      .status(200)
      .json({ message: 'Student enrolled in course successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// mark lesson as completed for a student
export const completeLessonForStudent = async (req, res) => {
  try {
    const { studentId, lessonId } = req.params;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.completedLessons.includes(lessonId)) {
      return res
        .status(400)
        .json({ message: 'Lesson already completed by the student' });
    }
    student.completedLessons.push(lessonId);
    await student.save();
    res
      .status(200)
      .json({ message: 'Lesson marked as completed for the student' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// record quiz score for a student
export const recordQuizScoreForStudent = async (req, res) => {
  try {
    const { studentId, quizId } = req.params;
    const { score } = req.body;
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.quizScores.push({ quiz: quizId, score });
    await student.save();
    res.status(200).json({ message: 'Quiz score recorded for the student' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// leaderboard of students based on quiz scores
export const getStudentLeaderboard = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const leaderboard = students.map((student) => {
      const totalScore = student.quizScores.reduce(
        (acc, curr) => acc + curr.score,
        0
      );
      return { studentId: student._id, name: student.name, totalScore };
    });
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
