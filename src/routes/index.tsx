import { Navigate } from "react-router-dom";
import { lazy } from "react";

const AuthLayout = lazy(() => import('@/features/auth-layout/auth-layout'));
const Login = lazy(() => import('@/features/auth-layout/login/login'));
const Layout = lazy(() => import('@/features/layout/layout'));
const Module = lazy(() => import('@/features/module/module'));
const User = lazy(() => import('@/features/user/user'));
const Playlist = lazy(() => import('@/features/playlist/playlist'));
const ForgotPassword = lazy(() => import('@/features/auth-layout/forgot-password/forgot-password'));
const ResetPassword = lazy(() => import('@/features/auth-layout/reset-password/reset-password'));
export const AppRoutes = [
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/module",
    element: (
      <Layout>
        <Module />
      </Layout>
    ),
  },
  {
    path: "/user",
    element: (
      <Layout>
        <User />
      </Layout>
    ),
  },
  {
    path: "/playlist",
    element: (
      <Layout>
        <Playlist />
      </Layout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Layout>
        <ResetPassword />
      </Layout>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  }
];
