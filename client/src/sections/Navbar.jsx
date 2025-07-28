import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bell, Moon, Sun, ChevronDown } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

function Navbar() {
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const location = useLocation();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const staticLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
    ...(user ? [] : [{ to: "/login", label: "Login" }]),
  ];

  const userLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/vehicles", label: "Browse Vehicles" },
    { to: "/my-bookings", label: "My Bookings" },
  ];

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/add-vehicle", label: "Add Vehicle" },
    { to: "/vehicles", label: "All Vehicles" },
    { to: "/admin/vehicles", label: "Manage Vehicles" },
    { to: "/admin/bookings", label: "All Bookings" },
    { to: "/admin/feedback", label: "Feedbacks" },
  ];

  const roleLinks = user?.isAdmin ? adminLinks : user ? userLinks : [];

  return (
    <header className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700  text-white sticky top-0 z-50">
      <div className="max-w-7xl h-20 mx-auto px-4 max-md:px-2 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link to={"/"}>
            <img src="/logomain.png" className=" w-28  "></img>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden  px-1 hover:text-orange-500 hover:bg-white text-gray-800 dark:text-white  dark:hover:bg-gray-200 dark:hover:text-orange-500"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 font-medium">
          {[...staticLinks, ...roleLinks].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-black dark:text-white dark:hover:text-orange-500 hover:text-orange-500 focus:underline transition"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {/* Role Badge */}
          {user && (
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                user.isAdmin
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-200 text-blue-800"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          {/* Theme Switch */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="text-black dark:text-white dark:hover:text-orange-500 hover:text-orange-500 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Avatar + Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none "
              >
                <img
                  src={
                    user.avatar ? `${SERVER_URL}${user.avatar}` : "/logo.png"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full bg-orange-300 object-cover border"
                />
                <ChevronDown size={16} className="text-orange-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-orange-300 text-black rounded shadow-md py-2 w-40 dark:bg-gray-800 dark:text-white z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-orange-400 hover:text-white dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-orange-400 hover:text-white dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden dark:bg-gray-900 backdrop-blur-sm px-4 pb-4 pt-2 flex flex-col space-y-3 text-white shadow-lg">
          {[...staticLinks, ...roleLinks].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-orange-500 dark:hover:text-orange-500 text-black dark:text-white text-lg font-medium transition"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="text-left text-lg font-semibold hover:text-red-700 dark:hover:text-red-600 text-red-500 dark:text-white mt-2"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
