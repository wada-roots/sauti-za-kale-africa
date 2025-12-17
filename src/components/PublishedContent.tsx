import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenTool, FileText } from "lucide-react";

interface Content {
  id: string;
  title: string;
  content: string;
  content_type: string;
  tribe: string | null;
  created_at: string;
}

const PublishedContent = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishedContent();
  }, []);

  const loadPublishedContent = async () => {
    try {
      const { data, error } = await (supabase
        .from('content_submissions' as any)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6) as any);

      if (error) throw error;
      setContent((data || []) as Content[]);
    } catch (error) {
      console.error("Error loading published content:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'story': return BookOpen;
      case 'poem': return PenTool;
      case 'article': return FileText;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading latest content...</div>
        </div>
      </section>
    );
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-earth">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest Cultural Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the rich tapestry of Kenyan heritage through stories, poetry, and articles shared by our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const Icon = getIcon(item.content_type);
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-6 w-6 text-heritage-red" />
                    <Badge variant="secondary" className="capitalize">
                      {item.content_type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{item.title}</CardTitle>
                  {item.tribe && (
                    <p className="text-sm text-muted-foreground capitalize">{item.tribe}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-4 mb-4">
                    {item.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Published {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PublishedContent;
