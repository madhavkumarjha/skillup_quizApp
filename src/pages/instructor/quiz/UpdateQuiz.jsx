import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
} from "../../../redux/features/api/quiz/quizApi";
import Loader from "../../../components/loader/Loader";
import QuizForm from "../../../components/form/QuizForm";
import { toast } from "react-hot-toast";

function UpdateQuiz() {
  const { id } = useParams();

  const [quizDetails, setQuizDetails] = useState({
    title: "",
    timeLimit: 0,
    maxAttempts: 1,
    randomizeQuestions: false,
  });
  const { data, isError, isLoading } = useGetQuizByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.quiz) {
      setQuizDetails(data?.quiz);
    }
  }, [data]);

  const [updateQuiz] = useUpdateQuizMutation();

const handleUpdateQuiz = async () => {
  try {
    const res = await updateQuiz({
      id: quizDetails?._id,
      ...quizDetails,
    });

    const response = await res.data; // parse JSON

    console.log(response);
    

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message || "Error updating quiz");
    }
  } catch (error) {
    toast.error("Server unreachable or network error");
    console.log(error.message);
  }
};


  if (isError) {
    return (
      <p className="text-center text-red-600 font-semibold text-lg">
        Some Went wrong
      </p>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <QuizForm
        quizDetails={quizDetails}
        setQuizDetails={setQuizDetails}
        handleSubmit={handleUpdateQuiz}
      />
    </div>
  );
}

export default UpdateQuiz;
