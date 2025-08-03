import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminVehicleApprovals() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnapprovedVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/vehicles/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only include unapproved vehicles
      const unapproved = res.data.filter((v) => !v.isApproved);
      setVehicles(unapproved);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/vehicles/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vehicle approved");
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Approval error:", err);
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this vehicle?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/vehicles/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vehicle rejected");
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Rejection error:", err);
      toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchUnapprovedVehicles();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Pending Vehicle Approvals</h1>

      {vehicles.length === 0 ? (
        <p className="text-gray-500 text-center">No pending vehicles for approval.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-xl shadow-lg p-4">
              <img
                src={
                  vehicle.image?.startsWith("http")
                    ? vehicle.image
                    : `${import.meta.env.VITE_SERVER_URL}${vehicle.image}`
                }
                alt={vehicle.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h2 className="text-xl font-bold mb-1">{vehicle.name}</h2>
              <p className="text-sm text-gray-600 mb-1 capitalize">Type: {vehicle.type}</p>
              <p className="text-sm text-gray-700 mb-2">{vehicle.description}</p>

              {/* Owner Info */}
              {vehicle.owner && (
                <div className="text-xs text-gray-500 mb-2">
                  Owner: <span className="font-medium">{vehicle.owner.name}</span> ({vehicle.owner.email})
                </div>
              )}

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleApprove(vehicle._id)}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(vehicle._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminVehicleApprovals;
