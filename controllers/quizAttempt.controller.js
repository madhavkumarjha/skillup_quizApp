// import mongoose from "mongoose";
import { QuizAttempt } from "../models/quizAttempt.models";


export const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.body;
    const studentId = req.user.id;

    const existing = await QuizAttempt.findOne({ student: studentId, quiz: quizId, status: "in-progress" });
    if (existing) return res.status(400).json({ message: "Attempt already in progress" });

    const attempt = new QuizAttempt({ student: studentId, quiz: quizId });
    await attempt.save();

    res.status(201).json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const saveAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, answer } = req.body;
    const attempt = await QuizAttempt.findById(attemptId).populate("quiz");

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const question = attempt.quiz.questions.find(q => q._id.toString() === questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    let isCorrect = false;
    if (question.type === "mcq" || question.type === "true_false") {
      isCorrect = question.correctAnswerIndex === Number(answer);
    } else if (question.type === "fill_blank") {
      isCorrect = question.correctAnswerText.trim().toLowerCase() === answer.trim().toLowerCase();
    }

    attempt.answers.push({ questionId, answer, isCorrect });
    await attempt.save();

    res.json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const skipQuestion = async (req, res) => {
  try {
    const { attemptId, questionId } = req.body;
    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    // Mark question as skipped
    attempt.answers.push({ questionId, skipped: true });
    await attempt.save();

    res.json({ success: true, message: "Question skipped", attempt });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.body;
    const attempt = await QuizAttempt.findById(attemptId).populate("quiz");

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const score = attempt.answers.reduce((acc, ans, idx) => {
      const question = attempt.quiz.questions.find(q => q._id.toString() === ans.questionId.toString());
      return acc + (ans.isCorrect ? question.marks : 0);
    }, 0);

    attempt.score = score;
    attempt.status = "completed";
    attempt.completedAt = new Date();
    await attempt.save();

    res.json({
      success: true,
      message: "Attempt submitted successfully",
      score,
      passing: score >= attempt.quiz.passingMarks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
