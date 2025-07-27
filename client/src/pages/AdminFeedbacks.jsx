import { useEffect, useState } from "react";
import axios from "axios";

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/feedback`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen">
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">User Feedbacks</h1>
        {feedbacks.length === 0 ? (
          <p>No feedbacks yet.</p>
        ) : (
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-10 ">
            {feedbacks.map((f) => (
              <div key={f._id} className=" p-3 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-200 dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 dark:text-white rounded shadow-sm">
                <p>
                  <strong className="text-red-500">Name:</strong> {f.name}
                </p>
                <p>
                  <strong className="text-green-600">Email:</strong> {f.email}
                </p>
                <p>
                  <strong className="text-blue-600">Message:</strong> {f.message}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminFeedbacks;
