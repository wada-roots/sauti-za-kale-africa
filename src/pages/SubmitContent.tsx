import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SubmitContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "",
    tribe: "",
  });

  const contentTypes = [
    { value: "story", label: "Story / Folklore" },
    { value: "poetry", label: "Poetry / Song" },
    { value: "article", label: "Article" },
    { value: "oral_history", label: "Oral History" },
    { value: "medicinal_knowledge", label: "Medicinal Knowledge" },
  ];

  const tribes = [
    "Kikuyu", "Luhya", "Kalenjin", "Luo", "Kamba", "Kisii", "Meru", 
    "Mijikenda", "Maasai", "Turkana", "Embu", "Taita", "Somali"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit content.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const { error } = await (supabase
        .from("content_submissions" as any)
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            content: formData.content,
            content_type: formData.content_type,
            tribe: formData.tribe || null,
            status: "pending",
          },
        ] as any) as any);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your content has been submitted for review.",
      });

      setFormData({
        title: "",
        content: "",
        content_type: "",
        tribe: "",
      });

      navigate("/authors-dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Share Your <span className="bg-gradient-wisdom bg-clip-text text-transparent">Story</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Help preserve our cultural heritage by sharing your knowledge, stories, and wisdom.
            </p>
          </div>

          <Card className="shadow-lg border-ubuntu/20">
            <CardHeader>
              <CardTitle className="text-2xl text-heritage-brown">Submit Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content_type">Content Type *</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content_type: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tribe">Community / Tribe (Optional)</Label>
                  <Select
                    value={formData.tribe}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tribe: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tribe" />
                    </SelectTrigger>
                    <SelectContent>
                      {tribes.map((tribe) => (
                        <SelectItem key={tribe} value={tribe}>
                          {tribe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your story, knowledge, or cultural wisdom..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={12}
                    required
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="heritage"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/authors-dashboard")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubmitContent;
