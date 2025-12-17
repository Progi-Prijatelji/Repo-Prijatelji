import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("jwt");
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;