import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
      <img
        src={vehicle.image || placeholderImage}
        alt={vehicle.title}
        className="w-full h-28 object-cover rounded mb-3"
        onError={(e) => (e.target.src = placeholderImage)}
      />

      <h2 className="text-xl font-bold mb-1">{vehicle.title}</h2>
      <p className="text-gray-600 mb-1">
        {vehicle.make} {vehicle.model} ({vehicle.year})
      </p>
      <p className="text-gray-600 mb-1">📍 {vehicle.location}</p>

       {/* ⭐ Average Rating  */}
      {vehicle.averageRating !== null && (
        <p className="text-yellow-600 font-medium text-sm mb-1">
          ⭐ {vehicle.averageRating.toFixed(1)} / 5{" "}
          <span className="text-gray-500">({vehicle.reviewCount} reviews)</span>
        </p>
      )}

      <p className="text-green-700 font-semibold mb-2">
        ₹{vehicle.pricePerDay} / day
      </p>
      <p className="text-sm mb-3">
        {vehicle.available ? (
          <span className="text-green-600">Available ✅</span>
        ) : (
          <span className="text-red-600">Not Available ❌</span>
        )}
      </p>

      <Link to={`/vehicles/${vehicle._id}/book`}>
        <button
          className={`w-full py-2 rounded text-white ${
            vehicle.available
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!vehicle.available}
        >
          {vehicle.available ? "Book Now" : "Unavailable"}
        </button>
      </Link>
    </div>
  );
}

export default VehicleCard;
