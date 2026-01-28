import { useState } from "react";
import CourseForm from "../../../components/form/CourseForm";
import { useCreateCourseMutation } from "../../../redux/features/api/course/courseApi";
import { toast } from "react-hot-toast";

function CreateCourse() {
  const initalData = {
    title: "",
    description: "",
    category: "",
    thumbnail: {
      url: "",
      fileId: "",
    },
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
  const [courseDetails, setCourseDetails] = useState(initalData);

  const [createCourse] = useCreateCourseMutation();

  const handleCreateCourse = async () => {
    try {
      const response = await createCourse(courseDetails).unwrap();
      toast.success("Course created successfully:", response);
      setCourseDetails(initalData);
    } catch (error) {
      toast.error("Failed to create course:", error);
    }
  };
  return (
    <div>
      <CourseForm
        setCourseDetails={setCourseDetails}
        courseDetails={courseDetails}
        isUpdate={false}
        handleSubmit={handleCreateCourse}
      />
    </div>
  );
}

export default CreateCourse;
