import { Button } from "@/components/ui/button";
import { Play, Heart, Users } from "lucide-react";
import CulturalCarousel from "./CulturalCarousel";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/components/hero-elder.jpg"
          alt="Wise Kenyan elder sharing stories"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-black/85 via-heritage-black/65 to-transparent"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-ubuntu/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-heritage-green/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-ubuntu/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-ubuntu/30">
              <Heart className="h-4 w-4 text-ubuntu" />
              <span className="text-ubuntu font-semibold text-sm">Ubuntu Philosophy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-card mb-4 sm:mb-6 leading-tight">
              Sauti Za Kale
              <span className="bg-gradient-warm bg-clip-text text-transparent block mt-2">
                Africa
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-card/90 mb-8 sm:mb-10 leading-relaxed font-light">
              Stories Rooted in Africa,
              <span className="block text-ubuntu font-medium">Shared with the World</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 sm:mb-14 justify-center lg:justify-start">
              <Button 
                variant="ubuntu" 
                size="lg" 
                className="group w-full sm:w-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg px-8 py-6"
                onClick={() => window.location.href = '/stories'}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Listen to Stories
              </Button>
              <Button 
                variant="elder" 
                size="lg" 
                className="w-full sm:w-auto shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg px-8 py-6"
                onClick={() => window.location.href = '/ubuntu-voices'}
              >
                <Users className="mr-2 h-5 w-5" />
                Meet the Elders
              </Button>
            </div>

            {/* Stats - Enhanced */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 lg:gap-12">
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-1">Stories</div>
                <div className="text-sm sm:text-base text-card/70">Preserved</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-1">Languages</div>
                <div className="text-sm sm:text-base text-card/70">Documented</div>
              </div>
              <div className="text-center lg:text-left group">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-1">Elders</div>
                <div className="text-sm sm:text-base text-card/70">Featured</div>
              </div>
            </div>
          </div>

          {/* Cultural Carousel */}
          <div className="order-1 lg:order-2">
            <CulturalCarousel />
          </div>
        </div>
      </div>

      {/* Floating Ubuntu Symbol - Enhanced */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ubuntu/20 to-heritage-gold/20 backdrop-blur-sm flex items-center justify-center border-2 border-ubuntu/30 shadow-2xl">
          <Heart className="h-10 w-10 text-ubuntu" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
