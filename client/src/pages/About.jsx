// src/pages/About.jsx
function About() {
  return (
    <div className="px-10 py-10 mx-auto dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4 text-center text-orange-600">About RentalApp</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        RentalApp is your trusted platform to rent vehicles anytime, anywhere.
        Whether you're a customer looking for a ride or an admin managing fleet
        bookings, our system is designed to simplify every step of the process.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-300 dark:bg-green-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">For Customers</h3>
          <p>Browse vehicles, make quick bookings, and track your rentals effortlessly.</p>
        </div>
        <div className="bg-blue-300 dark:bg-blue-800 p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">For Admins</h3>
          <p>Manage your vehicles and view all bookings from a single dashboard.</p>
        </div>
      </div>
    </div>
  );
}

export default About;
