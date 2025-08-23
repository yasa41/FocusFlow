import React, { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Chat from "../components/landing/Chat";
import HowItWorks from "../components/landing/HowItWorks";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const StudySyncLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <div className="pt-20">
        <Hero />
        <Features />
        <Chat />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};


export default StudySyncLanding;
