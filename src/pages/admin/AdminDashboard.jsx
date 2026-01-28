import AdminCard from "../../components/cards/adminCard";
import { useGetAllInstructorsQuery } from "../../redux/features/api/instructor/instructorApi";
import { useGetAllStudentsQuery } from "../../redux/features/api/student/studentApi";
import Loader from "../../components/loader/Loader";


function AdminDashboard() {
  // Instructors data
  const {
    data: instructorData,
    isLoading: instructorLoading,
    isError: instructorError,
  } = useGetAllInstructorsQuery();

  // Students data
  const {
    data: studentData,
    isLoading: studentLoading,
    isError: studentError,
  } = useGetAllStudentsQuery();

  // Loading state
  if (instructorLoading || studentLoading) return <Loader/>;

  // Error state
  if (instructorError || studentError)
    return <p className="text-red-600 font-semibold">Something went wrong</p>;

  const totalInstructors = instructorData?.instructors?.length || 0;
  const totalStudents = studentData?.students?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {/* Instructor Card */}
      <AdminCard
        title="Total Instructors"
        count={totalInstructors}
        type={"instructor"}
      />

      {/* Student Card */}
      <AdminCard
        title="Total Students"
        count={totalStudents}
        type={"student"}
      />
    </div>
  );
}

export default AdminDashboard;
