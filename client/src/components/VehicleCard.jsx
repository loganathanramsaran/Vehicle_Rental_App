import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  const placeholderImage = "/placeholder.png";

  // const imageSrc = vehicle.image?.startsWith("http")
  //   ? vehicle.image
  //   : vehicle.image
  //   ? `${import.meta.env.VITE_SERVER_URL}/uploads/${vehicle.image}`
  //   : placeholderImage;

  const {
    name = "Untitled Vehicle",
    location = "Not specified",
    averageRating,
    reviewCount,
    rentPerDay = 0,
    available = false,
    _id,
    type = "Unknown",
    owner,
  } = vehicle;

  const isPeerListed = !!owner;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/uploads/${vehicle.image}`}
          alt={vehicle.name}
          className="w-fit h-48 object-cover rounded"
        />

        <span
          className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full shadow ${
            available ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>

        {isPeerListed && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">
            Peer Listed
          </span>
        )}
      </div>

      <div className="flex flex-col p-4 gap-2 flex-grow">
        <h3
          className="text-lg font-bold text-gray-900 dark:text-white truncate"
          title={name}
        >
          {name}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          📍 {location}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          🚗 Type: {type}
        </p>

        <div className="mt-1">
          {typeof averageRating === "number" ? (
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              ⭐ {averageRating.toFixed(1)}
              <span className="text-xs text-gray-500 dark:text-gray-300">
                ({reviewCount || 0} reviews)
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">☆ Not yet rated</span>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-orange-600 dark:text-orange-400 font-semibold text-base">
            ₹{rentPerDay} / day
          </p>

          <Link to={`/vehicles/${_id}/book`} className="block mt-3">
            <button
              disabled={!available}
              className={`w-full py-2 rounded-xl font-medium text-white transition-all duration-200 ${
                available
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {available ? "Book Now" : "Not Available"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
