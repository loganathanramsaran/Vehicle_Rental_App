import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import placeholder from "/placeholder.png"; // ✅ ensure this exists

function MiniVehicleCarousel() {
  const [vehicles, setVehicles] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/vehicles/available`);
        console.log("Mini carousel vehicles:", res.data);
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };

    fetchVehicles();
  }, []);

  if (!vehicles.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 py-6 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth snap-x snap-mandatory">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Available Vehicles</h2>
      <div className="flex gap-4">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle._id}
            to={`/vehicle/${vehicle._id}`}
            className="min-w-[200px] snap-start bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            <img
              src={`${SERVER_URL}${vehicle.image}`}
              alt={vehicle.title}
              onError={(e) => (e.target.src = placeholder)}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-2 text-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">{vehicle.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">₹{vehicle.pricePerDay} / day</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MiniVehicleCarousel;
