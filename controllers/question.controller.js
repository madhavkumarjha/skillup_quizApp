import { Quiz } from "../models/quiz.models";

export const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionText, options, correctAnswerIndex, marks } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const newQuestion = {
      questionText,
      options,
      correctAnswerIndex,
      marks: marks || 1,
    };

    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(201).json({
      message: "Question added successfully",
      newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { questionId, quizId } = req.body;
    const { questionText, options, correctAnswerIndex, marks } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const question = quiz.questions.id(questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (questionText) question.questionText = questionText;
    if (options) question.options = options;
    if (correctAnswerIndex !== undefined)
      question.correctAnswerIndex = correctAnswerIndex;
    if (marks !== undefined) question.marks = marks;

    await quiz.save();
    res.status(200).json({
      message: "Question updated successfully",
      question: {
        questionText,
        options,
        correctAnswerIndex,
        marks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const question = quiz.questions.id(questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    question.deleteOne();
    await quiz.save();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { quizId, questionId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const question = quiz.questions.id(questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json({
      question,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getQuestions = async () => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId).select("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ questions: quiz.questions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
