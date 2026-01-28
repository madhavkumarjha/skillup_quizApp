import { useState } from "react";
// import React,useState from "react";
import { Trash2, SquarePen } from "lucide-react";
import DeleteConfirmModal from "../modals/DeleteModal";


function TableFormat({ header, data, isEdit, handleDelete,dataFields }) {
  const [modalOpen, setModalOpen] = useState(false);

  const getNestedValue = (obj, path) => { return path.split(".").reduce((acc, key) => acc?.[key], obj); };

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
              className="hover:bg-green-50 transition duration-150"
            >
            {dataFields.map((field, i) => ( <td className="py-3 px-4 border-b" key={i}> {getNestedValue(item, field)} </td> ))}
              <td className="py-3 px-4 border-b ">
                <div className="flex gap-2 items-center justify-between">
                  {isEdit && (
                    <button className="text-green-500 hover:text-green-700">
                      <SquarePen />
                    </button>
                  )}
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
                  type={"student"}
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

export default TableFormat;
