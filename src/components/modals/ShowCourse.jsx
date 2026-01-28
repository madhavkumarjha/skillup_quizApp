import React from "react";
import CourseLesson from "../CourseLessons";

function ShowCourse({ course, onClose }) {
  if (!course) return null; // don't render if no course selected

  return (
    <div className="fixed inset-0 bg-none bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-0 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">{course.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-48 object-cover rounded"
          />

          <p className="text-gray-700 text-justify">{course.description}</p>
          <p className="text-gray-700 font-semibold">{course.category}</p>

          <fieldset className="border-2 rounded-md border-blue-400 px-4 py-2 ">
            <legend className="text-center px-2 font-semibold text-blue-600 ">
              Instructor
            </legend>
            <div className="flex items-center justify-between mb-2">
              <p>🧑‍🏫{course.instructor.name}</p>
              <p>✉️{course.instructor.email}</p>
            </div>
            <p className="text-justify">🫆{course.instructor.bio}</p>
          </fieldset>
          <CourseLesson lessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}

export default ShowCourse;
