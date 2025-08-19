import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookedDate.css";

function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

  // Normalize date to midnight
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const fetchVehicle = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`
      );
      setVehicle(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Vehicle not found");
      setLoading(false);
    }
  };

  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/bookings/booked-dates/${id}`
      );

      const dates = [];
      res.data.forEach(({ start, end }) => {
        const startDate = normalizeDate(start);
        const endDate = normalizeDate(end);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d.getTime()));
        }
      });

      setBookedDates(dates);
    } catch (error) {
      console.error("Failed to fetch booked dates", error);
    }
  };

  useEffect(() => {
    fetchVehicle();
    fetchUser();
    fetchBookedDates();
  }, [id]);

  const isRangeOverlapping = (start, end) => {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (
        bookedDates.some((b) => b.toDateString() === new Date(d).toDateString())
      ) {
        return true;
      }
    }
    return false;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const totalAmount = calculateDays() * (vehicle?.rentPerDay || 0);

const handlePayment = async () => {
  if (!startDate || !endDate) {
    toast.warn("Please select both start and end dates");
    return;
  }

  if (isRangeOverlapping(startDate, endDate)) {
    toast.error("Selected range includes booked dates. Please choose again.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const bookingAmount = totalAmount; // guaranteed number

    // 1️⃣ Create Razorpay order
    const { data: order } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/payment/orders`,
      { amount: bookingAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Vehicle Rental",
      description: `Booking for ${vehicle.name}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          // 2️⃣ Verify payment + create booking on backend
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              vehicleId: vehicle._id,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              amount: bookingAmount,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            toast.success("Booking successful!");
            fetchBookedDates(); // refresh booked dates
            navigate("/my-bookings");
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (err) {
          console.error("Booking/verification error:", err);
          toast.error("Failed to confirm booking.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error("Payment initiation failed!");
  }
};

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (!vehicle)
    return <div className="p-6 text-red-600">Vehicle not found</div>;

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen">
      <div className="max-w-4xl max-md:max-w-xl min-h-screen mx-auto items-center grid lg:grid-cols-2 gap-6 p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">{vehicle.name}</h2>
          <img
            src={
              vehicle.image?.startsWith("http")
                ? vehicle.image
                : `${import.meta.env.VITE_SERVER_URL}/uploads/${vehicle.image}`
            }
            alt={vehicle.name}
            className="w-fit h-64 object-cover rounded mb-4"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">{vehicle.description}</p>
          <p className="text-gray-800 font-semibold">
            ₹{vehicle.rentPerDay} / day
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                excludeDates={bookedDates}
                dayClassName={(date) =>
                  bookedDates.some(
                    (b) => b.toDateString() === date.toDateString()
                  )
                    ? "booked-date"
                    : undefined
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  let validEnd = new Date(date);
                  if (startDate && date) {
                    for (
                      let d = new Date(startDate);
                      d <= validEnd;
                      d.setDate(d.getDate() + 1)
                    ) {
                      if (
                        bookedDates.some(
                          (b) => b.toDateString() === d.toDateString()
                        )
                      ) {
                        validEnd = new Date(d);
                        validEnd.setDate(validEnd.getDate() - 1);
                        toast.warn("End date adjusted to avoid booked dates.");
                        break;
                      }
                    }
                  }
                  setEndDate(validEnd);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                excludeDates={bookedDates}
                dayClassName={(date) =>
                  bookedDates.some(
                    (b) => b.toDateString() === date.toDateString()
                  )
                    ? "booked-date"
                    : undefined
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold">
              Total Days: {calculateDays()} | Total: ₹{totalAmount}
            </p>
          </div>

          <button
            onClick={handlePayment}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Pay & Book
          </button>

          <div className="mt-4 text-sm text-gray-600">
            <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span>
            Booked Dates
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookVehicle;
