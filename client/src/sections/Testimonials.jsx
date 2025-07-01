const Testimonials = () => (
  <section id="testimonials" className="py-20 bg-gray-100 text-center">
    <h2 className="text-4xl font-bold mb-10 text-green-700">What Users Say</h2>
    <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded shadow w-80">
        <p>"Booking was super easy and the car was in great condition!"</p>
        <div className="mt-4 font-semibold">– Rahul</div>
      </div>
      <div className="bg-white p-6 rounded shadow w-80">
        <p>"Great pricing and amazing support during my trip."</p>
        <div className="mt-4 font-semibold">– Priya</div>
      </div>
    </div>
  </section>
);

export default Testimonials;
