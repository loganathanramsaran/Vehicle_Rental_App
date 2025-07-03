import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReviewSection from "../components/ReviewSection";

function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
        setVehicle(res.data);

        const bookingsRes = await axios.get(`http://localhost:5000/api/bookings/vehicle/${id}`);
        const ranges = bookingsRes.data.map((b) => ({
          start: new Date(b.startDate),
          end: new Date(b.endDate),
        }));
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("📆 Booked Ranges:", bookedRanges);
  }, [bookedRanges]);

  const isDateBooked = (date) => {
    return bookedRanges.some(
      (range) =>
        date >= new Date(range.start).setHours(0, 0, 0, 0) &&
        date <= new Date(range.end).setHours(23, 59, 59, 999)
    );
  };

  const isRangeAvailable = (start, end) => {
    const curr = new Date(start);
    while (curr <= end) {
      if (isDateBooked(new Date(curr))) return false;
      curr.setDate(curr.getDate() + 1);
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!startDate || !endDate) return alert("Please select both dates");
    if (startDate > endDate) return alert("Start date must be before end date");

    if (!isRangeAvailable(startDate, endDate)) {
      return alert("Selected range contains already booked dates");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const decoded = jwtDecode(token);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = vehicle.pricePerDay * days;

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/orders",
        { amount: totalPrice * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Vehicle Rental",
        description: "Booking Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              { ...response, vehicleId: id, amount: totalPrice * 100 },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              await axios.post(
                "http://localhost:5000/api/bookings",
                {
                  vehicle: id,
                  startDate,
                  endDate,
                  totalPrice,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              alert("✅ Payment successful! Booking confirmed.");
              navigate("/my-bookings");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Something went wrong during booking.");
          }
        },
        prefill: {
          name: decoded.name || "User",
          email: decoded.email || "",
        },
        theme: { color: "#38a169" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong during payment.");
    }
  };

  const dayClassName = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);

    const isBooked = bookedRanges.some(({ start, end }) => {
      const s = new Date(start).setHours(0, 0, 0, 0);
      const e = new Date(end).setHours(0, 0, 0, 0);
      return normalized >= s && normalized <= e;
    });

    if (isBooked) {
      const el = document.querySelector(`[aria-label="${normalized.toDateString()}"]`);
      if (el) el.setAttribute("title", "Booked");
    }

    return isBooked ? "booked-day" : "available-day";
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading vehicle...</p>
      </div>
    );
  }

  const totalDays = startDate && endDate
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  const totalPrice = totalDays * (vehicle?.pricePerDay || 0);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white dark:bg-gray-800 shadow p-6 rounded mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Book Vehicle
          </h2>

          <p className="font-semibold text-center dark:text-gray-200">{vehicle.title}</p>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            ₹{vehicle.pricePerDay}/day
          </p>

          <label className="block mb-2 text-sm dark:text-gray-300">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            excludeDateIntervals={bookedRanges}
            dayClassName={dayClassName}
            // filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Optional: disable weekends
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-2 text-sm dark:text-gray-300">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            excludeDateIntervals={bookedRanges}
            dayClassName={dayClassName}
            // filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Optional: disable weekends
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {startDate && endDate && (
            <div className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300">
              <p>
                Selected:{" "}
                <span className="font-medium">
                  {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}
                </span>
              </p>
              <p>
                Total Days:{" "}
                <span className="font-medium">{totalDays}</span>, Total Price:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ₹{totalPrice}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-6 mb-4">
            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-4 h-4 bg-green-100 rounded border border-green-400 inline-block"></span> Available
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-4 h-4 bg-red-200 rounded border border-red-400 inline-block"></span> Booked
            </span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Pay & Confirm Booking
          </button>
        </form>

      </div>
    </div>
  );
}

export default BookVehicle;
