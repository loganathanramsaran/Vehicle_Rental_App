import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [step, setStep] = useState(1); // 1 = Email step, 2 = OTP + full form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    setError("");
    if (!form.email || !form.name) {
      return setError("Please enter your name and email first.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.VITE_SERVER_URL}/api/auth/send-otp`, {
        email: form.email,
        name: form.name,
      });
      alert("OTP sent to your email");
      setStep(2); // go to next step
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${process.env.VITE_SERVER_URL}/api/auth/register`, form);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      message="Sign up to rent vehicles and more."
      linkText="Already have an account? Login"
      linkTo="/login"
      image="https://cdn-icons-png.flaticon.com/512/3917/3917241.png"
      side="right"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-orange-600 text-center">Register</h2>

        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</p>
        )}

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
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
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
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
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              name="aadhar"
              type="text"
              placeholder="Aadhaar Number"
              value={form.aadhar}
              maxLength={14}
              pattern="\d{4}\s?\d{4}\s?\d{4}"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              value={form.mobile}
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
}

export default Register;
