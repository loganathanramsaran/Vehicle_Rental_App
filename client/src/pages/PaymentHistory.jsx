import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/bookings/mine`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch payment history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [SERVER_URL]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No past bookings or payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Vehicle</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Payment ID</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-center">
                  <td className="p-2 border">
                    {booking.vehicle?.title || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    ₹{booking.payment?.amount || booking.totalPrice}
                  </td>
                  <td className="p-2 border">
                    {booking.payment?.razorpayPaymentId || "-"}
                  </td>
                  <td
                    className={`p-2 border font-semibold
                    ${
                        booking.payment?.status === "success"
                        ? "text-green-600"
                        : booking.status === "cancelled" || booking.payment?.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                    `}
                  >
                    {booking.payment?.status || booking.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
