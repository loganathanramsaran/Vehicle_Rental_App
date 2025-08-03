import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);

  const totalAmount = totalDays * (vehicle?.rentPerDay || 0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`
        );
        setVehicle(data);
      } catch (err) {
        console.error("Vehicle fetch error:", err);
        toast.error("Vehicle not found.");
      }
    };

    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/bookings/booked-dates/${id}`
        );
        const ranges = data.bookedDates.map(({ startDate, endDate }) => ({
          start: new Date(startDate),
          end: new Date(endDate),
        }));
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Booked dates fetch error:", err);
      }
    };

    fetchVehicle();
    fetchBookedDates();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(diffTime / (1000 * 3600 * 24));
      setTotalDays(days > 0 ? days : 0);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const isDateBooked = (date) => {
    return bookedRanges.some(
      (range) => date >= range.start && date <= range.end
    );
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
    if (
      bookedRanges.some(
        (range) =>
          (startDate >= range.start && startDate <= range.end) ||
          (endDate >= range.start && endDate <= range.end) ||
          (startDate <= range.start && endDate >= range.end)
      )
    ) {
      toast.error("Selected dates overlap with existing bookings.");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const { data: order } = await axios.post(
        "/api/payment/orders",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "/api/payment/verify",
              {
                ...response,
                vehicleId: id,
                amount: totalAmount,
                startDate,
                endDate,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("Booking successful!");
              navigate("/my-bookings");
            } else {
              toast.error("Booking verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2E86DE" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed.");
      setLoading(false);
    }
  };

  if (!vehicle) {
    return (
      <div className="text-center mt-20 text-xl text-gray-700">
        Loading vehicle details...
      </div>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-10 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          Book {vehicle.name}
        </h2>

        <img
          src={
            vehicle.image?.startsWith("http")
              ? vehicle.image
              : `${import.meta.env.VITE_SERVER_URL}${vehicle.image}`
          }
          alt={vehicle.name}
          className="w-fit object-cover rounded-lg mb-6"
        />

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              excludeDateIntervals={bookedRanges}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholderText="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate || new Date()}
              excludeDateIntervals={bookedRanges}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholderText="Select end date"
            />
          </div>
        </div>

        <div className="mb-6 text-lg text-center">
          Total Rent:{" "}
          <span className="font-bold text-blue-600">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </section>
  );
}

export default BookVehicle;
