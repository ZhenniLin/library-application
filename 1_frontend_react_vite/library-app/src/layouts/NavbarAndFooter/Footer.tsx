import { NavLink } from "react-router-dom";

const Footer = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="flex h-[10rem] flex-col items-center justify-center bg-cyan-700 p-5 sm:flex-row sm:justify-between">
      <p className="text-xs text-white">&copy; Example Libarary App, Inc</p>
      <ul className="flex space-x-4">
        <li className="list-none">
          <NavLink
            to="/home"
            className="rounded-lg text-xs text-white no-underline hover:text-cyan-950"
            onClick={() => handleScroll()}
          >
            Home
          </NavLink>
        </li>
        <li className="list-none">
          <NavLink
            to="/search"
            className="rounded-lg text-xs text-white no-underline hover:text-cyan-950"
            onClick={() => handleScroll()}
          >
            Search Book
          </NavLink>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
