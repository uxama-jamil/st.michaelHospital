
import ModulesManagement from '../features/modules/module';
import Login from '../features/auth/Login';
import LoginForm from '../features/auth/login-form'
import Layout from '../features/layout';
import User from '../features/users/user';
import Playlist from '@/features/playlists/playlist';
// import ModulesManagement from '@/features/modules/module';
// Other pages...

export const AppRoutes = [
  {
    path:'/login',
    element: (
      <Login>
        <LoginForm />
      </Login>
    )
  },
  {
    path: '/module',
    element: (
      <Layout>
        <ModulesManagement />
      </Layout>
    )
  },
  {
    path: '/user',
    element: (
      <Layout>
        <User />
      </Layout>
    )
  },
  {
    path: '/playlist',
    element: (
      <Layout>
        <Playlist />
      </Layout>
    )
  },
  
]