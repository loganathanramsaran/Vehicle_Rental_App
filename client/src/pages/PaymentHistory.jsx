import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { jwtDecode } from "jwt-decode";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const decoded = jwtDecode(token);
        const res = await axios.get("http://localhost:5000/api/bookings/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });

const withPayments = res.data
  .filter((b) => b.payment && b.payment.razorpayPaymentId)
  .sort((a, b) => new Date(b.payment.createdAt) - new Date(a.payment.createdAt));
        setPayments(withPayments);
      } catch (err) {
        console.error("Failed to load payments:", err);
        setError("Could not load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading payment history...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  if (payments.length === 0)
    return <p className="p-6 text-center text-gray-500">No payments found.</p>;

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
        Booking & Payment History
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm uppercase">
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((booking) => (
              <tr key={booking._id} className="border-t dark:border-gray-700">
                <td className="p-3">{booking.vehicle?.title || "N/A"}</td>
                <td className="p-3">
                  {new Date(booking.startDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-green-600 font-medium">
                  ₹{booking.payment?.amount / 100}
                </td>
                <td className="p-3 text-sm break-all">
                  {booking.payment?.razorpayPaymentId || "N/A"}
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      booking.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  {new Date(booking.payment?.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {booking.status === "cancelled" ? (
                    <button
                      disabled
                      className="text-sm px-3 py-1 rounded bg-gray-400 text-white cursor-not-allowed"
                    >
                      Invoice
                    </button>
                  ) : (
                    <InvoiceTemplate payment={booking} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;
