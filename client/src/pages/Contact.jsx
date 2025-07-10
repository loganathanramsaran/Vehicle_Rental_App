import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/feedback`, form);
      toast.success("Feedback sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send feedback");
    }
  };

  return (
    <div className="px-10 py-16 mx-auto dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center text-orange-600">
        Contact Us
      </h1>
      <p className="text-center text-gray-700 mb-4 text-sm">Please submit your user experience and your valuable feedback!</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full p-2 border rounded dark:bg-gray-600"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          placeholder="you@example.com"
          className="w-full p-2 border rounded dark:bg-gray-600"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          placeholder="Your message..."
          className="w-full p-2 border rounded h-32 dark:bg-gray-600"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
