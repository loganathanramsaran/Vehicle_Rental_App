import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddVehicle() {
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/vehicles", form);
      alert("Vehicle added successfully!");
      navigate("/vehicles");
    } catch (err) {
      console.error("Add vehicle error:", err);
      alert("Failed to add vehicle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Vehicle</h2>

        <input name="title" onChange={handleChange} value={form.title} placeholder="Vehicle Title" className="w-full border px-3 py-2 rounded" required />

        <input name="type" onChange={handleChange} value={form.type} placeholder="Type (SUV, Sedan, etc.)" className="w-full border px-3 py-2 rounded" required />

        <input name="make" onChange={handleChange} value={form.make} placeholder="Make" className="w-full border px-3 py-2 rounded" />

        <input name="model" onChange={handleChange} value={form.model} placeholder="Model" className="w-full border px-3 py-2 rounded" />

        <input name="year" onChange={handleChange} value={form.year} type="number" placeholder="Year" className="w-full border px-3 py-2 rounded" />

        <input name="pricePerDay" onChange={handleChange} value={form.pricePerDay} type="number" placeholder="Price per Day" className="w-full border px-3 py-2 rounded" required />

        <input name="location" onChange={handleChange} value={form.location} placeholder="Location" className="w-full border px-3 py-2 rounded" />

        <input name="image" onChange={handleChange} value={form.image} placeholder="Image URL" className="w-full border px-3 py-2 rounded" />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;
