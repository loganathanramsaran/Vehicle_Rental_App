import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/reviews/all`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-600 mb-10">
          What Our Customers Say
        </h2>

        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {reviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
              No testimonials yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-orange-100 dark:bg-gray-800 rounded-xl shadow p-6"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                  "{review.comment}"
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  — {review.user?.name || "Anonymous"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
