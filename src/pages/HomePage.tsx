import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuickAccess from "@/components/QuickAccess";
import UbuntuCorner from "@/components/UbuntuCorner";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <QuickAccess />
      <UbuntuCorner />
      <Footer />
    </div>
  );
};

export default HomePage;