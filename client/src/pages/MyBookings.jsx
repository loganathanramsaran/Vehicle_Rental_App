import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Added authorization header
            },
          }
        );
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading bookings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">
                {booking.vehicle?.title || "Vehicle Info Unavailable"}
              </h2>
              {booking.vehicle?.image ? (
                <img
                  src={booking.vehicle.image}
                  alt={booking.vehicle.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
                  No image
                </div>
              )}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
