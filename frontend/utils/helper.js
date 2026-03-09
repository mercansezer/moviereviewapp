const isValidEmail = (email) => {
  const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return isValid.test(email);
};
export default isValidEmail;
