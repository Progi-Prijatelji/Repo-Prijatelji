import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("jwt");
    const admin = localStorage.getItem("isAdmin");

    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (admin === "true") return <Navigate to="/homeAdmin" replace />;

    return <Outlet />;
    }

export default ProtectedRoute;