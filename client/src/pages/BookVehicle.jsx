import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select both dates");

    if (startDate > endDate) {
      alert("Start date must be before end date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const decoded = jwtDecode(token);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = vehicle.pricePerDay * days;

    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          vehicle: id,
          startDate,
          endDate,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed.");
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading vehicle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Book Vehicle</h2>

        <p className="font-semibold text-center">{vehicle.title}</p>
        <p className="text-center text-gray-600 mb-4">
          ₹{vehicle.pricePerDay}/day
        </p>

        <label className="block mb-2 text-sm">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          excludeDateIntervals={bookedRanges}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <label className="block mb-2 text-sm">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
          excludeDateIntervals={bookedRanges}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookVehicle;
