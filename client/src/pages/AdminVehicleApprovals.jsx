import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminVehicleApprovals() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sorted = res.data.sort((a, b) => {
        if (!a.isApproved && !a.isRejected) return -1; // pending first
        if (a.isApproved) return 1; // approved next
        if (a.isRejected) return 2; // rejected last
        return 0;
      });

      setVehicles(sorted);
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
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/admin/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Vehicle approved");

      // Update vehicle locally
      setVehicles((prev) =>
        prev
          .map((v) =>
            v._id === id ? { ...v, isApproved: true, isRejected: false } : v
          )
          .sort((a, b) => {
            if (!a.isApproved && !a.isRejected) return -1;
            if (a.isApproved) return 1;
            if (a.isRejected) return 2;
            return 0;
          })
      );
    } catch (err) {
      console.error("Approval error:", err);
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this vehicle?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/admin/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Vehicle rejected");

      // Update vehicle locally
      setVehicles((prev) =>
        prev
          .map((v) =>
            v._id === id ? { ...v, isApproved: false, isRejected: true } : v
          )
          .sort((a, b) => {
            if (!a.isApproved && !a.isRejected) return -1;
            if (a.isApproved) return 1;
            if (a.isRejected) return 2;
            return 0;
          })
      );
    } catch (err) {
      console.error("Rejection error:", err);
      toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
        <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">

    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        All Vehicle Approval Statuses
      </h1>

      {vehicles.length === 0 ? (
        <p className="text-gray-500 text-center">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => {
            let bgColor = "bg-white";
            if (vehicle.isApproved) bgColor = "bg-green-100";
            else if (vehicle.isRejected) bgColor = "bg-red-100";

            return (
              <div
                key={vehicle._id}
                className={`${bgColor} rounded-xl shadow-lg p-4`}
              >
                <img
                  src={
                    vehicle.image?.startsWith("http")
                      ? vehicle.image
                      : `${import.meta.env.VITE_SERVER_URL}/uploads/${vehicle.image}`
                  }
                  alt={vehicle.name}
                  className="w-fit  object-cover rounded-md mb-3"
                />
                <h2 className="text-xl font-bold mb-1">{vehicle.name}</h2>
                <p className="text-sm text-gray-600 mb-1 capitalize">
                  Type: {vehicle.type}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {vehicle.description}
                </p>

                {vehicle.owner && (
                  <div className="text-xs text-gray-500 mb-2">
                    Owner: <span className="font-medium">{vehicle.owner.name}</span> (
                    {vehicle.owner.email})
                  </div>
                )}

                {/* Status Label */}
                <p className="text-sm font-medium mb-2">
                  Status:{" "}
                  {vehicle.isApproved ? (
                    <span className="text-green-700">Approved</span>
                  ) : vehicle.isRejected ? (
                    <span className="text-red-700">Rejected</span>
                  ) : (
                    <span className="text-yellow-700">Pending</span>
                  )}
                </p>

                {/* Action Buttons */}
                {!vehicle.isApproved && !vehicle.isRejected && (
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </section>
  );
}

export default AdminVehicleApprovals;
