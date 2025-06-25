import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch admin bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  if (loading)
    return <p className="text-gray-600 p-6 text-center">Loading all bookings...</p>;

  if (error)
    return <p className="text-red-500 p-6 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        All Bookings (Admin View)
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              {booking.vehicle?.image ? (
                <img
                  src={booking.vehicle.image}
                  alt={booking.vehicle.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}

              <h2 className="text-xl font-semibold mb-1">
                {booking.vehicle?.title || "Unknown Vehicle"}
              </h2>
              <p className="text-sm text-gray-700">
                <strong>User:</strong> {booking.user?.name || "N/A"} (
                {booking.user?.email || "Unknown"})
              </p>
              <p className="text-sm">
                <strong>From:</strong>{" "}
                {new Date(booking.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>To:</strong>{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Total:</strong> ₹{booking.totalPrice}
              </p>
              <p className="text-sm font-medium">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
