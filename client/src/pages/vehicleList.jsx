import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles");
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

  // Sorting
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.pricePerDay - b.pricePerDay;
    if (sortOption === "priceHighLow") return b.pricePerDay - a.pricePerDay;
    if (sortOption === "yearNewOld") return b.year - a.year;
    if (sortOption === "yearOldNew") return a.year - b.year;
    return 0;
  });

  // Filtering
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

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesPrice &&
      matchesAvailability
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Vehicles</h1>

      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {/* Filters and Sorting */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-6">
        <input
          type="text"
          placeholder="Search by title, make, model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded w-full"
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
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Sorting & Dates */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          onChange={handleSortChange}
          value={sortOption}
          className="p-2 border rounded"
        >
          <option value="">-- Sort By --</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="yearNewOld">Year: New to Old</option>
          <option value="yearOldNew">Year: Old to New</option>
        </select>

        <div>
          <label className="block text-sm text-center">Start Date</label>
          <input
            type="date"
            name="start"
            value={filterDates.start}
            onChange={handleDateChange}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-center">End Date</label>
          <input
            type="date"
            name="end"
            value={filterDates.end}
            onChange={handleDateChange}
            className="p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))
        ) : (
          !error && (
            <p className="text-center text-gray-600 col-span-full">
              No vehicles match your criteria.
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default VehicleList;
