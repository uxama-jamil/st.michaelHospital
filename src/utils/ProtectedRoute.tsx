import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: any }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" replace />;
};
