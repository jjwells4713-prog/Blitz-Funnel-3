"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import WhoItsFor from "@/components/WhoItsFor";
import WhatYouGet from "@/components/WhatYouGet";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { captureUTMsFromURL } from "@/lib/storage";

export default function LandingPage() {
  // Capture UTMs on first landing. sessionStorage persists them through the funnel.
  useEffect(() => {
    captureUTMsFromURL();
  }, []);

  return (
    <main className="relative">
      <Hero />
      <WhoItsFor />
      <WhatYouGet />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
