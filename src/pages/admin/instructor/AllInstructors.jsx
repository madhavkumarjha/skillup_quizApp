import React from "react";
import {
  useGetAllInstructorsQuery,
  useDeleteInstructorMutation,
} from "../../../redux/features/api/instructor/instructorApi";
import Loader from "../../../components/loader/Loader";
import toast from "react-hot-toast";
import TableFormat from "../../../components/tables/UserTable";

function AllInstructors() {
  const { data, isLoading, isError } = useGetAllInstructorsQuery();
  console.log("INSTRUCTOR DATA >>> ", data?.instructors);

  const [deleteInstructor] = useDeleteInstructorMutation();

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-red-600 font-semibold ">Something went wrong</p>;

  const handleDelete = async (id) => {
    console.log(id);
    if (!id) return toast.error("❌ Missing ID");

    try {
      await deleteInstructor(id).unwrap();
      toast.success("Instructor delete successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="overflow-x-hidden ">
      <h1 className="text-2xl pb-4">
        All Instructors
      </h1>
      <TableFormat
        header={["Name", "Email", "Phone Number", "Action"]}
        data={data?.instructors || []}
        dataFields={["name", "email", "phone"]}
        isEdit={false}
        idField="_id"
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default AllInstructors;
