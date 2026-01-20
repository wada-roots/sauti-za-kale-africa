import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Leaf, MapPin, Shield, Mic } from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "Stories & Folklore",
    description: "Traditional tales and oral literature",
    href: "/stories",
    color: "text-heritage-green",
    bgColor: "bg-heritage-green/10"
  },
  {
    icon: Mic,
    title: "Poetry & Songs",
    description: "Traditional poems and songs",
    href: "/poetry",
    color: "text-ubuntu",
    bgColor: "bg-ubuntu/10"
  },
  {
    icon: Leaf,
    title: "Medicinal Plants",
    description: "Traditional healing knowledge",
    href: "/medicinal-plants",
    color: "text-heritage-green",
    bgColor: "bg-heritage-green/10"
  },
  {
    icon: MapPin,
    title: "Heritage Places",
    description: "Sacred sites and their stories",
    href: "/heritage-map",
    color: "text-heritage-red",
    bgColor: "bg-heritage-red/10"
  },
  {
    icon: Shield,
    title: "Heroes & Fighters",
    description: "Freedom fighters and local heroes",
    href: "/heroes",
    color: "text-heritage-brown",
    bgColor: "bg-heritage-brown/10"
  },
  {
    icon: Users,
    title: "Ubuntu Voices",
    description: "Elder interviews and wisdom",
    href: "/ubuntu-voices",
    color: "text-ubuntu",
    bgColor: "bg-ubuntu/10"
  }
];

const QuickAccess = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-heritage-brown mb-4">
            Explore Our Heritage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the rich tapestry of Kenyan culture through stories, wisdom, and traditions
            passed down through generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-ubuntu/30">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${category.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-heritage-brown mb-2">
                    {category.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group-hover:bg-ubuntu/10"
                      onClick={() => window.location.href = category.href}
                    >
                      Explore →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="heritage" size="lg">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;