import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Mic, Music, Heart, Filter, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PoetryItem {
  id: string;
  title: string;
  content: string;
  tribe: string | null;
  created_at: string;
}

const Poetry = () => {
  const { toast } = useToast();
  const [selectedCommunity, setSelectedCommunity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [poetryItems, setPoetryItems] = useState<PoetryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPoetry();
  }, []);

  const loadPoetry = async () => {
    try {
      const { data, error } = await (supabase
        .from("content_submissions" as any)
        .select("*")
        .eq("status", "approved")
        .eq("content_type", "poetry")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      setPoetryItems((data || []) as PoetryItem[]);
    } catch (error: any) {
      toast({
        title: "Error loading poetry",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const communities = ["All", ...Array.from(new Set(poetryItems.map(p => p.tribe).filter(Boolean)))];

  const filteredPoetry = poetryItems.filter(item => {
    const matchesCommunity = selectedCommunity === "All" || item.tribe === selectedCommunity;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCommunity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/components/poetry-music.jpg"
            alt="Traditional poetry and music"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-heritage-black/60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-ubuntu/20 px-4 py-2 rounded-full mb-6">
              <Music className="h-5 w-5 text-ubuntu animate-pulse" />
              <span className="text-ubuntu font-semibold">Oral Literature</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-card mb-6">
              Poetry &
              <span className="bg-gradient-wisdom bg-clip-text text-transparent block">
                Songs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-card/90 mb-8 max-w-3xl mx-auto">
              Traditional verses • Musical heritage • Rhythmic stories • Cultural expressions
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search poetry and songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ubuntu"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {communities.map((community) => (
                <Button
                  key={community}
                  variant={selectedCommunity === community ? "ubuntu" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCommunity(community)}
                  className="text-xs"
                >
                  {community}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Poetry Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ubuntu" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPoetry.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-ubuntu/20 hover-scale animate-fade-in"
                  style={{"--stagger": index} as React.CSSProperties}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        {item.tribe && (
                          <span className="inline-block px-3 py-1 text-xs font-semibold bg-heritage-green/20 text-heritage-green rounded-full">
                            {item.tribe}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-heritage-brown mb-2">
                        {item.title}
                      </h3>

                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm italic text-heritage-brown leading-relaxed whitespace-pre-line line-clamp-6">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <Button variant="ubuntu" size="sm" className="w-full group-hover:scale-105 transition-transform">
                        <Play className="mr-1 h-3 w-3" />
                        Read Full Poem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredPoetry.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm || selectedCommunity !== "All" 
                  ? "No poetry found matching your criteria." 
                  : "No poetry has been published yet."}
              </p>
              <p className="text-sm text-muted-foreground">
                Share your cultural poetry and songs!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Cultural Expression Section */}
      <section className="py-16 bg-gradient-earth">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-heritage-brown mb-4">
            The Rhythm of Our Heritage
          </h2>
          <p className="text-lg text-heritage-brown/80 mb-8 max-w-3xl mx-auto">
            Poetry and song are the heartbeat of African culture. Through rhythm, melody, and verse, 
            our ancestors passed down wisdom, celebrated life, and preserved our collective memory. 
            Each performance connects us to generations past and future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="heritage" size="lg" onClick={() => window.location.href = "/submit-content"}>
              <Music className="mr-2 h-5 w-5" />
              Submit Your Poetry
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Poetry;