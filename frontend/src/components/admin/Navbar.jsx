import { Link, NavLink } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { MdMovie } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/index";
function Navbar() {
  const { handleLogOut } = useAuth();

  return (
    <nav className="bg-secondary w-48 min-h-screen border-r border-gray-300 flex flex-col justify-between">
      <ul className="pl-5">
        <li className="mb-8">
          <Link to="/">
            <img src="./logo.png" alt="logo" className="h-14 p-2" />
          </Link>
        </li>
        <li>
          <NavItem to="/">
            <CiHome />
            <span> Home</span>
          </NavItem>
        </li>
        <li>
          <NavItem to="/movies">
            <MdMovie /> <span>Movies</span>
          </NavItem>
        </li>
        <li>
          <NavItem to="/actors">
            <FaUserTie />
            <span> Actors</span>
          </NavItem>
        </li>
      </ul>
      <div className="text-center items-start pb-5">
        <span className="font-semibold text-white text-xl block mb-2">
          Admin
        </span>
        <button
          className="flex items-center mx-auto text-dark-subtle space-x-1 text-sm hover:text-white transition-all cursor-pointer "
          onClick={handleLogOut}
        >
          <IoLogOutOutline />
          <span>Log out</span>
        </button>
      </div>
    </nav>
  );
}

function NavItem({ children, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 p-2 text-lg hover:opacity-80 ${
          isActive ? "text-white" : "text-gray-400"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default Navbar;
