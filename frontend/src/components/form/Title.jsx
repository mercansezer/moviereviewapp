function Title({ children, className }) {
  return (
    <h1
      className={`text-xl dark:text-white text-secondary font-semibold text-center ${className}`}
    >
      {children}
    </h1>
  );
}

export default Title;
