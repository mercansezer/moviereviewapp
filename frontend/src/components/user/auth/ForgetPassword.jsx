import { useState } from "react";
import { commonClasses } from "../../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";
import FormContainer from "../../FormContainer";
import { useNotification } from "../../../hooks";
import { forgetPassword } from "../../../api/auth";
import isValidEmail from "../../../../utils/helper";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  function handleChange({ target }) {
    const { value } = target;
    setEmail(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim())
      return updateNotification("error", "Please provide an email address");
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid email type");

    const { data, error } = await forgetPassword(email);
    if (error) return updateNotification("error", error);
    if (data.message) updateNotification("success", data.message);
  }
  return (
    <FormContainer>
      <Container>
        <form className={`${commonClasses} w-96 `} onSubmit={handleSubmit}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            label="Email"
            placeholder="sezer@email.com"
            name="email"
            onChange={handleChange}
            value={email}
          />
          <Submit value="Send Link" />
          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default ForgetPassword;
