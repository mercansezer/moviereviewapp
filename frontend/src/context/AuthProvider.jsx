import { createContext, useEffect, useState } from "react";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

function AuthProvider({ children }) {
  //create state to hold auth info
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  //get notification updater
  const { updateNotification } = useNotification();

  //get navigate function
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });

    const { error, data } = await signInUser(email, password);

    if (error) {
      updateNotification("error", error);
      return setAuthInfo((prev) => ({ ...prev, isPending: false, error }));
    }
    if (!data.user) return;

    navigate("/", { replace: true });

    setAuthInfo({
      profile: { ...data.user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });

    localStorage.setItem("auth-token", data.user.token);
  };

  const isAuth = async function () {
    const token = localStorage.getItem("auth-token");

    if (!token) return;

    setAuthInfo({ ...authInfo, isPending: true });

    const { data, error } = await getIsAuth(token);

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error: error });
    }

    const { user } = data;

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });
  };

  function handleLogOut() {
    setAuthInfo({ ...defaultAuthInfo });
    localStorage.removeItem("auth-token");
    navigate("/", { replace: true });
  }

  useEffect(function () {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        authInfo,
        setAuthInfo,
        isAuth,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
