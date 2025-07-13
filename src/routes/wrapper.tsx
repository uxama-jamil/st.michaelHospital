import { useAuth } from '@/context/auth-provider';
import ModuleProvider from '@/context/module';
import Layout from '@/components/layouts/dashboard';
import { useLocation } from 'react-router-dom';

import { Navigate } from 'react-router-dom';
import { AUTH_ROUTES, ROUTE_PATHS } from '@/constants/route';

export function PrivateRoute({ children }) {
  const token = sessionStorage.getItem('token');

  if (!token) return <Navigate to={ROUTE_PATHS.LOGIN} replace />;

  return (
    <ModuleProvider>
      <Layout>{children}</Layout>
    </ModuleProvider>
  );
}

export function RedirectIfAuthenticated({ children }) {
  const { user } = useAuth();
  const token = sessionStorage.getItem('token');
  const location = useLocation();
  // Redirect authenticated users from the login page to projects page
  if (
    (location.pathname === ROUTE_PATHS.LOGIN ||
      location.pathname === ROUTE_PATHS.FORGOT_PASSWORD ||
      location.pathname === ROUTE_PATHS.EMAIL_SENT ||
      location.pathname === ROUTE_PATHS.TWO_FACTOR_AUTH) &&
    token
  ) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === AUTH_ROUTES.TWO_FACTOR_AUTH && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
