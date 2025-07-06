import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Testimonials from "../sections/Testimonials";
import Footer from "../sections/Footer";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";

const LandingPage = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <About />
        <Services />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
