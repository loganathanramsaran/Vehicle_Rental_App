import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MiniVehicleCarousel() {
  const [vehicles, setVehicles] = useState([]);
  const scrollRef = useRef(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/vehicles/available`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const cardWidth = 220; // approx width of one card
    const interval = setInterval(() => {
      if (!scrollContainer) return;

      // If we’re near the end, scroll back to start
      if (
        scrollContainer.scrollLeft + scrollContainer.offsetWidth >=
        scrollContainer.scrollWidth - cardWidth
      ) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicles]);

  if (!vehicles.length) return null;

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
      <div className=" py-16 max-sm:px-0 overflow-hidden max-w-6xl mx-auto">
        <h2 className="text-2xl text-center font-bold mb-10 text-gray-800 dark:text-white">
          Available Vehicles
        </h2>
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle._id}
              to={`/vehicles/${vehicle._id}/book`}
              className="min-w-60 max-sm:min-w-fit bg-orange-300 dark:bg-gray-700 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <img
                src={
                  vehicle.image
                    ? `${SERVER_URL}${vehicle.image}`
                    : "/placeholder.png"
                }
                alt={vehicle.title}
                className="h-36 w-full object-cover rounded-t-lg "
              />
              <div className="p-2 text-sm">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                  {vehicle.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ₹{vehicle.pricePerDay} / day
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MiniVehicleCarousel;
