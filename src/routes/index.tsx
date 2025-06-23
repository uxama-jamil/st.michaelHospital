// src/routes/index.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { lazy } from 'react';
import { HeaderProvider } from '@/context/header';
import EmailSent from '@/containers/auth/forgot-password/email-sent';
import { PrivateRoute, RedirectIfAuthenticated } from './wrapper';
import {
  ROUTE_PATHS,
  AUTH_ROUTES,
  MODULES_ROUTES,
  PLAYLIST_ROUTES,
  USER_ROUTES,
} from '@/constants/route';
import type { RouteConfig } from '@/constants/route';
import Error404 from '@/components/errors/error404';

// Auth Components
const AuthLayout = lazy(() => import('@/components/layouts/auth-layout'));
const Login = lazy(() => import('@/containers/auth/login'));
const ForgotPassword = lazy(() => import('@/containers/auth/forgot-password'));
const SetPassword = lazy(() => import('@/containers/auth/set-password'));
const ResetPassword = lazy(() => import('@/containers/reset-password'));
const Profile = lazy(() => import('@/containers/profile'));

// Module Components
const Modules = lazy(() => import('@/containers/module'));
const AddModule = lazy(() => import('@/containers/module/add-module'));
const Content = lazy(() => import('@/containers/module/content'));
const AddContent = lazy(() => import('@/containers/module/content/add-content'));

// Playlist Components
const Playlist = lazy(() => import('@/containers/playlist'));
const AddPlaylist = lazy(() => import('@/containers/playlist/add-playlist'));
const PlaylistDetail = lazy(() => import('@/containers/playlist/playlist-detail'));

// User Components
const UserManagement = lazy(() => import('@/containers/user-management'));
const AddUser = lazy(() => import('@/containers/user-management/add-user'));
const EditUser = lazy(() => import('@/containers/user-management/edit-view-user'));

// Authentication Routes
const authRoutes: RouteConfig[] = [
  {
    path: AUTH_ROUTES.LOGIN,
    element: (
      <RedirectIfAuthenticated>
        <AuthLayout>
          <Login />
        </AuthLayout>
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: AUTH_ROUTES.FORGOT_PASSWORD,
    element: (
      <RedirectIfAuthenticated>
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: AUTH_ROUTES.EMAIL_SENT,
    element: (
      <RedirectIfAuthenticated>
        <AuthLayout>
          <EmailSent />
        </AuthLayout>
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: AUTH_ROUTES.SET_PASSWORD,
    element: (
      <AuthLayout>
        <SetPassword />
      </AuthLayout>
    ),
  },
];

// Module Routes
const moduleRoutes: RouteConfig[] = [
  {
    path: MODULES_ROUTES.BASE,
    element: <Modules />,
  },
  {
    path: MODULES_ROUTES.ADD,
    element: <AddModule />,
  },
  {
    path: MODULES_ROUTES.EDIT,
    element: <AddModule />,
  },
  {
    path: MODULES_ROUTES.CONTENT.BASE,
    element: <Content />,
  },
  {
    path: MODULES_ROUTES.CONTENT.ADD,
    element: <AddContent />,
  },
  {
    path: MODULES_ROUTES.CONTENT.EDIT,
    element: <AddContent />,
  },
];

// Playlist Routes
const playlistRoutes: RouteConfig[] = [
  {
    path: PLAYLIST_ROUTES.BASE,
    element: <Playlist />,
  },
  {
    path: PLAYLIST_ROUTES.ADD,
    element: <AddPlaylist />,
  },
  {
    path: PLAYLIST_ROUTES.EDIT,
    element: <AddPlaylist />,
  },
  {
    path: PLAYLIST_ROUTES.DETAIL,
    element: <PlaylistDetail />,
  },
];

// User Management Routes
const userRoutes: RouteConfig[] = [
  {
    path: USER_ROUTES.BASE,
    element: <UserManagement />,
  },
  {
    path: USER_ROUTES.ADD,
    element: <AddUser />,
  },
  {
    path: USER_ROUTES.EDIT,
    element: <EditUser />,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  {
    path: ROUTE_PATHS.PROFILE,
    element: <Profile />,
  },
];

// Root/Home Route
const rootRoute: RouteConfig = {
  path: ROUTE_PATHS.ROOT,
  element: <Navigate to={MODULES_ROUTES.BASE} />,
};

// Wildcard/404 Route
const wildcardRoute: RouteConfig = {
  path: ROUTE_PATHS.WILDCARD,
  element: <Error404 />,
};

const protectedRoutes: RouteConfig[] = [
  ...moduleRoutes,
  ...playlistRoutes,
  ...userRoutes,
  rootRoute,
];

export const AppRoutes: RouteConfig[] = [
  ...authRoutes,
  {
    element: (
      <HeaderProvider>
        <PrivateRoute>
          <Outlet />
        </PrivateRoute>
      </HeaderProvider>
    ),
    children: protectedRoutes,
  },
  wildcardRoute,
];
