import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PublishedContent from "@/components/PublishedContent";
import QuickAccess from "@/components/QuickAccess";
import UbuntuCorner from "@/components/UbuntuCorner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PublishedContent />
      <QuickAccess />
      <UbuntuCorner />
      <Footer />
    </div>
  );
};

export default Index;
