import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/bookings/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded text-sm font-medium";
    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "cancelled":
        return `${base} bg-red-100 text-red-800`;
      case "confirmed":
      default:
        return `${base} bg-green-100 text-green-800`;
    }
  };

  return (
    <section>
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">All Bookings</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border rounded-xl shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {booking.vehicle?.name || "Vehicle not found"}
                </h2>
                <span className={statusBadge(booking.status)}>
                  {booking.status}
                </span>
              </div>

              <div className="text-gray-700 space-y-1">
                <p>
                  <strong>User:</strong> {booking.user?.name} ({booking.user?.email})
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ₹{booking.totalPrice}
                </p>
              </div>

              {booking.payment ? (
                <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Payment:</strong> ₹{booking.payment.amount} (
                    {booking.payment.status})
                  </p>
                  <p>
                    <strong>Txn ID:</strong>{" "}
                    {booking.payment.razorpayPaymentId}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-red-500">No payment info</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </section>
  );
}

export default AdminBookings;
