import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import HeroFilter from "./HeroFilter";
import MiniVehicleCard from "./MiniVehicleCard";

import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";
import hero4 from "../assets/hero4.png";
import hero5 from "../assets/hero5.png";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const heroImages = [hero1, hero2, hero3, hero4, hero5];

function Hero() {
  const [results, setResults] = useState([]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto px-10 py-16 grid grid-cols-2 gap-10 max-md:grid-cols-1 items-center">
        {/* Left Text Area */}
        <div className="space-y-6 p-10 rounded-lg shadow-xl bg-gray-100 dark:bg-gray-700">
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

        {/* Right Image Swiper */}
        <div className="hidden md:block w-full h-[400px] relative overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="slide"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-full"
          >
            {heroImages.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`Hero ${i}`}
                  className="w-full h-full object-contain transition-all duration-1000"
                />
              </SwiperSlide>
            ))}
          </Swiper>
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
