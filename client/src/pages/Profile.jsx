import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    aadhar: "",
  });

  const { user, fetchUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        aadhar: user.aadhar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
    const mobileRegex = /^[6-9]{1}[0-9]{9}$/;

    if (!aadharRegex.test(form.aadhar)) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    if (!mobileRegex.test(form.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/me`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile updated successfully ✅");
      await fetchUser();

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Profile update error", err);
      toast.error("Profile update failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-white via-orange-200 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded shadow-md p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Edit Profile</h2>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            pattern="[6-9]{1}[0-9]{9}"
            maxLength={10}
            required
            placeholder="10-digit mobile number"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Aadhaar</label>
          <input
            name="aadhar"
            value={form.aadhar}
            onChange={handleChange}
            pattern="\d{4}\s?\d{4}\s?\d{4}"
            maxLength={14}
            required
            placeholder="XXXX XXXX XXXX"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
