import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      side="left"
      title="Welcome Back!"
      message="Login to manage your bookings, browse vehicles and more."
      image="https://cdn-icons-png.flaticon.com/512/3011/3011270.png"
      linkText="Don't have an account? Register here"
      linkTo="/register"
    >
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Login to Your Account</h2>

      {error && <p className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-green-500"
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
            loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
