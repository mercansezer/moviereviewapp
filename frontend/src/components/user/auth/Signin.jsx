import { useEffect, useState } from "react";
import { commonClasses } from "../../../../utils/theme";
import { useAuth, useNotification } from "../../../hooks";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";
import FormContainer from "../../FormContainer";
import { useNavigate } from "react-router-dom";

const validateUserInfo = (email, password) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //Check email
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!emailRegex.test(email)) return { ok: false, error: "Invalid email!" };
  //Check password
  if (!password.trim()) return { ok: false, error: "Password is missing!" };

  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};
function Signin() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const { email, password } = userInfo;

  const { handleLogin, authInfo } = useAuth();

  const { isLoggedIn, isPending } = authInfo;

  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  function handleChange(e) {
    const { target } = e;
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { ok, error: validationError } = validateUserInfo(email, password);
    if (!ok) return updateNotification("error", validationError);

    handleLogin(email, password);
  }

  useEffect(
    function () {
      if (isLoggedIn) navigate("/");
    },
    [isLoggedIn, navigate],
  );
  //inset-0 "parent'ı tam kapla" demektir.
  return (
    //dark mode açıkken bg-primary kullanır, değilse eğer bg-white
    <FormContainer>
      <Container>
        <form className={`${commonClasses} w-72`} onSubmit={handleSubmit}>
          <Title>Sign in</Title>
          <FormInput
            label="Email"
            placeholder="sezer@email.com"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            placeholder="********"
            name="password"
            value={password}
            type="password"
            onChange={handleChange}
          />
          <Submit value="Sign in" busy={isPending} />
          <div className="flex justify-between">
            <CustomLink
              to="/auth/forget-password"
              className="hover:text-primary"
            >
              Forget Password
            </CustomLink>
            <CustomLink to="/auth/signup" className="hover:text-primary">
              Sign up
            </CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Signin;
