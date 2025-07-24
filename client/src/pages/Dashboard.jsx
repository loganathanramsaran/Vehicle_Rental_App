import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import browseVehicles from "../assets/browseVehicle.png";
import myBookings from "../assets/myBookings.png";
import editProfile from "../assets/editProfile.png";
import addVehicle from "../assets/addVehicle.png";
import manageVehicle from "../assets/manageVehicle.png";
import viewAllBookings from "../assets/viewAllBookings.png";
import feedbacks from "../assets/feedback.png";

function Dashboard() {
  const { user, fetchUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUser().finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center text-xl dark:text-white">Loading...</div>;
  if (!user) return null;

  const role = user.isAdmin ? "Admin" : "User";

  const cardStyle =
    "rounded-lg shadow-lg p-6 dark:bg-gray-400 dark:hover:bg-gray-500 dark:hover:text-white hover:text-white transition flex flex-col justify-between items-center text-center";

  const ActionCard = ({ to, label, icon, color }) => (
    <Link to={to} className={`${cardStyle} ${color}`}>
      <p className="text-lg font-semibold mb-3">{label}</p>
      <img src={icon} alt={label} className="w-20 h-20 object-contain" />
    </Link>
  );

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
      <div className="min-h-screen max-w-7xl mx-auto p-6">
        {/* Profile Card */}
        <div className="bg-yellow-100 dark:bg-gray-700 border-2 border-yellow-400 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-28 h-28 rounded-full border-2 border-green-500 overflow-hidden">
            {user?.avatar ? (
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
            <h2 className="text-2xl font-bold dark:text-white mb-1">
              Welcome, {user?.name || "User"} 👋
            </h2>
            <p className="text-gray-700 dark:text-slate-100">
              <strong>Email:</strong> {user?.email}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                role === "Admin"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {user?.isAdmin ? (
            <>
              <ActionCard
                to="/add-vehicle"
                label="Add Vehicle"
                icon={addVehicle}
                color="bg-yellow-500 hover:bg-yellow-600"
              />
              <ActionCard
                to="/admin/vehicles"
                label="Manage Vehicles"
                icon={manageVehicle}
                color="bg-blue-500 hover:bg-blue-600"
              />
              <ActionCard
                to="/admin/bookings"
                label="View All Bookings"
                icon={viewAllBookings}
                color="bg-purple-500 hover:bg-purple-600"
              />
              <ActionCard
                to="/admin/feedback"
                label="User Feedbacks"
                icon={feedbacks}
                color="bg-pink-500 hover:bg-pink-600"
              />
            </>
          ) : (
            <>
              <ActionCard
                to="/vehicles"
                label="Browse Vehicles"
                icon={browseVehicles}
                color="bg-yellow-500 hover:bg-yellow-600"
              />
              <ActionCard
                to="/my-bookings"
                label="My Bookings"
                icon={myBookings}
                color="bg-blue-500 hover:bg-blue-600"
              />
              <ActionCard
                to="/paymenthistory"
                label="Bookings & Payment History"
                icon={myBookings}
                color="bg-purple-500 hover:bg-purple-600"
              />
            </>
          )}
          <ActionCard
            to="/profile"
            label="Edit Profile"
            icon={editProfile}
            color="bg-green-500 hover:bg-green-600"
          />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
