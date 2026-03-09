import ConfirmPassword from "./components/user/auth/ConfirmPassword";
import EmailVerification from "./components/user/auth/EmailVerification";
import ForgetPassword from "./components/user/auth/ForgetPassword";
import Signin from "./components/user/auth/Signin";
import Signup from "./components/user/auth/Signup";
import Navbar from "./components/user/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./components/NotFound";
import { useAuth } from "./hooks";
import AdminNavigator from "./navigator/AdminNavigator";

function App() {
  const { authInfo } = useAuth();

  const isAdmin = authInfo.profile?.role === "admin";

  if (isAdmin) return <AdminNavigator />;

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
