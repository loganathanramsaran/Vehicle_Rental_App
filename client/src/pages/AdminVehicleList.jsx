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
        const res = await axios.get(`${process.env.VITE_SERVER_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };

    fetchVehicles();
  }, [navigate]);

  useEffect(() => {
    let results = vehicles;

    if (search) {
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
      await axios.delete(`${process.env.VITE_SERVER_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-8">
          Admin - Manage Vehicles
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
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

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No vehicles found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-left">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Price / Day</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vehicle, index) => (
                  <tr
                    key={vehicle._id}
                    className={`border-t dark:border-gray-700 ${
                      index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                    } hover:bg-green-50 dark:hover:bg-gray-700 transition`}
                  >
                    <td className="px-6 py-3">{vehicle.title}</td>
                    <td className="px-6 py-3">{vehicle.type}</td>
                    <td className="px-6 py-3">₹{vehicle.pricePerDay}</td>
                    <td className="px-6 py-3 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
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
