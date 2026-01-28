import React from "react";
import QuizLayout from "../../layouts/QuizLayouts";

function StartQuiz() {
  const quizzes = {
    _id: "69442e91f1c6bab7488ee0fa",
    title: "Homepage Demo Quiz",
    description:
      "A quick interactive quiz to test the platform and engage students.",
    questions: [
      {
        type: "mcq",
        questionText: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<url>", "<href>", "<a>"],
        correctAnswerIndex: 3,
        marks: 1,
        explanation: "The <a> tag defines a hyperlink in HTML.",
        difficulty: "easy",
        _id: "69442f41f1c6bab7488ee0fb",
      },
      {
        type: "mcq",
        questionText: "JavaScript is primarily used for:",
        options: [
          "Styling web pages",
          "Adding interactivity",
          "Database management",
          "Structuring content",
        ],
        correctAnswerIndex: 1,
        marks: 1,
        explanation:
          "JavaScript adds interactivity and dynamic behavior to web pages.",
        difficulty: "easy",
        _id: "69442f57f1c6bab7488ee0fc",
      },
      {
        type: "true_false",
        questionText: "React is a backend framework.",
        options: ["True", "False"],
        correctAnswerIndex: 1,
        marks: 1,
        explanation:
          "React is a frontend JavaScript library for building UI components.",
        difficulty: "easy",
        _id: "69442f6ef1c6bab7488ee0fd",
      },
      {
        type: "fill_blank",
        questionText: "CSS stands for Cascading ______ Sheets.",
        correctAnswerText: "Style",
        marks: 1,
        explanation:
          "CSS stands for Cascading Style Sheets, used to style HTML elements.",
        difficulty: "easy",
        _id: "69442f82f1c6bab7488ee0fe",
      },
    ],
    totalMarks: 4,
    passingMarks: 2,
    timeLimit: 10,
    status: "published",
  };

  return (
    <div>
      <QuizLayout quiz={quizzes} />
    </div>
  );
}

export default StartQuiz;
