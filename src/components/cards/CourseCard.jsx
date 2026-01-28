import { useState } from "react";
import ShowCourse from "../modals/ShowCourse";

function CourseCard({ course }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={course?.thumbnail?.url}
        alt="Placeholder Image"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2 text-justify">{course.description}</p>
        <div className="flex items-center justify-between my-2">
          <p className="text-gray-600 text-sm capitalize">
            <strong>Instructor:</strong> {course.instructor.name}
          </p>
          <p className="text-xs text-gray-600 capitalize"><strong>Category:</strong> {course.category}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          View Details
        </button>
      </div>
      {modalOpen && (
        <ShowCourse course={course} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

export default CourseCard;
