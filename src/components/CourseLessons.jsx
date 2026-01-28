import React from "react";

const CourseLesson = ({lessons}) => {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <details className="mb-2">
        <summary className="bg-gray-200 p-4 rounded-lg cursor-pointer shadow-md mb-4">
          <span className="font-semibold">Lessons</span>
        </summary>
        <ul className="ml-8 space-y-4">
          {lessons.map((lesson, index) => (
            <li key={index}>
              <details className="mb-2">
                <summary className="bg-gray-100 p-3 rounded-lg cursor-pointer shadow">
                  <span className="font-semibold">{lesson.lesson_name}</span>
                </summary>
                <div className="bg-white p-4">
                  <p className="text-gray-800">{lesson.content}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default CourseLesson;
