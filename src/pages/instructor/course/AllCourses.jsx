import React, { useState, useEffect } from "react";

import Loader from "../../../components/loader/Loader";
import CourseTable from "../../../components/tables/CourseTable";
// import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useGetInstructorCoursesQuery } from "../../../redux/features/api/course/courseApi";

function AllCourses() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const { data, isLoading, isError } = useGetInstructorCoursesQuery(user._id, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p className="text-red-500 text-center">Something went wrong!</p>;
  }
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl">
        All Courses
      </h1>
      <p className="text-center mt-4">
        This is the All Courses page for instructors.
      </p>

      <CourseTable
        isEdit={true}
        data={data?.courses}
        header={["Title",  "Category", "Status","Resources", "Action"]}
        // handleDelete={handleDelete}
      />
    </div>
  );
}

export default AllCourses;
