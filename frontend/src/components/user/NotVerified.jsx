import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";

function NotVerified() {
  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const isVerified = authInfo.profile?.isVerified;

  const navigate = useNavigate();

  function navigateToVerification() {
    navigate("/auth/verification", {
      state: { user: authInfo.profile },
      replace: true,
    });
  }
  return (
    <Container>
      {isLoggedIn && !isVerified ? (
        <p className="text-lg text-center bg-blue-50 p-2">
          It looks like you haven't verified your account,{" "}
          <button
            className="tex-blue-500 font-semibold hover:underline cursor-pointer"
            onClick={navigateToVerification}
          >
            click here to verify your account.
          </button>
        </p>
      ) : null}
    </Container>
  );
}

export default NotVerified;
