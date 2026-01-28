import { User } from '../models/user.models.js';
import { Course } from '../models/course.models.js';
import { filterUserData } from '../utils/filteredUserData.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken.js';
import { Quiz } from '../models/quiz.models.js';

// get all instructors
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select(
      '-password'
    );
    const filteredInstructors = instructors.map((instructor) => {
      const safeInstructor = filterUserData(instructor);
      return safeInstructor;
    });
    res.status(200).json({ instructors: filteredInstructors });
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    res.status(500).json({ error: error.message });
  }
};

// create a new instructor
export const createInstructor = async (req, res) => {
  try {
    const { name, email, password, bio, expertise } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Instructor already exists' });
    }

    const newInstructor = new User({
      name,
      email,
      password,
      role: 'instructor',
      bio,
      expertise,
    });

    const accessToken = generateAccessToken(newInstructor);
    const refreshToken = generateRefreshToken(newInstructor);

    newInstructor.refreshToken = refreshToken;
    await newInstructor.save();
    res
      .status(201)
      .json({ token: accessToken, refreshToken, user: newInstructor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// update instructor details
export const updateInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { name, email, bio, phone, expertise } = req.body;
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    if (name) instructor.name = name;
    if (email) instructor.email = email;
    if (bio) instructor.bio = bio;
    if (phone) instructor.phone = phone;
    if (expertise) instructor.expertise = expertise;

    await instructor.save();
    const safeInstructor = filterUserData(instructor);
    res
      .status(200)
      .json({ message: 'Instructor updated successfully', safeInstructor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get instructor by ID
export const getInstructorById = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    const safeInstructor = filterUserData(instructor);
    res.status(200).json({ safeInstructor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get instructor's students
export const getInstructorStudents = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    const students = await User.find({
      role: 'user',
      enrolledCourses: { $in: instructor._id },
    }).select('-password');
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getInstructorQuizzes = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    // fetch all quizzes created by this instructor
    const quizzes = await Quiz.find({ instructor: instructorId })
      .populate('instructor', 'name email bio')
      .populate('course', 'title description');
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get all courses of an instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // fetch all courses created by this instructor
    const courses = await Course.find({ instructor: instructorId }).populate(
      'instructor',
      'name email bio'
    );
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
