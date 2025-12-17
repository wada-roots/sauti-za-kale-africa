import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Story {
  id: string;
  title: string;
  content: string;
  tribe: string | null;
  created_at: string;
}

const Stories = () => {
  const { toast } = useToast();
  const [selectedCommunity, setSelectedCommunity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const { data, error } = await (supabase
        .from("content_submissions" as any)
        .select("*")
        .eq("status", "approved")
        .eq("content_type", "story")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      setStories((data || []) as Story[]);
    } catch (error: any) {
      toast({
        title: "Error loading stories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique communities from stories
  const communities = ["All", ...Array.from(new Set(stories.map(s => s.tribe).filter(Boolean)))];


  const filteredStories = stories.filter((story) => {
    const matchesCommunity =
      selectedCommunity === "All" || story.tribe === selectedCommunity;
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCommunity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/components/storytelling-circle.jpg"
            alt="Traditional storytelling circle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-heritage-black/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-card mb-6">
              Stories &{" "}
              <span className="bg-gradient-wisdom bg-clip-text text-transparent block">
                Folklore
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-card/90 mb-8 max-w-3xl mx-auto">
              Traditional tales passed down through generations • Oral
              literature • Community wisdom
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ubuntu"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {communities.map((community) => (
                <Button
                  key={community}
                  variant={selectedCommunity === community ? "ubuntu" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCommunity(community)}
                  className="whitespace-nowrap"
                >
                  {community}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ubuntu" />
            </div>
          ) : filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, index) => (
                <Card
                  key={story.id}
                  className="group hover:shadow-xl transition-all duration-300 border-ubuntu/20 hover-scale animate-fade-in"
                  style={{ "--stagger": index } as React.CSSProperties}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        {story.tribe && (
                          <span className="inline-block px-3 py-1 text-xs font-semibold bg-ubuntu/20 text-ubuntu rounded-full">
                            {story.tribe}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(story.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-heritage-brown mb-2 story-link">
                        {story.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-4">
                        {story.content}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <Button
                        variant="ubuntu"
                        size="sm"
                        className="w-full group-hover:scale-105 transition-transform"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Read Full Story
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm || selectedCommunity !== "All" 
                  ? "No stories found matching your criteria." 
                  : "No stories have been published yet."}
              </p>
              <p className="text-sm text-muted-foreground">
                Share your cultural heritage by submitting a story!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;
