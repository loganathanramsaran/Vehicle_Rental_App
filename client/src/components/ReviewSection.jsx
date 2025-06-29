import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function ReviewSection({ vehicleId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/vehicle/${vehicleId}`);
      setReviews(res.data);
    } catch (err) {
      setError("Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
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
  } catch (err) {
    console.error("Review post error:", err);
    setError(
      err.response?.data?.error || "Something went wrong while posting review."
    );
  }
};

  return (
    <div className="mt-8 bg-white shadow p-6 rounded w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">User Reviews</h3>

      {loading ? (
        <p className="text-gray-600">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r._id} className="border-b pb-2">
              <p className="font-semibold">⭐ {r.rating}/5</p>
              <p>{r.comment}</p>
              <p className="text-xs text-gray-500">
                by {r.user?.name || "Anonymous"} on{" "}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-semibold">Leave a Review</h4>
        <select
          name="rating"
          value={newReview.rating}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <textarea
          name="comment"
          value={newReview.comment}
          onChange={handleInputChange}
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
