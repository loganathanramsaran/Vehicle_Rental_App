import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "SUV",
    model: "",
    year: "",
    pricePerDay: "",
    location: "",
    brand: "",
    fuelType: "",
    transmission: "",
    seats: "",
    available: true,
    image: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`);
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to fetch vehicle details");
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setForm({ ...form, image: res.data.image });
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/vehicles/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Vehicle updated successfully");
      navigate("/admin/vehicles");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const imageSrc = form.image?.startsWith("http")
    ? form.image
    : form.image
    ? `${import.meta.env.VITE_SERVER_URL}${form.image}`
    : "/placeholder.png";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" required />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
          {["SUV", "Sedan", "Bike", "Hatchback", "Truck", "Van"].map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="w-full border px-3 py-2 rounded" />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year" type="number" className="w-full border px-3 py-2 rounded" />
        <input name="pricePerDay" value={form.pricePerDay} onChange={handleChange} placeholder="Price Per Day" type="number" className="w-full border px-3 py-2 rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border px-3 py-2 rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full border px-3 py-2 rounded" />
        <input name="fuelType" value={form.fuelType} onChange={handleChange} placeholder="Fuel Type" className="w-full border px-3 py-2 rounded" />
        <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" className="w-full border px-3 py-2 rounded" />
        <input name="seats" value={form.seats} onChange={handleChange} placeholder="Seats" type="number" className="w-full border px-3 py-2 rounded" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
          <span>Available</span>
        </label>

        {/* Image Preview */}
        {form.image && (
          <img
            src={imageSrc}
            alt="Preview"
            className="h-40 w-fit rounded mb-2 border"
          />
        )}

        {/* Image Upload */}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full border px-3 py-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Update Vehicle
        </button>
      </form>
    </div>
  );
}

export default EditVehicle;
