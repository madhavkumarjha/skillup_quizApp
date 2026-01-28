import { useEffect, useState } from "react";
import CourseForm from "../../../components/form/CourseForm";
import {
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
} from "../../../redux/features/api/course/courseApi";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";

function UpdateCourse() {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetCourseByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const initialData = {
    title: "",
    description: "",
    category: "",
    thumbnail: { url: "", fileId: "" },
    chapters: [
      {
        title: "",
        summary: "",
        lessons: [
          {
            lesson_name: "",
            content: "",
            resources: [{ title: "", url: "", fileId: "" }],
          },
        ],
      },
    ],
  };

  const [courseDetails, setCourseDetails] = useState(initialData);

  useEffect(() => {
    if (data?.course) {
      setCourseDetails(data.course);
    }
  }, [data]);

  const [updateCourse] = useUpdateCourseMutation();

  const handleUpdateCourse = async () => {
    try {
      const res = await updateCourse({
        id: courseDetails?._id,
        ...courseDetails,
      }).unwrap();

      if (res.success) {
        toast.success("Course updated successfully");
      } else {
        // Handle non-2xx responses
        toast.error(res.message || "Error updating course");
      }
    } catch (error) {
      toast.error("Server unreachable or network error");
      console.log(error.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading course data</div>;
  }
  return (
    <div>
      <CourseForm
        setCourseDetails={setCourseDetails}
        courseDetails={courseDetails}
        isUpdate={true}
        handleSubmit={handleUpdateCourse}
      />
    </div>
  );
}

export default UpdateCourse;
