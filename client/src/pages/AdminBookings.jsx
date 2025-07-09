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

        const res = await axios.get(`${process.env.VITE_SERVER_URL}/api/bookings`, {
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

  const handleCancelBooking = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.VITE_SERVER_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking cancelled successfully");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking");
    }
  };

  if (loading)
    return (
      <p className="text-gray-600 dark:text-gray-300 text-center p-6">Loading all bookings...</p>
    );

  if (error)
    return (
      <p className="text-red-500 dark:text-red-400 text-center p-6">{error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-8">
          Admin - All Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition p-5"
              >
                {booking.vehicle?.image ? (
                  <img
                    src={
                      booking.vehicle.image.startsWith("http")
                        ? booking.vehicle.image
                        : `${process.env.VITE_SERVER_URL}${booking.vehicle.image}`
                    }
                    alt={booking.vehicle.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    No image
                  </div>
                )}

                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    {booking.vehicle?.title || "Unknown Vehicle"}
                  </h2>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    ₹{booking.totalPrice}
                  </p>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>User:</strong> {booking.user?.name || "N/A"} (
                  {booking.user?.email || "Unknown"})
                </p>

                <div className="text-sm text-gray-700 dark:text-gray-400 flex flex-col sm:flex-row sm:gap-4">
                  <p>
                    <strong>From:</strong>{" "}
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>To:</strong>{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>

                {booking.payment && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <p>
                      <strong>Payment ID:</strong>{" "}
                      {booking.payment.razorpayPaymentId || "N/A"}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{booking.payment.amount / 100}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-red-600 hover:bg-red-600 hover:text-white transition px-3 py-1 text-xs rounded font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
