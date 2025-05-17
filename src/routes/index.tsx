import ModulesManagement from "../features/modules/module";
import Login from "@/features/auth/Login";
import LoginForm from "../features/auth/login-form";
import Layout from "../features/layout";
import User from "../features/users/user";
import Playlist from "@/features/playlists/playlist";
import ForgotPassword from "@/features/auth/forgot-password/forgot-password";
import { Navigate } from "react-router-dom";
// import ModulesManagement from '@/features/modules/module';
// Other pages...

export const AppRoutes = [
  {
    path: "/login",
    element: (
      <Login>
        <LoginForm />
      </Login>
    ),
  },
  {
    path: "/module",
    element: (
      <Layout>
        <ModulesManagement />
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
      <Login>
        <ForgotPassword />
      </Login>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];
