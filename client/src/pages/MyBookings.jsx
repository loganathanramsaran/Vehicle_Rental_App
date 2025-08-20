import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Booking cancelled successfully");
      fetchMyBookings();

      // Notify calendar to update
      window.dispatchEvent(new Event("bookingCancelled"));
    } catch (err) {
      toast.error("Error cancelling booking");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Booking deleted successfully");
      fetchMyBookings();

      // Also notify calendar update (optional)
      window.dispatchEvent(new Event("bookingCancelled"));
    } catch (err) {
      toast.error("Error deleting booking");
    }
  };

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 min-h-screen py-10">
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">
          My Bookings
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500">No bookings found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const vehicle = booking.vehicle;
              const isCancelled = booking.status === "cancelled";

              return (
                <div
                  key={booking._id}
                  className="bg-orange-100 shadow-md rounded-xl p-5 border hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={
                        vehicle?.image?.startsWith("http")
                          ? vehicle.image
                          : vehicle?.image
                          ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                              vehicle.image
                            }`
                          : "https://via.placeholder.com/150"
                      }
                      alt={vehicle?.name || "Vehicle"}
                      className="w-fit md:w-48 h-32 object-cover rounded-md border"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {vehicle?.name || "Vehicle Deleted"}
                      </h3>

                      {vehicle && (
                        <>
                          <p className="text-sm text-gray-600">
                            Type: {vehicle.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Owner:{" "}
                            <span className="font-medium">
                              {vehicle.owner?.name || "N/A"}
                            </span>
                          </p>
                        </>
                      )}

                      <p className="text-sm text-gray-600">
                        Dates:{" "}
                        <span className="font-medium">
                          {format(new Date(booking.startDate), "dd MMM yyyy")} -{" "}
                          {format(new Date(booking.endDate), "dd MMM yyyy")}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Price:{" "}
                        <span className="text-green-600 font-semibold">
                          ₹{booking.totalPrice}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Booking Status:{" "}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </p>

                      <div className="flex gap-3 mt-3">
                        <button
                          disabled={isCancelled}
                          onClick={() => handleCancel(booking._id)}
                          className={`px-3 py-1 text-sm rounded border transition ${
                            isCancelled
                              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                              : "text-red-700 border-red-700 hover:bg-red-200"
                          }`}
                        >
                          Cancel Booking
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete Booking
                        </button>
                        <p className="text-blue-600 text-sm"> * Invoice Sended to your Email</p>
                        
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
