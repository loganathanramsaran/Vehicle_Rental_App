import { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import VehicleCard from "../components/VehicleCard";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/vehicles`
        );
        setVehicles(res.data); // or setFiltered(res.data) if using filtered array
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);
  useEffect(() => {
    let filteredList = [...vehicles];

    if (search.trim()) {
      filteredList = filteredList.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      filteredList = filteredList.filter((v) => v.type === type);
    }

    if (location) {
      filteredList = filteredList.filter((v) =>
        v.description?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (maxPrice) {
      filteredList = filteredList.filter(
        (v) => v.rentPerDay <= parseFloat(maxPrice)
      );
    }

    if (minRating) {
      filteredList = filteredList.filter(
        (v) => (v.averageRating || 0) >= parseFloat(minRating)
      );
    }

    if (sort === "priceLowHigh") {
      filteredList.sort((a, b) => a.rentPerDay - b.rentPerDay);
    } else if (sort === "priceHighLow") {
      filteredList.sort((a, b) => b.rentPerDay - a.rentPerDay);
    } else if (sort === "ratingHighLow") {
      filteredList.sort(
        (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
      );
    }

    setFiltered(filteredList);
  }, [vehicles, search, type, location, maxPrice, minRating, sort]);

  return (
    <section className=" bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            Explore Vehicles
          </h1>
        </div>

        {/* Filter Sidebar */}
        <div className="lg:flex">
          <div className="w-full lg:w-64 lg:mr-6 space-y-4 mb-6 lg:mb-0">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow space-y-4 border dark:border-gray-600">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="">All Types</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Van">Van</option>
              </select>
              <input
                type="text"
                placeholder="Location (in description)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              <label className="text-sm font-medium dark:text-yellow-300">
                Min Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value={0}>All</option>
                <option value={4}>4★ & up</option>
                <option value={3}>3★ & up</option>
                <option value={2}>2★ & up</option>
              </select>
              <label className="text-sm font-medium dark:text-yellow-300">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="">None</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="ratingHighLow">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
            {error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No vehicles found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

export default VehicleList;
