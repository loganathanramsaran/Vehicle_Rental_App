import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AdminVehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const decoded = jwtDecode(token);
      if (!decoded.isAdmin) return navigate("/dashboard");

      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
        alert("Failed to load vehicles");
      }
    };

    fetchVehicles();
  }, [navigate]);

  useEffect(() => {
    let results = vehicles;

    if (search.trim()) {
      results = results.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "All") {
      results = results.filter((v) => v.type === filterType);
    }

    setFiltered(results);
  }, [search, filterType, vehicles]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      alert("Vehicle deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 mb-8">
          Admin - All Vehicles
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-orange-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-orange-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="All">All Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Bike">Bike</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Showing {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
            No vehicles found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300 dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 text-white dark:text-gray-200 text-left">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Price / Day</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vehicle, index) => (
                  <tr
                    key={vehicle._id}
                    className={`border-t dark:border-gray-700 ${
                      index % 2 === 0
                        ? "bg-orange-100 dark:bg-gray-700"
                        : "bg-orange-200 dark:bg-gray-800"
                    } hover:bg-orange-400 dark:hover:bg-gray-600 transition`}
                  >
                    <td className="px-6 py-3 truncate max-w-xs">{vehicle.name}</td>
                    <td className="px-6 py-3 truncate max-w-xs">
                      <img
                        src={vehicle.image?.startsWith("http")
                          ? vehicle.image
                          : `${import.meta.env.VITE_SERVER_URL}/uploads/${vehicle.image}`}
                        alt={vehicle.title}
                        className="h-20 w-fit rounded max-md:hidden mix-blend-multiply"
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                    </td>
                    <td className="px-6 py-3">{vehicle.type}</td>
                    <td className="px-6 py-3">₹{vehicle.rentPerDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminVehicleList;
