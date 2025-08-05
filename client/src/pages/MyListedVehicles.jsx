import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyListedVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Missing or invalid token");
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        toast.error("Failed to load your listed vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vehicle deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.status === 403
          ? "You are not authorized to delete this vehicle."
          : "Failed to delete vehicle"
      );
    }
  };

  const renderStatus = ({ isApproved, available }) => {
    if (isApproved) {
      return <span className="text-green-600 font-semibold">Approved ✅</span>;
    } else if (!isApproved && available) {
      return <span className="text-yellow-500 font-semibold">Pending ⏳</span>;
    } else {
      return <span className="text-red-600 font-semibold">Rejected ❌</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">My Listed Vehicles</h2>

      {vehicles.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          You haven’t listed any vehicles yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden flex flex-col"
            >
              <img
                src={
                  vehicle.image?.startsWith("http")
                    ? vehicle.image
                    : `${SERVER_URL}${vehicle.image}`
                }
                alt={vehicle.name}
                className="h-44 w-full object-cover"
                onError={(e) => (e.target.src = "/no-image.jpg")}
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {vehicle.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Type: {vehicle.type}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Rent: ₹{vehicle.rentPerDay}/day
                </p>
                <p className="text-sm mt-2">Status: {renderStatus(vehicle)}</p>

                <div className="mt-auto flex justify-between items-center gap-2 pt-4">
                  <Link
                    to={`/edit-vehicle/${vehicle._id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListedVehicles;
