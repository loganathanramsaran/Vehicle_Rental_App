import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function BookVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/vehicles/${id}`)
      .then((res) => setVehicle(res.data))
      .catch((err) => console.error("Vehicle fetch error:", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const decoded = jwtDecode(token);
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const totalPrice = vehicle.pricePerDay * days;

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        vehicle: id,
        startDate: form.startDate,
        endDate: form.endDate,
        totalPrice,
      },
      {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
        <input
          type="date"
          name="startDate"
          className="w-full border px-3 py-2 rounded mb-4"
          onChange={handleChange}
          required
        />

        <label className="block mb-2 text-sm">End Date</label>
        <input
          type="date"
          name="endDate"
          className="w-full border px-3 py-2 rounded mb-4"
          onChange={handleChange}
          required
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
