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
    return (
      <p className="text-gray-600 p-6 text-center">Loading all bookings...</p>
    );

  if (error) return <p className="text-red-500 p-6 text-center">{error}</p>;

  const handleCancelBooking = async (bookingId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking cancelled successfully.");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-green-400">
        Admin - All Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No bookings found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className=" dark:bg-gray-800 shadow-xl rounded-2xl p-4"
            >
              {booking.vehicle?.image ? (
                <img
                  src={booking.vehicle.image}
                  alt={booking.vehicle.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  No image
                </div>
              )}

              <div className="flex justify-between items-center">
                <h2 className="text-xl text-yellow-600 font-semibold mb-1 dark:text-yellow-700">
                  {booking.vehicle?.title || "Unknown Vehicle"}
                </h2>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>Total:</strong> ₹{booking.totalPrice}
                </p>
              </div>

              <p className="text-sm text-gray-800 dark:text-gray-300">
                <strong>User:</strong> {booking.user?.name || "N/A"} (
                {booking.user?.email || "Unknown"})
              </p>

              <div className="flex gap-3 mb-1">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  <strong>From:</strong>{" "}
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-400">
                  <strong>To:</strong>{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>

              {booking.payment && (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Payment ID:</strong>{" "}
                    {booking.payment.razorpayPaymentId || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Amount:</strong> ₹{booking.payment.amount / 100}
                  </p>
                </>
              )}

              <div className="flex justify-between items-center mt-3">
                <p className="text-sm font-medium py-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="font-bold text-xs px-1 py-1 text-red-600 rounded-full hover:text-white hover:text-xs hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
