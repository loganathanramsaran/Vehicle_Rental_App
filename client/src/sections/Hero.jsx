import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import carImage from "../assets/blue-car.png";
import HeroFilter from "./HeroFilter";
import MiniVehicleCard from "./MiniVehicleCard";

function Hero() {
  const [results, setResults] = useState([]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className=" mx-auto px-10 py-16 flex gap-24 items-center">
        {/* Left Text Area */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Accompany your <br />
            <span className="text-orange-500">journey</span> with comfort
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Car rent services for various terrain with guaranteed quality
          </p>

          <div className="flex items-center gap-4 mb-10">
            <Link
              to="/services"
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition"
            >
              Learn More
            </Link>
            <Link
              to="/vehicles"
              className="text-gray-800 flex gap-2 dark:text-white font-medium hover:underline hover:text-blue-700 dark:hover:bg-gray-700 transition"
            >
              Browse Vehicles <ArrowRightCircle className="w-5" />
            </Link>
          </div>

          {/* Filter Bar */}
          <HeroFilter onResults={(vehicles) => setResults(vehicles)} />
        </div>

        {/* Right Image */}
        <div className="relative hidden md:block ">
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-orange-400 dark:bg-orange-700 rounded-[60px] z-0" />
          <img
            src={carImage}
            alt="Hero Car"
            className="relative z-10 w-full max-w-md mx-auto drop-shadow-xl "
          />
        </div>
      </div>

      {/* Filtered Results Section */}
      {results.length > 0 && (
        <div className="max-w-7xl mx-auto mt-10 px-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Available Vehicles
          </h3>
          <div className="flex gap-6 pb-4 overflow-x-scroll">
            {results.map((vehicle) => (
              <div key={vehicle._id} className="min-w-[300px]">
                <MiniVehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
