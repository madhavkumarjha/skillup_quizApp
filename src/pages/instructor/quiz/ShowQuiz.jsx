import React from "react";
import QuestionTable from "../../../components/tables/QuestionTable";
import { useParams } from "react-router-dom";
import { useGetQuizByIdQuery } from "../../../redux/features/api/quiz/quizApi";
import Loader from "../../../components/loader/Loader";

function ShowQuiz() {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetQuizByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  if (isError) {
    return <p>Something went wrong</p>;
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <h1 className="text-2xl">Quiz Details</h1>
      <QuestionTable questions={data?.quiz?.questions} />
    </div>
  );
}

export default ShowQuiz;
