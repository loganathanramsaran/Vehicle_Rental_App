import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import browseVehicles from "../assets/browseVehicle.png";
import myBookings from "../assets/myBookings.png";
import editProfile from "../assets/editProfile.png";
import addVehicle from "../assets/addVehicle.png";
import manageVehicle from "../assets/manageVehicle.png";
import viewAllBookings from "../assets/viewAllBookings.png";

function Dashboard() {
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchUser();
  }, []);

  if (!user) return null;

  const role = user.isAdmin ? "Admin" : "User";

  const cardStyle =
    "rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition flex flex-col justify-between items-center text-center";

  const ActionCard = ({ to, label, icon, color }) => (
    <Link
      to={to}
      className={`${cardStyle} ${color}`}
    >
      <p className="text-lg font-semibold mb-3">{label}</p>
      <img src={icon} alt={label} className="w-20 h-20 object-contain" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border overflow-hidden">
            {user.avatar ? (
              <img
                src={`${SERVER_URL}${user.avatar}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                No Avatar
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {user.name} 👋</h2>
            <p className="text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              role === "Admin"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {user.isAdmin ? (
          <>
            <ActionCard to="/add-vehicle" label="Add Vehicle" icon={addVehicle} color="bg-yellow-50" />
            <ActionCard to="/admin/vehicles" label="Manage Vehicles" icon={manageVehicle} color="bg-blue-50" />
            <ActionCard to="/admin/bookings" label="View All Bookings" icon={viewAllBookings} color="bg-purple-50" />
          </>
        ) : (
          <>
            <ActionCard to="/vehicles" label="Browse Vehicles" icon={browseVehicles} color="bg-blue-50" />
            <ActionCard to="/my-bookings" label="My Bookings" icon={myBookings} color="bg-purple-50" />
          </>
        )}
        <ActionCard to="/profile" label="Edit Profile" icon={editProfile} color="bg-gray-100" />
      </div>
    </div>
  );
}

export default Dashboard;
