import { IoSunnySharp } from "react-icons/io5";
import Container from "../Container";
import CustomLink from "../CustomLink";
import { useAuth, useTheme } from "../../hooks/index";

function Navbar() {
  const { toggleTheme } = useTheme();

  const { authInfo, handleLogOut } = useAuth();

  const { isLoggedIn } = authInfo;

  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center text-white">
          <CustomLink to="/">
            <img src="/logo.png" alt="" className="h-10" />
          </CustomLink>

          <ul className="flex items-center space-x-4">
            <li>
              <button
                className="dark:bg-white bg-dark-subtle p-1 rounded cursor-pointer"
                onClick={toggleTheme}
              >
                <IoSunnySharp
                  className="text-secondary cursor-pointer"
                  size={24}
                />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white "
                placeholder="search..."
              />
            </li>
            {isLoggedIn ? (
              <button
                className="cursor-pointer text-white font-semibold text-lg"
                onClick={handleLogOut}
              >
                log out
              </button>
            ) : (
              <li className="text-white font-semibold text-lg">
                <CustomLink to="/auth/signin" className="text-white">
                  login
                </CustomLink>
              </li>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
