import { Navigate, Outlet } from "react-router-dom";
import { lazy } from "react";

const AuthLayout = lazy(() => import("@/features/auth-layout/auth-layout"));
const Login = lazy(() => import("@/features/auth-layout/login/login"));
const Layout = lazy(() => import("@/features/layout/layout"));
const Module = lazy(() => import("@/features/module/module"));
const Content = lazy(() => import("@/features/module/content/content"));
const AddContent = lazy(
  () => import("@/features/module/content/add-content/add-content")
);
const AddPlaylist = lazy(
  () => import("@/features/playlist/add-playlist/add-playlist")
);
const PlaylistDetail = lazy(
  () => import("@/features/playlist/playlist-detail/playlist-detail")
);
const AddUser = lazy(() => import("@/features/user/add-user/add-user"));

const User = lazy(() => import("@/features/user/user"));
const Playlist = lazy(() => import("@/features/playlist/playlist"));
const ForgotPassword = lazy(
  () => import("@/features/auth-layout/forgot-password/forgot-password")
);
const ResetPassword = lazy(
  () => import("@/features/auth-layout/reset-password/reset-password")
);
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
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: "/module",
        element: <Module />,
      },
      {
        path: "/content",
        element: <Content />,
      },
      {
        path: "/add-content",
        element: <AddContent />,
      },
      {
        path: "/playlist",
        element: <Playlist />,
      },
      {
        path: "/add-playlist",
        element: <AddPlaylist />,
      },
      {
        path: "/playlist-detail",
        element: <PlaylistDetail />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/add-user",
        element: <AddUser />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
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
    path: "*",
    element: <Navigate to="/login" />,
  },
];
