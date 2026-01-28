import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCreateQuizMutation } from "../../../redux/features/api/quiz/quizApi";

import Loader from "../../../components/loader/Loader";
import { toast } from "react-hot-toast";
// import { Upload } from "lucide-react";
import { useGetInstructorCoursesQuery } from "../../../redux/features/api/course/courseApi";

function CreateQuiz() {
  const [courses, setCourses] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const instructorId = user?._id;
  const { data, isLoading, isError } =
    useGetInstructorCoursesQuery(instructorId);
  const [createQuiz] = useCreateQuizMutation();

  useEffect(() => {
    if (data?.courses) {
      const coursesList = data.courses.map((course) => ({
        id: course._id,
        title: course.title,
      }));
      setCourses(coursesList);
      // setCourses(data.courses)
    }
  }, [data]);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const courseId = e.target.course.value;

    // Create fresh FormData each submit
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("instructorId", instructorId);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await createQuiz(formData).unwrap();
      toast.success("Quiz created successfully");
      setSelectedFile(null); // ✅ correct reset
    } catch (error) {
      toast.error("Error creating quiz");
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Error loading courses.</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl">Create Quiz</h1>
      <form onSubmit={handleCreateQuiz}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Course</label>
          <select
            name="course"
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              -- Select a course --
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex my-2 items-center gap-4">
          <input
            type="text"
            value={selectedFile ? selectedFile.name : ""}
            placeholder="Quiz file upload"
            readOnly
            className="shadow-md rounded-lg px-4 py-2 focus:outline-none border-b text-gray-600 border-white w-full cursor-pointer"
            onClick={() => document.getElementById("file-upload-quiz").click()}
          />
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            id="file-upload-quiz"
            onChange={handleFileSelect}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
