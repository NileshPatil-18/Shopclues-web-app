import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  // if (!user || user.role !== 'admin') {
  //   // Redirect to home page with error message
  //   return <Navigate to="/" state={{ 
  //     from: location, 
  //     message: "Access denied. Admin privileges required." 
  //   }} replace />;
  // }

  return <Outlet />;
};

export default AdminProtectedRoute;