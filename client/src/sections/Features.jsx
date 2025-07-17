import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ArrowBigRight } from "lucide-react";

import browseVehicles from "../assets/browseVehicle.png";
import myBookings from "../assets/myBookings.png";
import editProfile from "../assets/editProfile.png";
import addVehicle from "../assets/addVehicle.png";
import manageVehicle from "../assets/manageVehicle.png";
import viewAllBookings from "../assets/viewAllBookings.png";

const features = [
  {
    title: "Browse Vehicles",
    img: browseVehicles,
    bg: "bg-blue-600",
    to: "/vehicles",
  },
  {
    title: "My Bookings",
    img: myBookings,
    bg: "bg-purple-600",
    to: "/my-bookings",
  },
  {
    title: "Edit Profile",
    img: editProfile,
    bg: "bg-gray-700",
    to: "/profile",
  },
  {
    title: "Add Vehicle",
    img: addVehicle,
    bg: "bg-yellow-500",
    to: "/add-vehicle",
    adminOnly: true,
  },
  {
    title: "Manage Vehicles",
    img: manageVehicle,
    bg: "bg-blue-700",
    to: "/admin/vehicles",
    adminOnly: true,
  },
  {
    title: "All Bookings",
    img: viewAllBookings,
    bg: "bg-purple-800",
    to: "/admin/bookings",
    adminOnly: true,
  },
];

const Features = () => {
  const { user } = useContext(UserContext);

  const filteredFeatures = features.filter((item) => {
    if (item.adminOnly && !user?.isAdmin) return false;
    return true;
  });

  return (
    <section id="features" className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 mx-auto py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-600 ">
          Explore Features
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Built for both customers and administrators
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {filteredFeatures.map((item, index) => (
          <Link
            to={item.to}
            key={index}
            className={`${item.bg} text-white flex flex-col justify-evenly items-center p-6 rounded-xl shadow hover:scale-105 transition`}
          >
            <p className="text-xl font-semibold mb-2">{item.title}</p>
            <img
              src={item.img}
              alt={item.title}
              className="w-24 h-24 object-contain"
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-center items-center mt-8">
        <Link to={"/dashboard"}>
          <button className="flex animate-bounce items-center text-orange-500 hover:text-white hover:bg-orange-500 bg-orange-100 px-2 py-1 rounded-full">
            <strong>More Features</strong>
            <ArrowBigRight />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Features;
