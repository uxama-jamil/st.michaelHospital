import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";

import storage from "@/utils/storage";
import { loggedInUserMapper } from "@/utils/mappers";

// type AuthType = {
//   token: string;
//   user;
//   loginAction: (data) => void;
//   logOut: () => void;
// };

const AuthContext = createContext({});

const getUserFromLocalStorage = () => {
  const storedUser = storage.getItem("auth");
  return storedUser ? JSON.parse(storedUser) : null;
};

const getTokenFromLocalStorage = (): string => storage.getItem("token") || "";

function AuthProvider({ children }) {
  const [user, setUser] = useState(getUserFromLocalStorage);
  const [token, setToken] = useState<string>(getTokenFromLocalStorage || "");

  const loginAction = useCallback(async (data) => {
    const { refreshToken, isRememberMe = false } = data;
    localStorage.setItem("isRememberMe", JSON.stringify(isRememberMe));
    const decoded = jwtDecode(data.token);
    const loggedInUser = loggedInUserMapper(decoded);
    setUser(loggedInUser);
    storage.setStorage(isRememberMe);
    storage.setItem("auth", JSON.stringify(loggedInUser));
    storage.setItem("token", data.token);
    storage.setItem("refreshToken", refreshToken);
  }, []); // Empty dependency array means this function won't change unless props/state used inside it change

  const logOut = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
    setUser({});
    setToken("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loginAction,
      logOut,
    }),
    [user, token, loginAction, logOut] // Added logOut as a dependency
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
