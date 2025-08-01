import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  const placeholderImage = "/placeholder.png"; // Path to your placeholder image

  const imageSrc = vehicle.image?.startsWith("http")
    ? vehicle.image
    : vehicle.image
    ? `${import.meta.env.VITE_SERVER_URL}${vehicle.image}` 
    : placeholderImage;

  return (
    <div className="bg-gradient-to-tr from-orange-200 dark:from-gray-700 via-white dark:via-gray-400 to-orange-200 dark:to-gray-400 shadow rounded p-4 hover:shadow-lg transition">
      <img
        src={imageSrc}
        alt={vehicle.title}
        className="h-36 w-fit mix-blend-multiply justify-center object-cover rounded mb-3"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImage;
        }}
      />

      <h2 className="text-xl font-bold mb-1">{vehicle.title}</h2>
      <p className="text-gray-600 dark:text-white mb-1">
        {vehicle.make} {vehicle.model} ({vehicle.year})
      </p>
      <p className="text-gray-600 dark:text-white mb-1">
        📍 {vehicle.location}
      </p>

      <p className="text-yellow-600 font-medium text-sm mb-1">
        {vehicle.averageRating !== null ? (
          <>
            ⭐ {vehicle.averageRating.toFixed(1)} / 5{" "}
            <span className="text-gray-500">
              ({vehicle.reviewCount} reviews)
            </span>
          </>
        ) : (
          <>☆ Not yet rated</>
        )}
      </p>

      <p className="text-green-700 dark:text-white font-semibold mb-2">
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
              ? "bg-orange-500 hover:bg-orange-600"
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
