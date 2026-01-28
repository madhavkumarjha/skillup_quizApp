import React from "react";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import QuizTable from "../../../components/tables/QuizTable";
import { useGetInstructorQuizzesQuery } from "../../../redux/features/api/quiz/quizApi";

function AllQuizzes() {
  const { user } = useSelector((state) => state.auth);
  const instructorId = user?._id;
  const { data, isLoading, isError } = useGetInstructorQuizzesQuery(
    instructorId,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error loading quizzes.</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl ">
        Quizzes
      </h1>
      <p className="text-center text-gray-500">
        All quizzes will be listed here.
      </p>
      <div className="mt-8">
        {data?.quizzes && data.quizzes.length > 0 ? (
          <QuizTable
            header={["Title", "Instructor", "Course", "Status", "Action"]}
            data={data.quizzes}
          />
        ) : (
          <div className="text-center text-gray-500">No quizzes found.</div>
        )}
      </div>
    </div>
  );
}

export default AllQuizzes;
