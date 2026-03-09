import { Link } from "react-router-dom";

function CustomLink({ children, to, className }) {
  return (
    <Link
      to={to}
      className={`dark:text-dark-subtle text-light-subtle  dark:hover:text-white transition ${className}`}
    >
      {children}
    </Link>
  );
}

export default CustomLink;
