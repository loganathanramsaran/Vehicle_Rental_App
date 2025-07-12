import { Link } from "react-router-dom";

function MiniVehicleCard({ vehicle }) {
  const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="min-w-[250px] max-w-[250px] bg-orange-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={
                  vehicle.image
                    ? `${import.meta.env.VITE_SERVER_URL}${vehicle.image}`
                    : "/placeholder.png"
                }
                alt={vehicle.title}
                className="w-full h-36 object-cover rounded-t-lg "
              />

      <div className="p-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
          {vehicle.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </p>

        <p className="text-sm text-orange-700 font-medium mt-1">
          ₹{vehicle.pricePerDay}/day
        </p>

        <Link to={`/vehicles/${vehicle._id}/book`}>
          <button
            className={`w-full mt-2 py-1 text-sm rounded text-white transition ${
              vehicle.available
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!vehicle.available}
          >
            {vehicle.available ? "Book" : "Unavailable"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MiniVehicleCard;
