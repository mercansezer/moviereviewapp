import { useNavigate, useSearchParams } from "react-router-dom";
import { commonClasses } from "../../../../utils/theme";
import Container from "../../Container";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";
import FormContainer from "../../FormContainer";
import { useState } from "react";
import { useNotification } from "../../../hooks";
import { checkPasswordToken, resetPassword } from "../../../api/auth";

function ConfirmPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  function handleChangePassword({ target }) {
    const { value } = target;
    setPassword(value);
  }
  function handleChangeConfirmPasswrod({ target }) {
    const { value } = target;
    setConfirmPassword(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !password.trim() ||
      !confirmPassword.trim() ||
      password.length < 8 ||
      confirmPassword.length < 8
    )
      return updateNotification(
        "error",
        "The password must be at least 8 characters"
      );

    if (!(password === confirmPassword))
      return updateNotification("error", "This two passwords should be same");

    const { error, data } = await checkPasswordToken(token, id);

    if (error) return updateNotification("error", error);

    const result = await resetPassword(password, id, token);

    if (result.error) return updateNotification("error", result.error);
    updateNotification("success", result.data.message);
    navigate("/auth/signin", { replace: true });
  }

  return (
    <FormContainer>
      <Container>
        <form className={`${commonClasses} w-96`} onSubmit={handleSubmit}>
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            placeholder="********"
            name="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
          />
          <FormInput
            label="Confirm Password"
            placeholder="********"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChangeConfirmPasswrod}
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}

export default ConfirmPassword;
