import { useEffect, useState } from "react";
import axios from "axios";
import { Star, StarOff } from "lucide-react";

function ReviewSection({ vehicleId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reviews/vehicle/${vehicleId}`
      );
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

  const handleStarClick = (index) => {
    setNewReview({ ...newReview, rating: index });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          vehicle: vehicleId,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prev) => [...prev, res.data.review]);
      setNewReview({ rating: 5, comment: "" });
      setHoverRating(0);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    }
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) =>
      i < count ? (
        <Star key={i} className="w-5 h-5 text-yellow-500 inline-block" fill="currentColor" />
      ) : (
        <StarOff key={i} className="w-5 h-5 text-gray-400 inline-block" />
      )
    );
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">User Reviews</h3>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r._id} className="border-b pb-2">
              <div>{renderStars(r.rating)}</div>
              <p className="mt-1 text-gray-700">{r.comment}</p>
              <p className="text-sm text-gray-500">
                by {r.user?.name || "User"} on{" "}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-medium">Leave a Review</h4>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => handleStarClick(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`w-6 h-6 ${
                  i <= (hoverRating || newReview.rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                fill={i <= (hoverRating || newReview.rating) ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        <textarea
          name="comment"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Write your review..."
          className="w-full border px-3 py-2 rounded"
          rows={3}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default ReviewSection;
