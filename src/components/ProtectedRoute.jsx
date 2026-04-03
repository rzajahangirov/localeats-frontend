import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const tokenKey = isAdmin ? 'adminToken' : 'accessToken';
  const token = localStorage.getItem(tokenKey);
  const location = useLocation();

  if (!token) {
    // Redirect to respective login if unauthenticated, saving the attempted path
    const redirectPath = isAdmin ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
