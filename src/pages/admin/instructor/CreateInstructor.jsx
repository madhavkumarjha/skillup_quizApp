import React, { useState } from "react";
import InstructorForm from "../../../components/form/InstructorForm";
import { useCreateInstructorMutation } from "../../../redux/features/api/instructor/instructorApi";
import toast from "react-hot-toast";

function CreateInstructor() {
  const initialStructure = {
    name: "",
    email: "",
    password: "",
    bio: "",
    expertise: [""],
    phone: "",
  };
  const [instructorData, setInstructorData] = useState(initialStructure);

  const [createInstructor, { isLoading }] = useCreateInstructorMutation();

  // Add a new expertise
  const addExpertise = () => {
    setInstructorData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, ""],
    }));
  };

  // Update expertise at a given index
  const updateExpertise = (index, value) => {
    const updated = [...instructorData.expertise];
    updated[index] = value;
    setInstructorData((prev) => ({
      ...prev,
      expertise: updated,
    }));
  };

  // Delete expertise at a given index
  const deleteExpertise = (index) => {
    const updated = instructorData.expertise.filter((_, i) => i !== index);
    setInstructorData((prev) => ({
      ...prev,
      expertise: updated,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createInstructor(instructorData).unwrap();
      toast.success("Instructor created successfully");
      setInstructorData(initialStructure);
    } catch (error) {
      toast.error("Faied to create instructor");
      console.log(error?.data?.message);
    }
  }
  return (
    <div>
      <InstructorForm
        instructorData={instructorData}
        setInstructorData={setInstructorData}
        addExpertise={addExpertise}
        deleteExpertise={deleteExpertise}
        updateExpertise={updateExpertise}
      />
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-500 px-4 py-2 rounded-md text-white font-semibold my-3 md:mx-[40%] mx-[30%]"
      >
        {isLoading ? "Creating..." : "Create Instructor"}
      </button>
    </div>
  );
}

export default CreateInstructor;
