import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`);
        setVehicle(res.data);

        const bookingsRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/bookings/vehicle/${id}`);
        const activeBookings = bookingsRes.data.filter((b) => b.status !== "cancelled");

        const ranges = activeBookings.map((b) => ({
          start: new Date(b.startDate),
          end: new Date(b.endDate),
        }));
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load vehicle or bookings");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

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

  const validateBooking = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return false;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date.");
      return false;
    }

    if (!isRangeAvailable(startDate, endDate)) {
      toast.error("Selected date range includes already booked dates.");
      return false;
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
    if (!validateBooking()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book.");
      return;
    }

    const decoded = jwtDecode(token);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = vehicle.pricePerDay * days;

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/orders`,
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
              `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
              { ...response, vehicleId: id, amount: totalPrice * 100 },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings`,
                {
                  vehicle: id,
                  startDate,
                  endDate,
                  totalPrice,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              toast.success("✅ Payment successful! Booking confirmed.");
              navigate("/my-bookings");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Something went wrong during booking.");
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
      toast.error("Something went wrong during payment.");
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

    return isBooked ? "booked-day" : "available-day";
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading vehicle...</p>
      </div>
    );
  }

  const totalDays =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  const totalPrice = totalDays * (vehicle?.pricePerDay || 0);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-gradient-to-r from-orange-100 via-orange-300 to-orange100 dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 shadow p-6 rounded mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            Book Vehicle
          </h2>

          <div className="py-5 flex flex-wrap items-center justify-evenly max-md:justify-around ">
            <div>
              <p className="font-semibold dark:text-gray-200">{vehicle.title}</p>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                ₹{vehicle.pricePerDay}/day
              </p>
            </div>

            <img
              src={
                vehicle.image
                  ? `${import.meta.env.VITE_SERVER_URL}${vehicle.image}`
                  : "/placeholder.png"
              }
              alt={vehicle.title}
              className="h-36 rounded object-cover"
            />
          </div>

          <div className="flex justify-evenly">
            <div>
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
                className="w-full border px-3 py-2 rounded mb-4"
              />
            </div>
            <div>
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
                className="w-full border px-3 py-2 rounded mb-4"
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="mb-4 text-center text-sm text-gray-700 dark:text-gray-300">
              <p>
                Selected:{" "}
                <span className="font-medium">
                  {startDate.toLocaleDateString()} → {endDate.toLocaleDateString()}
                </span>
              </p>
              <p>
                Total Days: <span className="font-medium">{totalDays}</span>, Total Price:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ₹{totalPrice}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-6 mb-4">
            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-4 h-4 bg-green-100 rounded border border-green-400 inline-block"></span>{" "}
              Available
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-4 h-4 bg-red-200 rounded border border-red-400 inline-block"></span>{" "}
              Booked
            </span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Pay & Confirm Booking
          </button>

          <p className="mt-2 text-gray-700 text-sm text-center">
            Please wait a moment to confirm your booking after payment is successful.
          </p>
        </form>
      </div>

      <ReviewSection className="max-w-4xl mx-auto" vehicleId={id} />
    </div>
  );
}

export default BookVehicle;
