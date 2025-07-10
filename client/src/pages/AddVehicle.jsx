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
    brand: "",
    fuelType: "",
    transmission: "",
    seats: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login as admin");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/vehicles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add New Vehicle</h2>

        <input name="title" onChange={handleChange} value={form.title} placeholder="Vehicle Title" required className="w-full border px-3 py-2 rounded" />

        <select name="type" onChange={handleChange} value={form.type} required className="w-full border px-3 py-2 rounded">
          <option value="">Select Type</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Bike">Bike</option>
        </select>

        <input name="make" onChange={handleChange} value={form.make} placeholder="Make" className="w-full border px-3 py-2 rounded" />
        <input name="model" onChange={handleChange} value={form.model} placeholder="Model" className="w-full border px-3 py-2 rounded" />
        <input name="brand" onChange={handleChange} value={form.brand} placeholder="Brand" className="w-full border px-3 py-2 rounded" />

        <select name="fuelType" onChange={handleChange} value={form.fuelType} className="w-full border px-3 py-2 rounded">
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select name="transmission" onChange={handleChange} value={form.transmission} className="w-full border px-3 py-2 rounded">
          <option value="">Select Transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <input name="seats" type="number" onChange={handleChange} value={form.seats} placeholder="Number of Seats" className="w-full border px-3 py-2 rounded" />

        <input name="year" type="number" onChange={handleChange} value={form.year} placeholder="Year" className="w-full border px-3 py-2 rounded" />

        <input name="pricePerDay" type="number" onChange={handleChange} value={form.pricePerDay} placeholder="Price per Day" required className="w-full border px-3 py-2 rounded" />

        <input name="location" onChange={handleChange} value={form.location} placeholder="Location" className="w-full border px-3 py-2 rounded" />

        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="h-32 w-auto object-contain rounded border"
          />
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;
