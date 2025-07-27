import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/MainLayout";

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/vehicles/${id}`);
        setVehicle(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicle:", err);
      }
    };
    fetchVehicle();
  }, [id]);

  if (!vehicle)
    return <p className="text-center py-6">Loading vehicle details...</p>;

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 p-4">
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r dark:bg-gray-900 rounded shadow">
          <h2 className="text-4xl font-bold mb-4 text-orange-500 dark:text-orange-600">
            {vehicle.title}
          </h2>

          <img
            src={
              vehicle.image
                ? `${import.meta.env.VITE_SERVER_URL}${vehicle.image}`
                : "/placeholder.png"
            }
            alt={vehicle.title}
            className=" h-64 object-cover mb-4 rounded"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {vehicle.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
            <p>
              <strong>Brand:</strong> {vehicle.brand || "N/A"}
            </p>
            <p>
              <strong>Year:</strong> {vehicle.year || "N/A"}
            </p>
            <p>
              <strong>Model:</strong> {vehicle.model || "N/A"}
            </p>
            <p>
              <strong>Fuel Type:</strong> {vehicle.fuelType || "N/A"}
            </p>
            <p>
              <strong>Transmission:</strong> {vehicle.transmission || "N/A"}
            </p>
            <p>
              <strong>Seats:</strong> {vehicle.seats || "N/A"}
            </p>
            <p>
              <strong>Price/Day:</strong> ₹
              {vehicle.pricePerDay || vehicle.price}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {vehicle.available ? "Available" : "Unavailable"}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Listings
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default VehicleDetails;
