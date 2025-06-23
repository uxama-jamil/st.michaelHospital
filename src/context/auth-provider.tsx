import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthType = {
  token: string;
  user: any;
  loginAction: (data: any, userDetails: any) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthType>({} as AuthType);

const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem('auth');
  return storedUser ? JSON.parse(storedUser) : null;
};

const getTokenFromLocalStorage = (): string => localStorage.getItem('token') || '';

function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromLocalStorage);
  const [token, setToken] = useState<string>(getTokenFromLocalStorage || '');

  const loginAction = useCallback((data, userDetails) => {
    if (data) {
      setToken(data);
      setUser(userDetails);
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      localStorage.setItem('token', data);
    }
  }, []);

  const logOut = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    setUser({});
    setToken('');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loginAction,
      logOut,
    }),
    [user, token, loginAction, logOut], // Added logOut as a dependency
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
