import { useState } from "react";
// import React,useState from "react";
import { Trash2, SquarePen, View, Upload } from "lucide-react";
import DeleteConfirmModal from "../modals/DeleteModal";
import { useNavigate } from "react-router-dom";
import { useDeleteCourseMutation } from "../../redux/features/api/course/courseApi";
import toast from "react-hot-toast";

function CourseTable({ header, data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (item) => {
    navigate(`/instructor/course/update/${item._id}`);
  };

  const [deleteCourse] = useDeleteCourseMutation();

  const handleDelete = async (id) => {
    try {
      await deleteCourse({ id }).unwrap();
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden mt-4">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {header.map((head, key) => (
              <th
                key={key}
                className="py-3 px-4 text-left font-semibold border-b"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={"i" + index}
              className="hover:bg-green-50 transition duration-150 overflow-x-auto scroll-smooth"
            >
              <td className="py-3 px-4 border-b">{item.title}</td>
              <td className="py-3 px-4 border-b capitalize">{item.category}</td>
              <td className="py-3 px-4 border-b">{item?.status}</td>
              <td className="py-3 px-4 border-b">
                <div className="flex gap-2 items-center ">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(item)}
                  >
                    <View />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setModalOpen(true)}
                  >
                    <Upload />
                  </button>
                </div>
              </td>
              <td className="py-3 px-4 border-b ">
                <div className="flex gap-4 items-center ">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleEditClick(item)}
                  >
                    <SquarePen />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setModalOpen(true)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
              {modalOpen && (
                <DeleteConfirmModal
                  onClose={() => setModalOpen(false)}
                  type={"course"}
                  onConfirm={() => handleDelete(item._id)}
                />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseTable;
