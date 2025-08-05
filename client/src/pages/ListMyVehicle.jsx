import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ListMyVehicle() {
  const [form, setForm] = useState({
    name: "",
    type: "Car",
    rentPerDay: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a vehicle image.");
    if (!form.name || !form.rentPerDay || !form.description)
      return toast.error("Please fill all required fields.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("rentPerDay", form.rentPerDay);
      formData.append("description", form.description);
      formData.append("image", image);

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/vehicles`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Vehicle submitted for approval!");
      setForm({ name: "", type: "Car", rentPerDay: "", description: "" });
      setImage(null);
      setPreview(null);
      navigate("/my-vehicles");
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
        List Your Vehicle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          placeholder="Vehicle Name *"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
        >
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
        </select>

        <input
          name="rentPerDay"
          type="number"
          min={100}
          placeholder="Rent Per Day (INR) *"
          value={form.rentPerDay}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
        />

        <textarea
          name="description"
          placeholder="Vehicle Description *"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded py-2 px-2"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 rounded w-full h-64 object-cover shadow"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
}

export default ListMyVehicle;
