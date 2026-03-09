import { useEffect, useRef, useState } from "react";
import Container from "../../Container";
import Submit from "../../form/Submit";
import Title from "../../form/Title";
import FormContainer from "../../FormContainer";
import { commonClasses } from "../../../../utils/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { resendVerificationEmail, verifyUserEmail } from "../../../api/auth";
import { useAuth, useNotification } from "../../../hooks";

function isValidOtp(otp) {
  const value = !otp.some((val) => val === "");

  return value;
}

const OTP_LENGTH = 6;

function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));

  const { updateNotification } = useNotification();

  const inputRef = useRef([]);

  const { isAuth, authInfo } = useAuth();

  const isVerified = authInfo.profile?.isVerified;

  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const { state } = useLocation();

  const user = state?.user;

  function handleOtpChange(e, index) {
    let newOtpArr = [...otp];
    newOtpArr[index] = e.target.value.substring(
      e.target.value.length - 1,
      e.target.value.length,
    );
    setOtp(newOtpArr);
    inputRef.current[index + 1].focus();
  }

  function handleKeyDown(e, index) {
    if (e.code === "Backspace") {
      let newOtpArr = [...otp];
      newOtpArr[index] = "";

      setOtp(newOtpArr);
    } else if (e.code === "ArrowRight") {
      inputRef.current[index + 1].focus();
    } else if (e.code === "ArrowLeft") {
      inputRef.current[index - 1].focus();
    }
  }
  /////////////
  async function handleSubmit(e) {
    e.preventDefault();
    const result = isValidOtp(otp);
    if (!result) return updateNotification("error", "Invalid OTP");
    const response = await verifyUserEmail(user.id, otp.join(""));
    if (response.error) return updateNotification("error", response.error);
    updateNotification("success", response.message);

    localStorage.setItem("auth-token", response.user.token);
    isAuth();
  }
  async function handleResendOtp() {
    const { data, error } = await resendVerificationEmail(user.id);
    if (error) return updateNotification("error", error);
    updateNotification("success", data.message);
  }

  useEffect(
    function () {
      inputRef.current[0].focus();
      if (!user) {
        navigate("/not-found");
      }
      if (isLoggedIn && isVerified) {
        navigate("/");
      }
    },
    [user, navigate, isLoggedIn, isVerified],
  );
  return (
    <FormContainer>
      <Container>
        <form className={`${commonClasses}`} onSubmit={handleSubmit}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  key={index}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="number"
                  ref={(el) => {
                    inputRef.current[index] = el;
                  }}
                  //[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none google'dan çektim, number inputtaki yukarı aşağı iconları kaldırmak için kullandım.
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12 h-12 bg-transparent dark:border-dark-subtle dark:focus:border-white rounded border-2 outline-none dark:text-white text-center"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" />
            <button
              type="button"
              className="dark:text-white text-blue-500 font-semibold hover:underline mt-2 cursor-pointer"
              onClick={handleResendOtp}
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default EmailVerification;
