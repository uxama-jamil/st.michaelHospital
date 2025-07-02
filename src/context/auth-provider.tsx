import FullPageLoader from '@/components/ui/spin';
import api from '@/services/api';
import type { UserDetails } from '@/types/user-management';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthType = {
  token: string;
  user: any;
  loginAction: (userDetails: UserDetails) => void;
  twoFactorAction: (data: any) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthType>({} as AuthType);

// const getUserFromLocalStorage = () => {
//   const storedUser = localStorage.getItem('auth');
//   return storedUser ? JSON.parse(storedUser) : null;
// };

const getTokenFromLocalStorage = (): string => localStorage.getItem('token') || '';

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [token, setToken] = useState<string>(getTokenFromLocalStorage || '');

  const loginAction = useCallback((data) => {
    if (data) {
      setUser(data);
    }
  }, []);
  const twoFactorAction = useCallback((data) => {
    if (data) {
      setToken(data);
      sessionStorage.setItem('token', data);
    }
  }, []);
  const logOut = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.post('/auth/logout');
      if (res) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
        setUser(null);
        setToken('');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token') || '';
      if (token) {
        setToken(token);
      }
      if (token && !user) {
        try {
          const res = await api.get('/auth/me');

          const userDetails = res.data.data;
          if (userDetails) {
            setUser(userDetails);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUser();
  }, [token, user, logOut]);

  const value = useMemo(
    () => ({
      user,
      token,
      loginAction,
      setUser,
      twoFactorAction,
      logOut,
    }),
    [user, token, loginAction, logOut, setUser, twoFactorAction], // Added logOut as a dependency
  );

  return (
    <AuthContext.Provider value={value}>
      {loading && <FullPageLoader text="Logging out..." fullscreen={true} />}
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
