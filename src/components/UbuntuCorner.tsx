import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";

const UbuntuCorner = () => {
  return (
    <section className="py-16 bg-card relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="/images/components/village-landscape.jpg"
          alt="Village landscape"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ubuntu/10 px-4 py-2 rounded-full mb-4">
            <Heart className="h-5 w-5 text-ubuntu" />
            <span className="text-ubuntu font-semibold">Ubuntu Philosophy</span>
          </div>
          
          <h2 className="text-4xl font-bold text-heritage-brown mb-4">
            Voices of Wisdom
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            "I am because we are" - Listen to centenarians share life lessons, 
            cultural practices, and memories that span over a century of African heritage.
          </p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">
            Elder spotlights coming soon. Check back for wisdom from our community elders.
          </p>
          <Button variant="elder" size="lg" onClick={() => window.location.href = '/ubuntu-voices'}>
            <Users className="mr-2 h-5 w-5" />
            Explore Ubuntu Voices
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UbuntuCorner;
