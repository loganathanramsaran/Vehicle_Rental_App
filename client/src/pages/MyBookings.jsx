import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

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
        setBookings(
          res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [SERVER_URL]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${SERVER_URL}/api/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update booking status locally instead of removing
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
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
    <div className="min-h-screen bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 dark:text-white p-6">
      <h1 className="text-3xl text-orange-600 dark:text-orange-400 font-bold mt-2 mb-5 border-b-2 border-orange-600 dark:border-yellow-500 pb-6 text-center">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings.</p>
      ) : (
        <div className="grid max-w-4xl mx-auto gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`shadow p-4 rounded ${
                booking.status === "cancelled"
                  ? "bg-gradient-to-r from-red-100 via-red-200 to-red-100 dark:from-gray-700 text-gray-700 dark:text-gray-500"
                  : "bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 dark:from-gray-500 dark:text-white"
              }`}
            >
              <div className="flex max-sm:flex-col justify-evenly items-center">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {booking.vehicle?.title || "Vehicle Info Unavailable"}
                  </h2>

                  {booking.vehicle?.image ? (
                    <img
                      src={
                        booking.vehicle.image?.startsWith("http")
                          ? booking.vehicle.image
                          : `${SERVER_URL}${booking.vehicle.image}`
                      }
                      alt={booking.vehicle.title || "No image"}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                      className="w-fit h-36 object-cover mb-2 rounded"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
                      <img src="/placeholder.png"></img>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <strong>From:</strong>{" "}
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>To:</strong>{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{booking.totalPrice}
                  </p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                  <td
                    className={` font-bold ${
                      booking.status === "confirmed"
                        ? "text-green-600"
                        : booking.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {booking.payment?.status || booking.status}
                  </td>
                </div>
                <div className="flex flex-col items-center ">
                  {booking.vehicle ? (
                    <Link
                      to={`/vehicle/${booking.vehicle._id}`}
                      className="text-blue-500 underline"
                    >
                      View Vehicle
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic">
                      Vehicle Unavailable
                    </span>
                  )}

                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={deletingId === booking._id}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-1 py-1 rounded mt-2 disabled:opacity-50"
                    >
                      {deletingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
