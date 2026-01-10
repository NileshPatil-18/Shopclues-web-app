// src/components/AdminProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  console.log('AdminProtectedRoute Check:', {
    isLoggedIn,
    user,
    userRole: user?.role,
    isAdmin: user?.role === 'admin'
  });

  // Check if user is logged in
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (!user || user.role !== 'admin') {
    console.log('User is not admin, redirecting to home');
    console.log('User object:', user);
    console.log('Expected role "admin", got:', user?.role);
    return <Navigate to="/" state={{ 
      from: location, 
      message: "Access denied. Admin privileges required." 
    }} replace />;
  }

  console.log('User is admin, allowing access');
  return <Outlet />;
};

export default AdminProtectedRoute;