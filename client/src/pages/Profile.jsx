import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });
  const [form, setForm] = useState({ name: "", password: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data);
        setForm({ name: res.data.name, password: "" });
        if (res.data.avatar) {
          setAvatarPreview(`${SERVER_URL}${res.data.avatar}`);
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [SERVER_URL]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${SERVER_URL}/api/user/me`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(res.data);
      setMessage("Profile updated successfully ✅");

      await fetchUser(); // 👈 sync context

      setTimeout(() => {
        setMessage("");
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Update error", err);
      setMessage("Update failed ❌");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(`${SERVER_URL}/api/user/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAvatarPreview(`${SERVER_URL}${res.data.avatar}`);
      setMessage("Avatar updated ✅");

      await fetchUser(); // 👈 sync context after avatar change
    } catch (err) {
      console.error("Avatar upload error", err);
      setMessage("Avatar upload failed ❌");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      localStorage.removeItem("token");
      navigate("/register");
    } catch (err) {
      console.error("Delete error", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email (read-only)</label>
          <input
            value={profile.email}
            readOnly
            className="w-full border bg-gray-100 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">New Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div>
          <label className="block font-medium">Avatar</label>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
              No Avatar
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block"
          />
        </div>

        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded"
      >
        Delete My Account
      </button>
    </div>
  );
}

export default Profile;
