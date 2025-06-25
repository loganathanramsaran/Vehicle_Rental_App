// src/pages/EditVehicle.jsx
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
    image: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
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
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold">Edit Vehicle</h2>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="w-full border px-3 py-2 rounded" />
        <input name="make" value={form.make} onChange={handleChange} placeholder="Make" className="w-full border px-3 py-2 rounded" />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="w-full border px-3 py-2 rounded" />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year" type="number" className="w-full border px-3 py-2 rounded" />
        <input name="pricePerDay" value={form.pricePerDay} onChange={handleChange} placeholder="Price Per Day" type="number" className="w-full border px-3 py-2 rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border px-3 py-2 rounded" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border px-3 py-2 rounded" />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Update Vehicle</button>
      </form>
    </div>
  );
}

export default EditVehicle;
