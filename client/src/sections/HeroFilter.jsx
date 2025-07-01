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
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleSearch = () => {
    let filtered = [...vehicles];

    if (startDate && endDate) {
      filtered = filtered.filter((v) => {
        const unavailable = v.bookings?.some((b) => {
          const bStart = new Date(b.startDate);
          const bEnd = new Date(b.endDate);
          return startDate <= bEnd && endDate >= bStart;
        });
        return !unavailable;
      });
    }

    if (sortOption === "priceLow")
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sortOption === "priceHigh")
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sortOption === "rating")
      filtered.sort((a, b) => b.rating - a.rating);

    onResults(filtered);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-6 py-4 flex flex-wrap flex-col lg:flex-row items-center gap-4 mt-6">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className="border rounded px-4 py-2 w-full lg:w-auto"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate || new Date()}
        placeholderText="End Date"
        className="border rounded px-4 py-2 w-full lg:w-auto"
      />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border rounded px-4 py-2 w-full lg:w-auto"
      >
        <option value="">Sort By</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full lg:w-auto"
      >
        Search
      </button>
    </div>
  );
}

export default HeroFilter;
