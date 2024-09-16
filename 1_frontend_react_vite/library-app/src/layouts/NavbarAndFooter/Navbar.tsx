import { useOktaAuth } from "@okta/okta-react";
import { AlignJustify } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
// import LoginButton from "src/Auth/LoginButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "src/components/ui/navigation-menu";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

const Navbar = () => {
  // return <div className="bg-red-300">welcome!</div>;

  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    return <SpinnerLoading />;
  }

  const handleLogout = async () => oktaAuth.signOut();

  // console.log(authState);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-cyan-700">
      <NavLink to="/" className="m-4 text-xl font-bold text-white no-underline">
        Luv 2 Read
      </NavLink>

      <NavigationMenu className="right-2 z-10 sm:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="rounded-md bg-cyan-700 text-white hover:bg-cyan-700 hover:text-white">
              <AlignJustify />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex min-w-[150px] flex-col justify-center space-y-2 rounded-md bg-white p-4 shadow-lg">
              <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                <NavLink to="/home">Home</NavLink>
              </NavigationMenuLink>
              <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                <NavLink to="/search">Search</NavLink>
              </NavigationMenuLink>

              {authState.isAuthenticated && (
                <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                  <NavLink to="/shelf">Shelf</NavLink>
                </NavigationMenuLink>
              )}

              {authState.isAuthenticated && (
                <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                  <NavLink to="/fees">Pay fees</NavLink>
                </NavigationMenuLink>
              )}

              {authState.isAuthenticated &&
                authState.accessToken?.claims?.userType === "admin" && (
                  <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                    <NavLink to="/admin">Admin</NavLink>
                  </NavigationMenuLink>
                )}

              <NavigationMenuLink className="rounded-md px-2 py-1 hover:bg-gray-100">
                {!authState.isAuthenticated ? (
                  <NavLink to="/login">Sign in</NavLink>
                ) : (
                  <NavLink to="/signin" onClick={handleLogout}>
                    Logout
                  </NavLink>
                )}
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ul className="hidden sm:flex">
        <li className="list-none">
          <Link
            to="/home"
            className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
          >
            Home
          </Link>
        </li>
        <li className="list-none">
          <Link
            to="/search"
            className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
          >
            Search Book
          </Link>
        </li>
        {authState.isAuthenticated && (
          <li className="list-none">
            <Link
              to="/shelf"
              className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
            >
              Shelf
            </Link>
          </li>
        )}
        {authState.isAuthenticated && (
          <li className="list-none">
            <Link
              to="/fees"
              className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
            >
              Pay fees
            </Link>
          </li>
        )}
        {authState.isAuthenticated &&
          authState.accessToken?.claims?.userType === "admin" && (
            <li className="list-none">
              <Link
                to="/admin"
                className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
              >
                Admin
              </Link>
            </li>
          )}
        <li className="list-none">
          {!authState.isAuthenticated ? (
            <Link
              to="/login"
              className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
            >
              Sign in
            </Link>
          ) : (
            <Link
              to="/signin"
              className="mx-2 rounded-lg p-2 text-white no-underline hover:bg-cyan-600"
              onClick={handleLogout}
            >
              Logout
            </Link>
          )}

          {/* <LoginButton /> */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
