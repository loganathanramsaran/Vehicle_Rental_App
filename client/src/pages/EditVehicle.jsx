import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({
    title: "",
    type: "",
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const vehicleTypes = ["SUV", "Sedan", "Bike", "Hatchback", "Truck", "Van"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVehicle(res.data);
        setForm(res.data);
      })
      .catch((err) => {
        console.error("Failed to load vehicle:", err);
        alert("Vehicle not found");
        navigate("/admin/vehicles");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.title ||
      !form.type ||
      !form.make ||
      !form.model ||
      !form.year ||
      !form.pricePerDay ||
      !form.location ||
      !form.image
    ) {
      alert("All fields are required.");
      return;
    }

    if (form.year < 1990 || form.year > new Date().getFullYear()) {
      alert("Please enter a valid year.");
      return;
    }

    if (form.pricePerDay <= 0) {
      alert("Price per day must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Vehicle updated!");
      navigate("/admin/vehicles");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update vehicle");
    }
  };

  if (!vehicle) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-orange-600">Edit Vehicle</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Type</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          name="make"
          value={form.make}
          onChange={handleChange}
          placeholder="Make"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="model"
          value={form.model}
          onChange={handleChange}
          placeholder="Model"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          type="number"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="pricePerDay"
          value={form.pricePerDay}
          onChange={handleChange}
          placeholder="Price Per Day"
          type="number"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Image Preview */}
        {form.image && (
          <div className="mt-2">
            <img
              src={form.image}
              alt="Vehicle Preview"
              className="h-40 w-full object-cover rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png"; // Fallback image
              }}
            />
          </div>
        )}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Update Vehicle
        </button>
      </form>
    </div>
  );
}

export default EditVehicle;
