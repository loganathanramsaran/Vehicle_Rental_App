import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    aadhar: "",
    mobile: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const sendOtp = async () => {
    if (!form.email || !form.name) {
      toast.error("Please enter your name and email first.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/send-otp`, {
        email: form.email,
        name: form.name,
      });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/register`,
        form
      );
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Create Your Account"
        message="Sign up to rent vehicles and more."
        linkText="Already have an account? Login"
        linkTo="/login"
        image="https://cdn-icons-png.flaticon.com/512/3917/3917241.png"
        side="right"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-orange-600 text-center">
            Register
          </h2>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            pattern="^[A-Za-z ]{2,}$"
            title="Enter a valid full name (letters only)"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Enter Unique Email (one per mobile number)"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {step === 1 ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={form.password}
                  minLength={6}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

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

              <input
                name="mobile"
                type="tel"
                placeholder="Enter unique mobile number (one per email)"
                value={form.mobile}
                pattern="[6-9]{1}[0-9]{9}"
                title="Enter a valid 10-digit mobile number starting with 6-9"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded ${
                  loading
                    ? "bg-orange-400"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>
      </AuthLayout>
    </>
  );
}

export default Register;
