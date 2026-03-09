function FormContainer({ children }) {
  return (
    <div className="dark:bg-primary bg-white fixed inset-0 -z-10 flex items-center justify-center">
      {children}
    </div>
  );
}

export default FormContainer;
