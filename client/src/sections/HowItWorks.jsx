const steps = [
  { step: "1", title: "Sign Up", text: "Create your free account." },
  { step: "2", title: "Choose Vehicle", text: "Browse and select your ride." },
  { step: "3", title: "Book & Go", text: "Confirm booking and start driving." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-white text-center">
    <h2 className="text-4xl font-bold text-green-700 mb-10">How It Works</h2>
    <div className="flex flex-wrap justify-center gap-8">
      {steps.map((s, i) => (
        <div key={i} className="w-60 p-6 rounded shadow hover:shadow-lg transition">
          <div className="text-3xl font-bold text-green-600 mb-2">{s.step}</div>
          <h3 className="text-xl font-semibold">{s.title}</h3>
          <p className="text-gray-600">{s.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
