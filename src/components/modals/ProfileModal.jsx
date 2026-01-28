import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react"; // lightweight icons

const ProfileModal = ({ onClose, onConfirm }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed  inset-0 z-50 flex justify-center items-center "
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <X className="w-4 h-4 text-black" />
            <span className="sr-only">Close modal</span>
          </button>

          {/* Modal content */}
          <div className="p-4 text-center">
            <label
              htmlFor="avatar"
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200"
            >
              <div>
                <p className="font-medium">Click to select</p>
                {file && (
                  <p className="text-green-700 font-semibold mt-2">
                    {file.name}
                  </p>
                )}
              </div>
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              disabled={!file}
              onClick={() => onConfirm(file)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
