import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/payment/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to load payments:", err);
        setError("Failed to load payments");
      }
    };

    fetchPayments();
  }, []);

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
      <div className="max-w-4xl h-screen mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-orange-400 dark:bg-orange-950 dark:text-white text-left">
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-t dark:bg-transparent dark:text-white hover:bg-orange-200"
                  >
                    <td className="p-3">{payment.vehicleId?.name || "N/A"}</td>
                    <td className="p-3 text-green-600 font-semibold">
                      ₹{" "}
                      {typeof payment.amount === "number"
                        ? payment.amount.toFixed(0)
                        : "N/A"}
                    </td>
                    <td className="p-3 break-all">
                      {payment.razorpayPaymentId || "N/A"}
                    </td>
                    <td className="p-3 capitalize">
                      {payment.status || "N/A"}
                    </td>
                    <td className="p-3">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default PaymentHistory;
