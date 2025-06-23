import { useAuth } from '@/context/auth-provider';
import ModuleProvider from '@/context/module';
import Layout from '@/components/layouts/dashboard';
import { useLocation } from 'react-router-dom';

import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <ModuleProvider>
      <Layout>{children}</Layout>
    </ModuleProvider>
  );
}

export function RedirectIfAuthenticated({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  // Redirect authenticated users from the login page to projects page
  if (
    (location.pathname === '/login' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/email-sent') &&
    token
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
