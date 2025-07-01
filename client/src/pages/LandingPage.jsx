import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Testimonials from "../sections/Testimonials";
import Footer from "../sections/Footer";

const LandingPage = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <main >
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
