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
        const res = await axios.get("http://localhost:5000/api/vehicles", {
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
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Vehicles</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/4"
        >
          <option value="">Select Type</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Bike">Bike</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>{" "}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Price/Day</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vehicle) => (
              <tr key={vehicle._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{vehicle.title}</td>
                <td className="p-2">{vehicle.type}</td>
                <td className="p-2">₹{vehicle.pricePerDay}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/vehicles/edit/${vehicle._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminVehicleList;
