import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import browseVehicles from "../assets/browseVehicle.png";

function Dashboard() {
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUser(); // refresh user data on mount
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="dashboard-container">
      <div className="profile flex  items-center justify-between p-6 bg-white shadow-md rounded-lg mb-6">
        <div className="profile-img">
          {user.avatar ? (
            <img
              src={`${SERVER_URL}${user.avatar}`}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name} 👋</h1>
        <div className="profile-info border-l border-gray-300 pl-4">
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mb-6">
            <strong className="text-gray-700">Role:</strong>{" "}
            <span
              className={`inline-block px-2 py-1 rounded text-sm font-bold ${
                user.isAdmin
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </p>
        </div>
      </div>

      <div className="actions grid h-80 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.isAdmin ? (
          <>
            <Link
              to="/add-vehicle"
              className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            >
              ➕ Add Vehicle
            </Link>
            <Link
              to="/admin/vehicles"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              🛠 Manage Vehicles
            </Link>
            <Link
              to="/admin/bookings"
              className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              📋 View All Bookings
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/vehicles"
              className="bg-blue-600 text-white flex flex-col justify-evenly items-center rounded hover:bg-blue-700"
            >
              <p className="text-xl">Browse Vehicles</p>
              <img src={browseVehicles} alt="Browse Vehicles" className="w-28 h-28  " />
            </Link>
            <Link
              to="/my-bookings"
              className="bg-purple-600 text-white  rounded hover:bg-purple-700"
            >
              📅 My Bookings
            </Link>
          </>
        )}

        <Link
          to="/profile"
          className="bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ⚙️ Edit Profile
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white rounded hover:bg-red-700"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
