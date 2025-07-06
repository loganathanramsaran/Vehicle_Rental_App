import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const res = await axios.get(
          `${SERVER_URL}/api/bookings/user/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [SERVER_URL]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${SERVER_URL}/api/bookings/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update booking status locally instead of removing
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );

      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel booking");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Loading bookings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white p-6">
      <h1 className="text-3xl dark:text-orange-600 font-bold mt-2 mb-5 border-b-2 dark:border-yellow-500 pb-6 text-center">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`shadow p-4 rounded ${
                booking.status === "cancelled"
                  ? "bg-red-100 dark:bg-red-300 text-gray-700"
                  : "bg-white dark:bg-gray-600 dark:text-white"
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">
                {booking.vehicle?.title || "Vehicle Info Unavailable"}
              </h2>

              {booking.vehicle?.image ? (
                <img
                  src={booking.vehicle.image}
                  alt={booking.vehicle.title || "No image"}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
                  No image
                </div>
              )}

              <p><strong>From:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {booking.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  disabled={deletingId === booking._id}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-2 disabled:opacity-50"
                >
                  {deletingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
