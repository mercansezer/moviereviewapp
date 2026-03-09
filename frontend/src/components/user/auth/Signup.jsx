import { useEffect, useState } from "react";
import { commonClasses } from "../../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";
import FormContainer from "../../FormContainer";
import { createUser } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../../hooks";

const validateUserInfo = (name, email, password) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[a-zA-ZğĞşŞiİçÇöÖüÜ\s'-]+$/;
  //Check name
  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!nameRegex.test(name)) return { ok: false, error: "Invalid name!" };
  //Check email
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!emailRegex.test(email)) return { ok: false, error: "Invalid email!" };
  //Check password
  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const { updateNotification } = useNotification();

  const navigate = useNavigate();

  const { name, email, password } = userInfo;

  const handleChange = (e) => {
    const { value, name } = e.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ok, error } = validateUserInfo(name, email, password);

    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);

    if (response.error) return updateNotification("error", response.error);

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(
    function () {
      if (isLoggedIn) navigate("/");
    },
    [isLoggedIn, navigate]
  );
  //inset-0 "parent'ı tam kapla" demektir.
  return (
    <FormContainer>
      <Container>
        <form className={`${commonClasses} w-72`} onSubmit={handleSubmit}>
          <Title>Sign up</Title>
          <FormInput
            value={name}
            label="Name"
            placeholder="sezer mercan"
            name="name"
            onChange={handleChange}
          />
          <FormInput
            value={email}
            label="Email"
            placeholder="sezer@email.com  "
            name="email"
            onChange={handleChange}
          />
          <FormInput
            value={password}
            label="Password"
            placeholder="********"
            name="password"
            onChange={handleChange}
            type="password"
          />
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <CustomLink
              to="/auth/forget-password"
              className="hover:text-primary"
            >
              Forger password
            </CustomLink>
            <CustomLink to="/auth/signin" className="hover:text-primary">
              Sign in
            </CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Signup;
