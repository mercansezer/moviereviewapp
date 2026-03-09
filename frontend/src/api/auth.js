import client from "./client";

export const createUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/create", userInfo);

    return data;
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const verifyUserEmail = async (id, otp) => {
  try {
    const { data } = await client.post("/user/verify-email", {
      userId: id,
      OTP: otp,
    });
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const signInUser = async (email, password) => {
  try {
    const { data } = await client.post("/user/sign-in", {
      email,
      password,
    });

    return { data };
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const getIsAuth = async (token) => {
  try {
    const { data } = await client.get("/user/is-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const forgetPassword = async (email) => {
  try {
    const { data } = await client.post("/user/forget-password", {
      email,
    });

    return { data };
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const checkPasswordToken = async (token, id) => {
  try {
    const { data } = await client.post("/user/verify-pass-reset-token", {
      token,
      userId: id,
    });

    return { data };
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const resetPassword = async (password, id, token) => {
  try {
    const { data } = await client.post("/user/reset-password", {
      newPassword: password,
      userId: id,
      token,
    });

    return { data };
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

export const resendVerificationEmail = async (id) => {
  try {
    const { data } = await client.post("/user/resend-email-verification", {
      userId: id,
    });

    return { data };
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
