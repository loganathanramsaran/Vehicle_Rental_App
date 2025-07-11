import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function HeroFilter({ onResults }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles`);
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return onResults([]);

    const availableVehicles = vehicles.filter((vehicle) => {
      if (!vehicle.bookings || vehicle.bookings.length === 0) return true;

      const hasConflict = vehicle.bookings.some((booking) => {
        const bookedStart = new Date(booking.startDate);
        const bookedEnd = new Date(booking.endDate);
        return startDate <= bookedEnd && endDate >= bookedStart;
      });

      return !hasConflict;
    });

    // Sort
    if (sortOption === "priceLow") {
      availableVehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortOption === "priceHigh") {
      availableVehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortOption === "rating") {
      availableVehicles.sort((a, b) => b.rating - a.rating);
    }

    onResults(availableVehicles);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="w-3/4 max-md:w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select start date"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            placeholderText="Select end date"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          />
        </div>

        {/* Sort Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="">Select</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroFilter;
