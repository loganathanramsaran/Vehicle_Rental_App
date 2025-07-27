import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterDates, setFilterDates] = useState({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setError("Failed to load vehicles. Please try again later.");
      }
    };

    fetchVehicles();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDates({ ...filterDates, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setSortOption("");
    setFilterDates({ start: "", end: "" });
    setSearch("");
    setTypeFilter("");
    setLocationFilter("");
    setMaxPrice("");
    setMinRating(0);
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.pricePerDay - b.pricePerDay;
    if (sortOption === "priceHighLow") return b.pricePerDay - a.pricePerDay;
    if (sortOption === "yearNewOld") return b.year - a.year;
    if (sortOption === "yearOldNew") return a.year - b.year;
    if (sortOption === "ratingHighLow") {
      const aRating = typeof a.averageRating === "number" ? a.averageRating : 0;
      const bRating = typeof b.averageRating === "number" ? b.averageRating : 0;
      return bRating - aRating;
    }
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter ? v.type === typeFilter : true;
    const matchesLocation = locationFilter
      ? v.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchesPrice = maxPrice ? v.pricePerDay <= maxPrice : true;
    const matchesAvailability = v.available;
    const matchesRating =
      typeof v.averageRating === "number" ? v.averageRating >= minRating : true;

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesPrice &&
      matchesAvailability &&
      matchesRating
    );
  });

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
    <div className="min-h-screen max-w-7xl mx-auto p-4 lg:flex">
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block w-64 pr-6 sticky top-4 h-fit">
        <div className=" dark:bg-gray-700 p-4 shadow rounded space-y-3">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">All Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Bike">Bike</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <label className="text-sm font-medium dark:text-yellow-400 ">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value={0}>All</option>
            <option value={4}>4 ★ & up</option>
            <option value={3}>3 ★ & up</option>
            <option value={2}>2 ★ & up</option>
            <option value={1}>1 ★ & up</option>
          </select>
          <input
            type="date"
            name="start"
            value={filterDates.start}
            onChange={handleDateChange}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <input
            type="date"
            name="end"
            value={filterDates.end}
            onChange={handleDateChange}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <select
            onChange={handleSortChange}
            value={sortOption}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">-- Sort By --</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="yearNewOld">Year: New to Old</option>
            <option value="yearOldNew">Year: Old to New</option>
            <option value="ratingHighLow">Rating: High to Low</option>
          </select>
          <button
            onClick={handleClearFilters}
            className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileFilter && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 shadow-lg z-50 p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="">All Types</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Bike">Bike</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <label className="text-sm font-medium mt-2">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value={0}>All</option>
              <option value={4}>4 ★ & up</option>
              <option value={3}>3 ★ & up</option>
              <option value={2}>2 ★ & up</option>
              <option value={1}>1 ★ & up</option>
            </select>
            <input
              type="date"
              name="start"
              value={filterDates.start}
              onChange={handleDateChange}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <input
              type="date"
              name="end"
              value={filterDates.end}
              onChange={handleDateChange}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <select
              onChange={handleSortChange}
              value={sortOption}
              className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="">-- Sort By --</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="yearNewOld">Year: New to Old</option>
              <option value="yearOldNew">Year: Old to New</option>
              <option value="ratingHighLow">Rating: High to Low</option>
            </select>
            <button
              onClick={() => {
                handleClearFilters();
                setShowMobileFilter(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </>
      )}

      {/* Vehicle List */}
      <div className="flex-1 flex flex-col max-h-screen ">
        <h1 className="text-3xl sticky top-0 z-10 dark:text-orange-600 font-bold mt-2  pb-6 text-center">
          Available Vehicles
        </h1>
        {error && (
          <p className="text-center text-red-500 font-medium mb-4">{error}</p>
        )}

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4 w-full">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No vehicles match your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}

export default VehicleList;
