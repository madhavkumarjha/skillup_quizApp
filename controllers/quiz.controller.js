import { Quiz } from '../models/quiz.models.js';
import { Course } from '../models/course.models.js';
import XLSX from 'xlsx';

// create a new Quiz
export const uploadQuizFromExcel = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { courseId } = req.body;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(403).json({
        message: 'Only instructors can create courses',
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No Excel file uploaded' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ message: 'Excel sheet is empty' });
    }

    const quiztitle = sheetData[0].title || 'Untitled Quiz';

    const questions = sheetData.map((row, index) => {
      let options = [];
      let correctIndex = null;
      const question = {
        questionText: row.questionText,
        marks: Number(row.marks) || 1,
        explanation: row.explanation || '',
        difficulty: row.difficulty || 'medium',
        type: row.type || 'mcq',
      };

      if (row.type === 'true_false') {
        options = ['True', 'False'];
        correctIndex = Number(row.correctAnswerIndex);
        if (correctIndex < 0 || correctIndex > 1) {
          throw new Error(`Invalid correctAnswerIndex at row ${index + 2}`);
        }
        question.options = options;
        question.correctAnswerIndex = correctIndex;
      } else if (row.type === 'mcq') {
        options = [row.option1, row.option2, row.option3, row.option4].filter(
          Boolean
        );
        correctIndex = Number(row.correctAnswerIndex);
        if (correctIndex < 0 || correctIndex >= options.length) {
          throw new Error(`Invalid correctAnswerIndex at row ${index + 2}`);
        }
        question.options = options;
        question.correctAnswerIndex = correctIndex;
      } else if (row.type === 'fill_blank') {
        if (!row.correctAnswerText) {
          throw new Error(`Missing correctAnswerText at row ${index + 2}`);
        }
        question.correctAnswerText = row.correctAnswerText;
      }

      return question;
    });

    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);

    const newQuiz = new Quiz({
      title: quiztitle,
      course: courseId,
      instructor: instructorId,
      questions,
      totalMarks,
      passingMarks: Math.floor(totalMarks * 0.4),
      status: 'draft',
      timeLimit: 15,
    });

    await newQuiz.save();

    course.quizzes.push(newQuiz._id);
    await course.save();

    res.status(201).json({
      message: 'Quiz uploaded successfully',
      quizId: newQuiz._id,
      totalQuestions: questions.length,
      totalMarks,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /quizzes?page=2&limit=20
export const getQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // default 10
    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find({})
      .populate('instructor', 'name email bio')
      .populate('course', 'title description')
      .skip(skip)
      .limit(limit);

    const total = await Quiz.countDocuments({});

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: quizzes,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// get Quiz details by ID
export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId)
      .populate('instructor', 'name email bio')
      .populate('course', 'title description');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// update Quiz details
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, maxAttempts, randomizeQuestions, timeLimit, passingMarks } =
      req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    if (title) quiz.title = title;
    if (maxAttempts) quiz.maxAttempts = maxAttempts;
    if (randomizeQuestions !== undefined)
      quiz.randomizeQuestions = randomizeQuestions;
    if (timeLimit) quiz.timeLimit = timeLimit;
    if (passingMarks) quiz.passingMarks = passingMarks;
    await quiz.save();
    res
      .status(200)
      .json({ success: true, message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// delete a Quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.course);
    if (course) {
      course.quizzes = course.quizzes.filter(
        (qId) => qId.toString() !== quizId
      );
      await course.save();
    }

    res
      .status(200)
      .json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get all Quizzes for a Course
export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId })
      .populate('instructor', 'name email bio')
      .populate('course', 'title description');
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get all Quizzes created by an Instructor
export const getQuizzesByInstructor = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const quizzes = await Quiz.find({ instructor: instructorId })
      .populate('course', 'title')
      .populate('course', 'title description');
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const { status } = req.body;
    if (status) quiz.status = status;
    await quiz.save();
    res.status(200).json({
      success: true,
      message: 'Quiz status updated successfully',
      status: status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
