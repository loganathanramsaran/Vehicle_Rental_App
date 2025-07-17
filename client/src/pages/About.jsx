function About() {
  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 mx-auto">
      <div className="px-10 min-h-screen mx-auto max-w-7xl ">
        <h1 className="text-3xl font-bold mb-4 text-center text-orange-600">
          About RentalApp
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          RentalApp is your trusted platform to rent vehicles anytime, anywhere.
          Whether you're a customer looking for a ride or an admin managing
          fleet bookings, our system is designed to simplify every step of the
          process.
        </p>
        <div className="flex flex-col gap-8 max-w-2xl mx-auto mt-10">
          <div className="bg-green-300 dark:bg-green-800 p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">For Customers</h3>
            <p>
              Browse vehicles, make quick bookings, and track your rentals
              effortlessly.
            </p>
          </div>
          <div className="bg-blue-300 dark:bg-blue-800 p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">For Admins</h3>
            <p>
              Manage your vehicles and view all bookings from a single
              dashboard.
            </p>
          </div>
          <div className="bg-gray-300 dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">More Features</h3>
            <p>
              More features add will be later, site is under construction
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
