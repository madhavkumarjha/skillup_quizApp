import React from "react";
import InputBox from "../InputFields";

function QuizForm({ quizDetails, setQuizDetails, handleSubmit }) {
  const handleInputChange = (e) => {
    setQuizDetails({
      ...quizDetails,
      [e.target.name]: e.target.value,
    });
    // console.log(e.target.name, e.target.value);
  };
  return (
    <div className="flex flex-col gap-4 pl-20 pr-16">
      <h1 className="text-2xl">
        Quiz Details
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <InputBox
          label="Title"
          type="text"
          name="title"
          value={quizDetails?.title}
          onChange={handleInputChange}
        />
        <InputBox
          label="Passing Marks"
          type="number"
          name="passingMarks"
          value={quizDetails?.passingMarks}
          onChange={handleInputChange}
        />
        <InputBox
          label="Time Limit"
          type="number"
          name="timeLimit"
          value={quizDetails?.timeLimit}
          onChange={handleInputChange}
        />
        <InputBox
          label="Maximum Quiz Attempts"
          type="number"
          name="maxAttempts"
          value={quizDetails?.maxAttempts}
          onChange={handleInputChange}
        />
        <div className="flex flex-col mb-4">
          <label className="block text-gray-700 font-medium mb-2 mr-4">
            Randomize Questions
          </label>
          <select
            name="randomizeQuestions"
            value={quizDetails?.randomizeQuestions}
            onChange={handleInputChange}
            className="shadow-md focus:outline-none rounded-md p-2 w-full"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <button type="submit"
        className="text-white bg-blue-500 py-2 px-2 mx-[20%] max-w-[30%] font-semibold rounded-lg"
        >
            Update Quiz
        </button>
      </form>
    </div>
  );
}

export default QuizForm;
