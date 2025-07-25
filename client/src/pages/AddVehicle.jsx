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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.type) errs.type = "Type is required.";
    if (!form.make.trim()) errs.make = "Make is required.";
    if (!form.model.trim()) errs.model = "Model is required.";
    if (!form.brand.trim()) errs.brand = "Brand is required.";
    if (!form.location.trim()) errs.location = "Location is required.";

    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) {
      errs.pricePerDay = "Enter a valid price.";
    }

    if (!form.seats || Number(form.seats) <= 0) {
      errs.seats = "Enter valid seat count.";
    }

    const currentYear = new Date().getFullYear();
    if (!form.year || Number(form.year) < 1990 || Number(form.year) > currentYear) {
      errs.year = `Enter a valid year between 1990 and ${currentYear}.`;
    }

    if (!form.fuelType) errs.fuelType = "Fuel type is required.";
    if (!form.transmission) errs.transmission = "Transmission is required.";
    if (!imageFile) errs.image = "Image is required.";

    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login as admin");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("image", imageFile);

    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-orange-300 dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-lg space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add New Vehicle</h2>

        {/* Title */}
        <div>
          <input name="title" onChange={handleChange} value={form.title} placeholder="Vehicle Title" className="w-full border px-3 py-2 rounded" />
          {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
        </div>

        {/* Type */}
        <div>
          <select name="type" onChange={handleChange} value={form.type} className="w-full border px-3 py-2 rounded">
            <option value="">Select Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Bike">Bike</option>
          </select>
          {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
        </div>

        {/* Make */}
        <div>
          <input name="make" onChange={handleChange} value={form.make} placeholder="Make" className="w-full border px-3 py-2 rounded" />
          {errors.make && <p className="text-red-600 text-sm">{errors.make}</p>}
        </div>

        {/* Model */}
        <div>
          <input name="model" onChange={handleChange} value={form.model} placeholder="Model" className="w-full border px-3 py-2 rounded" />
          {errors.model && <p className="text-red-600 text-sm">{errors.model}</p>}
        </div>

        {/* Brand */}
        <div>
          <input name="brand" onChange={handleChange} value={form.brand} placeholder="Brand" className="w-full border px-3 py-2 rounded" />
          {errors.brand && <p className="text-red-600 text-sm">{errors.brand}</p>}
        </div>

        {/* Fuel Type */}
        <div>
          <select name="fuelType" onChange={handleChange} value={form.fuelType} className="w-full border px-3 py-2 rounded">
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.fuelType && <p className="text-red-600 text-sm">{errors.fuelType}</p>}
        </div>

        {/* Transmission */}
        <div>
          <select name="transmission" onChange={handleChange} value={form.transmission} className="w-full border px-3 py-2 rounded">
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
          {errors.transmission && <p className="text-red-600 text-sm">{errors.transmission}</p>}
        </div>

        {/* Seats */}
        <div>
          <input name="seats" type="number" onChange={handleChange} value={form.seats} placeholder="Number of Seats" className="w-full border px-3 py-2 rounded" />
          {errors.seats && <p className="text-red-600 text-sm">{errors.seats}</p>}
        </div>

        {/* Year */}
        <div>
          <input name="year" type="number" onChange={handleChange} value={form.year} placeholder="Year" className="w-full border px-3 py-2 rounded" />
          {errors.year && <p className="text-red-600 text-sm">{errors.year}</p>}
          <p className="text-xs text-gray-500">Year must be between 1990 and {new Date().getFullYear()}.</p>
        </div>

        {/* Price */}
        <div>
          <input name="pricePerDay" type="number" onChange={handleChange} value={form.pricePerDay} placeholder="Price per Day" className="w-full border px-3 py-2 rounded" />
          {errors.pricePerDay && <p className="text-red-600 text-sm">{errors.pricePerDay}</p>}
        </div>

        {/* Location */}
        <div>
          <input name="location" onChange={handleChange} value={form.location} placeholder="Location" className="w-full border px-3 py-2 rounded" />
          {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
          {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
        </div>

        {/* Image Preview */}
        {imageFile && (
          <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-32 w-auto object-contain rounded border" />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default AddVehicle;
