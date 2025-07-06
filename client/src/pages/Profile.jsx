import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });
  const [form, setForm] = useState({ name: "", address: "", aadhar: "", mobile: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  // For password update
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data.user);
        setForm({
          name: res.data.user.name,
          address: res.data.user.address || "",
          aadhar: res.data.user.aadhar || "",
          mobile: res.data.user.mobile || "",
        });
        if (res.data.user.avatar) {
          setAvatarPreview(`${SERVER_URL}${res.data.user.avatar}`);
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

      await fetchUser();

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

      await fetchUser();
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

  const requestOtp = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/user/request-password-otp`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPasswordMessage(res.data.message);
      setShowPasswordSection(true);
    } catch (err) {
      console.error("OTP request error", err);
      setPasswordMessage("Failed to send OTP ❌");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${SERVER_URL}/api/user/change-password`, {
        otp,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPasswordMessage("Password updated successfully ✅");
      setOtp("");
      setNewPassword("");
      setShowPasswordSection(false);
    } catch (err) {
      console.error("Password update error", err);
      setPasswordMessage(err.response?.data?.error || "Failed to update password ❌");
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
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="123 Main St"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Aadhaar Number</label>
          <input
            name="aadhar"
            value={form.aadhar}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            maxLength={14}
            pattern="\d{4}\s?\d{4}\s?\d{4}"
            title="Enter a valid 12-digit Aadhaar number"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Mobile Number</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            title="Enter a valid 10-digit mobile number"
            required
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

      <button
        onClick={requestOtp}
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded"
      >
        Change Password
      </button>

      {showPasswordSection && (
        <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
          <div>
            <label className="block font-medium">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
          >
            Submit New Password
          </button>

          {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default Profile;
