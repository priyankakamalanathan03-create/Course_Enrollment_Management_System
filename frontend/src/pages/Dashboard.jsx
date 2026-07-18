import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminApprovalPage from "./AdminApprovalPage";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <Navbar />
      {user?.role === "admin" ? (
        <AdminApprovalPage />
      ) : user?.role === "instructor" ? (
        <InstructorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
}
