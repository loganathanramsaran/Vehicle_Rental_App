import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Car, CalendarCheck } from "lucide-react";

const allSteps = [
  {
    key: "signup",
    icon: <UserPlus className="w-10 h-10 text-orange-500 mb-3" />,
    title: "Sign Up",
    text: "Create your free account and get started in minutes.",
    path: "/login",
  },
  {
    key: "choose",
    icon: <Car className="w-10 h-10 text-orange-500 mb-3" />,
    title: "Choose Vehicle",
    text: "Browse a wide range of vehicles and select the perfect ride.",
    path: "/vehicles",
  },
  {
    key: "book",
    icon: <CalendarCheck className="w-10 h-10 text-orange-500 mb-3" />,
    title: "Book & Go",
    text: "Confirm your booking and start your journey hassle-free.",
    path: "/add-vehicle",
  },
];

const HowItWorks = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const steps = isLoggedIn
    ? allSteps.filter((s) => s.key !== "signup")
    : allSteps;

  return (
    <section
      id="how-it-works"
      className="py-16 px-10 bg-white dark:bg-gray-900 text-center"
    >
      <h2 className="text-4xl font-bold text-orange-600 mb-4">
        How It Works
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto">
        Renting a vehicle has never been easier. Follow these simple steps to get
        started with your next ride.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.key}
            onClick={() => navigate(step.path)}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition duration-300 hover:-translate-y-1 group"
          >
            <div className="flex justify-center">{step.icon}</div>
            <h3 className="text-xl font-semibold mt-3 mb-2 text-gray-900 dark:text-white group-hover:text-orange-600">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
