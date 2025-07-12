import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function HeroFilter({ onResults }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // NEW
  const [vehicles, setVehicles] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles`
      );
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return onResults([]);

    const availableVehicles = vehicles.filter((vehicle) => {
      if (typeFilter && vehicle.type !== typeFilter) return false;
      if (!vehicle.bookings || vehicle.bookings.length === 0) return true;

      const hasConflict = vehicle.bookings.some((booking) => {
        const status = booking.status?.toLowerCase();
        if (status !== "confirmed") return false;

        const bookedStart = new Date(booking.startDate);
        const bookedEnd = new Date(booking.endDate);

        const sDate = new Date(startDate.setHours(0, 0, 0, 0));
        const eDate = new Date(endDate.setHours(23, 59, 59, 999));

        return sDate <= bookedEnd && eDate >= bookedStart;
      });

      return !hasConflict;
    });

    // Sorting
    if (sortOption === "priceLow") {
      availableVehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortOption === "priceHigh") {
      availableVehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortOption === "rating") {
      availableVehicles.sort((a, b) => b.rating - a.rating);
    }

    setResultsCount(availableVehicles.length); // 👈 set count here
    onResults(availableVehicles);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className=" relative max-w-5xl mx-auto p-6  ">
      <div className="border-2 border-orange-400 flex justify-evenly p-8 pb-10 rounded-lg flex-wrap bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
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

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vehicle Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className=" border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="">All</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Bike">Bike</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>

        {/* Sort Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className=" border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
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
              {resultsCount > 0 && (
          <p className="absolute right-12 bottom-3 rounded-lg text-xs border-2 border-orange-400 bg-orange-300 dark:bg-gray-600 px-1 py-1 text-gray-700 dark:text-gray-300 mt-2">
            {resultsCount} vehicle{resultsCount > 1 ? "s" : ""} found
          </p>
        )}

    </div>
  );
}

export default HeroFilter;
