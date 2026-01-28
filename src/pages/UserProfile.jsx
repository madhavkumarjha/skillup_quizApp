import { useSelector } from "react-redux";
import { Edit, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "../components/modals/ProfileModal";
import {
  useUpdateProfilePicMutation,
  useGetUserProfileQuery,
} from "../redux/features/api/helperApi";
import { toast } from "react-hot-toast";
import Loader from "../components/loader/Loader";

function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  const { data, isError, isLoading } = useGetUserProfileQuery(user._id);

  const [modalOpen, setModalOpen] = useState(false);
  console.log(data?.user);
  const navigation = useNavigate();

  const [updateProfilePic] = useUpdateProfilePicMutation();

  const goToUpdateProfile = () => {
    navigation(`/${user.role}/update/profile`, {
      replace: true,
      state: { userId: data?.user?._id }
    });
  };

  const handleProfilePicUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await updateProfilePic({ id: user._id, formData }).unwrap();
      toast.success("Profile picture updated successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile picture");
      console.error("Failed to update profile picture:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-red-600 font-semibold ">Something went wrong</p>;
  return (
    <div className="relative mt-30 max-w-sm mx-auto">
      <div className="rounded-lg overflow-visible shadow-lg bg-gray-50 relative pt-24">
        {/* Profile Image */}
        <Edit
          className="absolute -top-16 cursor-pointer right-[30%] z-30 text-green-600 hover:text-green-800"
          size={25}
          onClick={() => setModalOpen(true)}
        />
        <div className="absolute -top-20 w-full flex justify-center">
          <div className="h-36 w-36 border-4 border-gray-200 rounded-md">
            <img
              src={
                data?.user?.avatar?.url ||
                "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg"
              }
              className="rounded-md object-cover h-full w-full shadow-lg"
              alt="Hamza Ali"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h1 className="mb-1 text-2xl">
            {data?.user.name}
          </h1>
          <p className="capitalize text-gray-700 text-sm text-center italic">
            {data?.user.role==="instructor" ? data?.user.specializations : data?.user.role}
          </p>
          {
            data?.user?.bio &&
          <p className="text-gray-600 text-sm text-justify py-3">
            {data?.user.bio}
          </p>
          }
          {
            data?.user?.phone &&
          <p className="flex items-center justify-center text-gray-600 text-sm text-center">
            <PhoneCall size={20}/> {data?.user.phone}
          </p>
          }
          {modalOpen && (
            <ProfileModal
              onClose={() => setModalOpen(false)}
              onConfirm={(file) => handleProfilePicUpdate(file)}
            />
          )}
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={goToUpdateProfile}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
