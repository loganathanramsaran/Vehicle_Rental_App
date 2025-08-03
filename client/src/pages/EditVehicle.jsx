import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({ name: "", type: "Car", rentPerDay: "", description: "" });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`/api/vehicles/details/${id}`);
        setVehicle(data);
        setForm({
          name: data.name,
          type: data.type,
          rentPerDay: data.rentPerDay,
          description: data.description,
        });
        setPreviewUrl(`${import.meta.env.VITE_SERVER_URL}${data.image}`);
      } catch (err) {
        toast.error("Failed to load vehicle details");
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("rentPerDay", form.rentPerDay);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/vehicles/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Vehicle updated and sent for re-approval");
      navigate("/my-vehicles");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Edit Vehicle</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            vehicle.isApproved
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {vehicle.isApproved ? "Approved" : "Pending Approval"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Vehicle Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring"
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Van">Van</option>
            <option value="SUV">SUV</option>
          </select>
        </div>

        {/* Rent Per Day */}
        <div>
          <label className="block font-medium mb-1">Rent Per Day (₹)</label>
          <input
            type="number"
            name="rentPerDay"
            value={form.rentPerDay}
            onChange={handleChange}
            required
            min="100"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Vehicle Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
              }
            }}
            className="mb-2"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-32 object-cover border rounded shadow-md"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default EditVehicle;
