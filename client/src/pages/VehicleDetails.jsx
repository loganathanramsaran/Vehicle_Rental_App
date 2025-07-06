import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

  if (!vehicle) return <p>Loading vehicle details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{vehicle.title}</h2>
      <img
        src={vehicle.image || "/placeholder.png"}
        alt={vehicle.title}
        className="w-full h-64 object-cover mb-4 rounded"
        onError={(e) => (e.target.src = "/placeholder.png")}
      />
      <p className="text-gray-600 mb-2">{vehicle.description}</p>
      <p className="text-lg font-semibold">₹{vehicle.price}/day</p>
    </div>
  );
}

export default VehicleDetails;
