import { Navigate, Outlet } from "react-router-dom";


const AdminProtectedRoute = () => {
  const token = localStorage.getItem("jwt");
  const admin = localStorage.getItem("isAdmin"); // "admin"

  if (!token) return <Navigate to="/" replace />;
  if (admin === "false") return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;
