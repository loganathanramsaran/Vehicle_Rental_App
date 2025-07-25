import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      toast.error(msg);
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
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
        Login to Your Account
      </h2>

      {error && (
        <p className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full border border-gray-300 px-4 py-2 rounded"
          onChange={handleChange}
          value={form.email}
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            onChange={handleChange}
            value={form.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? "bg-orange-400" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 p-4 rounded-md">
  <p>
    ⚠️ <strong>Note:</strong> The <span className="font-medium">first registered user</span> will automatically become an <span className="text-green-700 font-semibold">Admin</span>. 
    All others will be registered as <span className="text-blue-700 font-semibold">Users</span> by default.
  </p>
</div>

    </AuthLayout>
  );
}

export default Login;
