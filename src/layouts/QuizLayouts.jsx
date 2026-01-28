import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const QuizLayout = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [reviewMode, setReviewMode] = useState(false);


const goHome = () => {  window.location.href = "/";
}

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = quiz.questions[currentIndex];

  useEffect(() => {
    if (submitted) return; // stop timer after submission

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true); // auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Calculate score when submitted
  const score = Object.values(answers).reduce(
    (acc, ans) => acc + (ans.isCorrect ? 1 : 0),
    0
  );

  const handleSave = (answer) => {
    if (!currentQuestion) return;

    let isCorrect = false;

    if (
      currentQuestion.type === "mcq" ||
      currentQuestion.type === "true_false"
    ) {
      isCorrect = currentQuestion.correctAnswerIndex === Number(answer);
    } else if (currentQuestion.type === "fill_blank") {
      isCorrect =
        currentQuestion.correctAnswerText.trim().toLowerCase() ===
          String(answer).trim().toLowerCase() ||
        String(answer)
          .trim()
          .toLowerCase()
          .startsWith(currentQuestion.correctAnswerText.trim().toLowerCase());
    }

    const questionKey = currentQuestion._id || currentIndex;

    setAnswers({
      ...answers,
      [questionKey]: { status: "saved", answer, isCorrect },
    });

    // Only auto-next if not last question
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;

    const questionKey = currentQuestion._id || currentIndex;

    setAnswers({
      ...answers,
      [questionKey]: { status: "skipped" },
    });

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReview = () => {
    setReviewMode(true);
  };

  useEffect(() => {
    const key = quiz.questions[currentIndex]._id || currentIndex;
    const prevAnswer = answers[key]?.answer ?? null;
    setSelectedAnswer(prevAnswer);
  }, [currentIndex]);

if (reviewMode) {
  return (
    <div className="flex md:flex-row flex-col  h-screen bg-gray-50">
      {/* Sidebar with quick status */}
      <div className="w-64 md:border-r-2 md:border-b-0 border-b-2 p-4">
        <h3 className="font-semibold mb-4">Review Progress</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, idx) => {
            const key = q._id || idx;
            const status = answers[key]?.status || "not_attempted";
            const color =
              status === "saved" && answers[key]?.isCorrect
                ? "bg-green-500"
                : status === "saved"
                ? "bg-red-500"
                : status === "skipped"
                ? "bg-yellow-500"
                : "bg-gray-300";
            return (
              <div
                key={key}
                className={`${color} text-white rounded w-10 h-10 flex items-center justify-center`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main review content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">📖 Review Answers</h2>
        {quiz.questions.map((q, idx) => {
          const key = q._id || idx;
          const userAns = answers[key]?.answer;
          const isCorrect = answers[key]?.isCorrect;

          const cardColor = isCorrect
            ? "bg-green-50 border-green-300"
            : answers[key]?.status === "skipped"
            ? "bg-yellow-50 border-yellow-300"
            : "bg-red-50 border-red-300";

          return (
            <div
              key={key}
              className={`mb-6 border rounded-lg p-4 shadow-sm ${cardColor}`}
            >
              <h3 className="font-semibold mb-2">
                Q{idx + 1}. {q.questionText}
              </h3>
              <p>
                Your Answer:{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {userAns !== null && userAns !== undefined
                    ? q.options
                      ? q.options[userAns]
                      : userAns
                    : "Skipped"}
                </span>
              </p>
              <p>
                Correct Answer:{" "}
                <span className="text-indigo-600">
                  {q.options
                    ? q.options[q.correctAnswerIndex]
                    : q.correctAnswerText}
                </span>
              </p>
              {q.explanation && (
                <p className="text-sm text-gray-500 mt-2">{q.explanation}</p>
              )}
            </div>
          );
        })}

        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setReviewMode(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Results
          </button>
          <button
            onClick={() => {
              setReviewMode(false);
              setSubmitted(false);
              setCurrentIndex(0);
              setAnswers({});
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

  

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-r from-indigo-50 to-purple-100">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
          <h2 className="text-3xl font-extrabold text-indigo-600 mb-4">
            🎉 Quiz Completed!
          </h2>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
            <p className="text-xl font-semibold text-gray-700">
              Your Score: <span className="text-indigo-600">{score}</span> /{" "}
              {quiz.totalMarks}
            </p>
            <p className="mt-2 text-gray-600">
              Passing Marks: {quiz.passingMarks} —{" "}
              {score >= quiz.passingMarks ? (
                <span className="text-green-600 font-bold">✅ Passed</span>
              ) : (
                <span className="text-red-600 font-bold">❌ Failed</span>
              )}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {setReviewMode(true)
                console.log(reviewMode);
                
              }}
            >
              Review Answers
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"  onClick={() => {
              setReviewMode(false);
              setSubmitted(false);
              setCurrentIndex(0);
              setAnswers({});
            }}>
              Retry Quiz
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={goHome}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex items-center justify-center h-screen md:bg-linear-to-r from-blue-100 to-purple-100 bg-linear-to-t  px-[10%] md:pt-0 sm:pt-10">
      {/* Left Panel: Question */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Q{currentIndex + 1}/{quiz.questions.length}
          </h2>
          <span className="text-red-600 font-semibold flex text-2xl items-center gap-2">
            <Timer /> {formatTime(timeLeft)}
          </span>
        </div>
        <p className="mb-4">{currentQuestion.questionText}</p>

        {currentQuestion.type === "mcq" && (
          <ul className="space-y-2">
            {currentQuestion.options.map((opt, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleSave(idx)}
                  className="w-full text-left p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-none font-semibold text-gray-500 "
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}

        {currentQuestion.type === "true_false" && (
          <div className="space-x-4">
            <button
              onClick={() => handleSave(0)}
              className="px-8 py-1.5 border-2 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-none hover:font-semibold hover:py-2 rounded font-semibold"
            >
              True
            </button>
            <button
              onClick={() => handleSave(1)}
              className="px-8 py-1.5 border-2 font-semibold text-red-500 rounded hover:text-white hover:bg-red-500 hover:border-none hover:font-semibold hover:py-2"
            >
              False
            </button>
          </div>
        )}

        {currentQuestion.type === "fill_blank" && (
          <input
            type="text"
            placeholder="Type your answer..."
            onBlur={(e) => handleSave(e.target.value)}
            className="border p-2 w-full rounded"
          />
        )}

        {/* Footer Controls */}
        <div className="mt-6 flex space-x-4  py-4 border-t-2 ">
          <>
            <button
              onClick={handleSkip}
              className="border-2 border-yellow-500 text-yellow-500 font-semibold  hover:bg-yellow-500 hover:text-white hover:font-bold px-8 py-2 rounded hover:border-none"
            >
              Skip
            </button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => handleSave(selectedAnswer)}
                disabled={selectedAnswer === null}
                className={`text-green-600 border-2 border-green-500 hover:bg-green-600 font-semibold hover:text-white px-4 py-2 rounded hover:font-bold hover:border-none
                ${
                  selectedAnswer === null
                    ? " cursor-not-allowed"
                    : "text-green-500"
                }
                `}
              >
                Save & Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                // disabled={selectedAnswer === null}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Submit Quiz
              </button>
            )}
          </>
        </div>
      </div>

      {/* Right Sidebar: Indexing */}
      <div className="w-64 md:border-l md:border-t-0  border-t-2 p-4 space-y-2">
        <h3 className="font-semibold mb-2">Questions</h3>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((q, idx) => {
            const key = q._id || idx;
            const status = answers[key]?.status || "not_attempted";
            const color =
              status === "saved"
                ? "bg-green-500 text-white"
                : status === "skipped"
                ? "bg-yellow-500 text-white"
                : "text-gray-400 border-gray-300 border-2 hover:text-white hover:bg-gray-300 hover:boder-none";
            return (
              <button
                key={key}
                onClick={() => setCurrentIndex(idx)}
                className={`${color} font-semibold rounded w-10 h-10`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizLayout;
