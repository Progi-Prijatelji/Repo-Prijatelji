import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const token = localStorage.getItem("jwt");
  const role = localStorage.getItem("role"); // "admin"

  if (!token) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;
