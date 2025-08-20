import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/payment/mine`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-lg">Loading payment history...</p>
    );
  }

  if (payments.length === 0) {
    return (
      <p className="text-center py-10 text-lg text-gray-600">
        No payments found.
      </p>
    );
  }

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-10">
      <div className="p-6 max-w-5xl min-h-screen mx-auto">
        <h2 className="text-2xl text-orange-600 dark:text-white font-bold mb-6 text-center">
          My Payment History
        </h2>

        <div className="overflow-x-auto max-h-72 overflow-y-scroll mt-10">
          <table className="w-full border-collapse bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-left sticky top-0 z-30">
                <th className="p-3">Vehicle</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {payment.vehicleId?.name || "Vehicle"}
                  </td>
                  <td className="p-3">₹{payment.amount}</td>
                  <td className="p-3">{payment.razorpayPaymentId}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        payment.status === "success"
                          ? "bg-green-500"
                          : payment.status === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default PaymentHistory;
