import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserContext } from "../context/UserContext";

function NavbarSidebarLayout({ children }) {
  const { user, fetchUser } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUser(); // ensure latest info globally
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = user?.isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/add-vehicle", label: "Add Vehicle" },
        { to: "/admin/vehicles", label: "Manage Vehicles" },
        { to: "/admin/bookings", label: "All Bookings" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/vehicles", label: "Browse Vehicles" },
        { to: "/my-bookings", label: "My Bookings" },
      ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl">RentalApp</span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link to="/profile" className="hidden sm:inline underline">
                {user.name}
              </Link>
              {user.avatar ? (
                <Link to="/profile">
                  <img
                    src={`${SERVER_URL}${user.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                </Link>
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
              )}
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-green-800 text-white p-4 space-y-4">
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 px-3 rounded hover:bg-green-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="block py-2 px-3 rounded hover:bg-green-600"
            >
              👤 Profile
            </Link>
          </nav>
        </aside>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-green-800 text-white p-4 z-10 space-y-2 shadow-md">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded hover:bg-green-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded hover:bg-green-600"
            >
              👤 Profile
            </Link>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

export default NavbarSidebarLayout;
