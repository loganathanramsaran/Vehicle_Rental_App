import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast} from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });
  const [form, setForm] = useState({
    name: "",
    address: "",
    aadhar: "",
    mobile: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [SERVER_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "aadhar") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 12)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${SERVER_URL}/api/user/me`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(res.data);
      toast.success("Profile updated successfully ✅");
      await fetchUser();
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Update error", err);
      toast.error("Profile update failed ❌");
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
      toast.success("Avatar updated ✅");
      await fetchUser();
    } catch (err) {
      console.error("Avatar upload error", err);
      toast.error("Avatar upload failed ❌");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axios.delete(`${SERVER_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  localStorage.removeItem("token");
      toast.success("Account deleted successfully");
      navigate("/register");
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Account deletion failed");
    }
  };

  const requestOtp = async () => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/user/send-password-otp`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(res.data.message || "OTP sent to your email");
      setShowPasswordSection(true);
    } catch (err) {
      console.error("OTP request error", err);
      toast.error("Failed to send OTP ❌");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("OTP and new password required");
      return;
    }

    try {
      const res = await axios.put(
        `${SERVER_URL}/api/user/change-password`,
        { otp, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Password updated ✅");
      setOtp("");
      setNewPassword("");
      setShowPasswordSection(false);
    } catch (err) {
      console.error("Password update error", err);
      toast.error(err.response?.data?.error || "Failed to update password ❌");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 p-4 ">
      <div className="max-w-5xl mx-auto mt-10 bg-orange-100 dark:bg-gray-800 rounded-lg shadow-lg p-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Avatar & Actions */}
        <div className="flex flex-col items-center">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-orange-500 shadow"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-300 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-600">
              No Avatar
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-4 text-sm"
          />

          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
          >
            Update Profile
          </button>

          <button
            onClick={handleDelete}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
          >
            Delete Account
          </button>

          <button
            onClick={requestOtp}
            className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
          >
            Change Password
          </button>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-orange-600">
            My Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Email (read-only)</label>
                <input
                  value={profile.email}
                  readOnly
                  className="w-full border bg-gray-100 px-3 py-2 rounded dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium">Address</label>
              <input
                name="address"
                type="text"
                placeholder="Full Address (Street, City, State, Pincode)"
                value={form.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
                minLength={10}
                title="Address must include both letters and numbers, min 10 characters"
              />
              </div>
              <div>
                <label className="block font-medium">Aadhaar</label>
              <input
                name="aadhar"
                type="text"
                placeholder="1111 2222 3333"
                value={form.aadhar}
                maxLength={14}
                onChange={handleChange}
                pattern="\d{4}\s\d{4}\s\d{4}"
                title="Enter a valid 12-digit Aadhar number in format 1111 2222 3333"
                className="w-full border px-3 py-2 rounded"
                required
              />
              </div>
              <div>
                <label className="block font-medium">Mobile</label>
              <input
                name="mobile"
                type="tel"
                placeholder="Mobile Number"
                value={form.mobile}
                pattern="[6-9]{1}[0-9]{9}"
                title="Enter a valid 10-digit mobile number starting with 6-9"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              </div>
            </div>
          </form>

          {showPasswordSection && (
            <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Submit New Password
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
