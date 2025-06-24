import { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post("http://localhost:5000/api/auth/register", form);
            alert("Registration successful! You can now login.");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
        <p className="text-sm text-center">
           Already have an account? 
           <Link to="/login" 
           className="text-blue-600 hover:underline">
           Login 
           </Link> 
        </p>
      </form>
    </div>
  );
}

export default Register;