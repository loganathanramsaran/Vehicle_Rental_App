import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      side="right"
      title="Join RentalApp"
      message="Sign up to book vehicles, manage trips and more."
      image="https://cdn-icons-png.flaticon.com/512/3917/3917241.png"
      linkText="Already have an account? Login here"
      linkTo="/login"
    >
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Create Your Account</h2>

      {error && <p className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
