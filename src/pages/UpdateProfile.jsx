import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../redux/features/api/helperApi";
import toast from "react-hot-toast";
import Loader from "../components/loader/Loader";
import { Plus, X } from "lucide-react";

function UpdateProfile() {
  const location = useLocation();
  const userId = location.state?.userId;
  const { data, isLoading, isError } = useGetUserProfileQuery(userId);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data?.user) {
      setFormData(data.user);
    }
  }, [data]);

const addExpertise = () => {
  setFormData((prev) => ({
    ...prev,
    expertise: [...(prev.expertise || []), ""], // ✅ use "expertise"
  }));
};

// Update expertise at a given index
const updateExpertise = (index, value) => {
  const updated = [...(formData.expertise || [])];
  updated[index] = value;
  setFormData((prev) => ({
    ...prev,
    expertise: updated,
  }));
};

// Delete expertise at a given index
const deleteExpertise = (index) => {
  const updated = (formData.expertise || []).filter((_, i) => i !== index);
  setFormData((prev) => ({
    ...prev,
    expertise: updated, 
  }));
};

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ id: formData._id, data: formData }).unwrap();
      console.log(formData);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };
  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-red-600 font-semibold ">Something went wrong</p>;

  return (
    <div className="">
      <div className="flex">
        <h1 className="text-2xl  mb-4">Update Profile</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData?.name || ""}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email || ""}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {formData?.bio && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bio"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                onChange={handleChange}
                value={formData?.bio || ""}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
          )}

          {formData?.phone && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <textarea
                id="phone"
                name="phone"
                value={formData?.phone || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
          )}

          { formData.role ==="instructor" && (
            <div>
              <label className="flex gap-2 text-gray-700 items-center font-bold text-sm mb-2">
                Experties{" "}
                <Plus
                  className="bg-blue-500 text-white rounded-full"
                  cursor={"pointer"}
                  size={18}
                  onClick={addExpertise}
                />
              </label>
              {formData?.expertise?.map((exp, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={exp}
                    onChange={(e) => updateExpertise(index, e.target.value)}
                    className="shadow-md rounded-lg text-sm text-gray-700 px-4 py-2  focus:outline-none border-b border-white w-full mb-1"
                  />
                  <X
                    onClick={() => deleteExpertise(index)}
                    className="cursor-pointer text-red-500"
                  />
                </div>
              ))}
            </div>
           )} 
          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
