import { useState } from "react";
// import React,useState from "react";
import { Trash2, SquarePen } from "lucide-react";
import DeleteConfirmModal from "../modals/DeleteModal";
import { useNavigate } from "react-router-dom";
import {
  useDeleteQuizMutation,
  useUpdateStatusQuizMutation,
} from "../../redux/features/api/quiz/quizApi";
import toast from "react-hot-toast";

function QuizTable({ header, data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/instructor/quiz/update/${id}`);
  };

  const [deleteQuiz] = useDeleteQuizMutation();
  const [updateStatusQuiz] = useUpdateStatusQuizMutation();

  const handleDelete = async (id) => {
    try {
      await deleteQuiz({ id }).unwrap();
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course:", error);
    }
  };

  const handleStatusChange = async (quizId, status) => {
    try {
      const res = await updateStatusQuiz({
        id: quizId,
        status,
      });

      const response = await res.data;
      if (response.success) {
        toast.success("Status updated successfully");
      } else {
        toast.error("Status updation failed");
      }
    } catch (error) {
      toast.error(error.message || "Server unreachable or network error");
      console.log(error.message);
    }
  };

  const handleQuizShow = (id) => {
    navigate(`/instructor/quiz/show/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
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
              className="hover:bg-green-50 transition duration-150 cursor-pointer"
              onClick={() => handleQuizShow(item._id)}
            >
              <td className="py-3 px-4 border-b">{item.title}</td>
              <td className="py-3 px-4 border-b">{item?.instructor?.name}</td>
              <td className="py-3 px-4 border-b capitalize">
                {item?.course?.title}
              </td>
              <td className="py-3 px-4 border-b">
                <select
                  value={item.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(item._id, e.target.value);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {
                    ["draft", "published", "archived", "inactive"].map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                      </option>
                    ))
                  }
                </select>
              </td>
              <td className="py-3 px-4 border-b ">
                <div className="flex gap-2 items-center justify-between">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(item._id);
                    }}
                  >
                    <SquarePen />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuizId(item._id);
                      setModalOpen(true);
                    }}
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <DeleteConfirmModal
          onClose={(e) => {
            e.stopPropagation();
            setModalOpen(false);
          }}
          type={"quiz"}
          onConfirm={() => handleDelete(selectedQuizId)}
        />
      )}
    </div>
  );
}

export default QuizTable;
