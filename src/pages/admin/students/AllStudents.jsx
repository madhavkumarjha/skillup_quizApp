import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
} from "../../../redux/features/api/student/studentApi";
import Loader from "../../../components/loader/Loader";
import TableFormat from "../../../components/tables/UserTable";
import toast from "react-hot-toast";

function AllStudents() {
  const { data, isLoading, isError } = useGetAllStudentsQuery(undefined, {
    pollingInterval: 8000, // refresh every 8 sec
  });

  const [deleteStudent] = useDeleteStudentMutation();

  if (isLoading) return <Loader />;
  if (isError) return <p>Something went wrong!</p>;

  const handleDelete = async (id) => {
    if (!id) return toast.error("❌ Missing ID");
    try {
      await deleteStudent(id).unwrap();
      toast.success("Student delete successfully");
    } catch (error) {
      console.error(error.message);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="overflow-x-hidden ">
      <h1 className="text-2xl pb-4">
        All Students
      </h1>
      <TableFormat
        header={["Name", "Email", "Phone Number", "Enrolled Courses", "Action"]}
        data={data?.students || []}
        dataFields={["name", "email", "phone", "enrolledCourse?.length||0"]}
        isEdit={false}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default AllStudents;
