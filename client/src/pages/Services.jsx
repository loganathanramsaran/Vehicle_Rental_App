import { Section } from "lucide-react";

// src/pages/Services.jsx
function Services() {
  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen mx-auto">
      <div className=" max-w-7xl mx-auto px-10  dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Our Services
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto pt-10 ">
          {[
            {
              title: "Vehicle Rental",
              desc: "Choose from a wide range of vehicles available for short- and long-term rentals.",
            },
            {
              title: "Online Booking",
              desc: "Book your vehicle easily through our streamlined booking system.",
            },
            {
              title: "Profile Management",
              desc: "Manage your profile and track your booking history effortlessly.",
            },
            {
              title: "Admin Dashboard",
              desc: "Admins can manage vehicles and review all customer bookings.",
            },
            {
              title: "Secure Payments",
              desc: "Pay safely with our integrated payment gateway (coming soon).",
            },
            {
              title: "24/7 Support",
              desc: "We’re always here to help you with any rental-related questions.",
            },
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white shadow rounded p-4 border-l-4 border-green-600 dark:bg-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
