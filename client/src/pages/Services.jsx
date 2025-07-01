// src/pages/Services.jsx
function Services() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Vehicle Rental", desc: "Choose from a wide range of vehicles available for short- and long-term rentals." },
          { title: "Online Booking", desc: "Book your vehicle easily through our streamlined booking system." },
          { title: "Profile Management", desc: "Manage your profile and track your booking history effortlessly." },
          { title: "Admin Dashboard", desc: "Admins can manage vehicles and review all customer bookings." },
          { title: "Secure Payments", desc: "Pay safely with our integrated payment gateway (coming soon)." },
          { title: "24/7 Support", desc: "We’re always here to help you with any rental-related questions." },
        ].map((service, i) => (
          <div key={i} className="bg-white shadow rounded p-4 border-l-4 border-green-600">
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
