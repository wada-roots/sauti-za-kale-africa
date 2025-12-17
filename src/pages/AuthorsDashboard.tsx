import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { PenTool, BookOpen, FileText, LogOut, Home, Eye, Clock, CheckCircle, XCircle, Plus, MessageSquare, User as UserIcon } from "lucide-react";
import ContentComments from "@/components/ContentComments";

interface ContentSubmission {
  id: string;
  title: string;
  content: string;
  content_type: string;
  tribe?: string | null;
  status: string;
  review_notes?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const AuthorsDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("");
  const [tribe, setTribe] = useState("");
  const [submissions, setSubmissions] = useState<ContentSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadSubmissions();
        } else {
          setUser(null);
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadSubmissions();
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data, error } = await (supabase
        .from('content_submissions' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);

      if (error) {
        console.error('Error loading submissions:', error);
        toast.error("Failed to load your submissions");
      } else {
        setSubmissions((data || []) as ContentSubmission[]);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error("Failed to load your submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentType || !user) {
      toast.error("Please select a content type");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await (supabase
        .from('content_submissions' as any)
        .insert({
          user_id: user.id,
          title,
          content,
          content_type: contentType,
          tribe: tribe || null,
        } as any) as any);

      if (error) {
        console.error('Error submitting content:', error);
        toast.error("Failed to submit content");
      } else {
        toast.success("Your submission has been sent for review!");
        
        // Reset form
        setTitle("");
        setContent("");
        setContentType("");
        setTribe("");
        
        // Reload submissions
        loadSubmissions();
      }
    } catch (error) {
      console.error('Error submitting content:', error);
      toast.error("Failed to submit content");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/images/branding/kenyan-flag.png"
                alt="Kenyan Flag"
                className="w-10 h-7 object-cover rounded-sm shadow-md border border-border"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Authors Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.user_metadata?.full_name || user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Share Your Cultural Heritage</h2>
            <p className="text-muted-foreground">
              Contribute to preserving Kenya's rich cultural heritage by sharing your stories, poems, and articles.
              All submissions are reviewed before being published.
            </p>
          </div>

          <Tabs defaultValue="submit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Content</TabsTrigger>
              <TabsTrigger value="submissions">My Submissions</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submit">
              <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Submit Content
              </CardTitle>
              <CardDescription>
                Share your cultural knowledge with the Ubuntu Voices community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="story">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Traditional Story
                          </div>
                        </SelectItem>
                        <SelectItem value="poem">
                          <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4" />
                            Poetry
                          </div>
                        </SelectItem>
                        <SelectItem value="article">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Cultural Article
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tribe">Cultural Origin (Optional)</Label>
                    <Select value={tribe} onValueChange={setTribe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tribe/community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kikuyu">Kikuyu</SelectItem>
                        <SelectItem value="luo">Luo</SelectItem>
                        <SelectItem value="luhya">Luhya</SelectItem>
                        <SelectItem value="kalenjin">Kalenjin</SelectItem>
                        <SelectItem value="maasai">Maasai</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter the title of your content"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your story, poem, or article here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={12}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Write in English, Kiswahili, or your local language
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Under Review</Badge>
                    <span className="text-sm text-muted-foreground">
                      Content will be reviewed before publication
                    </span>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
              </Card>

              {/* Guidelines Section */}
              <Card className="mt-6">
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Content Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Original content or traditional stories with proper attribution</li>
                    <li>Culturally respectful and appropriate</li>
                    <li>Well-written and engaging</li>
                    <li>Relevant to Kenyan heritage and culture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Review Process:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Content reviewed within 2 business days</li>
                    <li>Feedback provided if changes needed</li>
                    <li>Published content credited to author</li>
                    <li>Community engagement encouraged</li>
                  </ul>
                </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  My Submissions
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSubmissions ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading your submissions...</div>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">No submissions yet</div>
                    <p className="text-sm text-muted-foreground">
                      Start by submitting your first story, poem, or article using the Submit Content tab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{submission.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {submission.content_type === 'story' && <BookOpen className="h-4 w-4" />}
                              {submission.content_type === 'poem' && <PenTool className="h-4 w-4" />}
                              {submission.content_type === 'article' && <FileText className="h-4 w-4" />}
                              <span className="capitalize">{submission.content_type}</span>
                              {submission.tribe && <span>• {submission.tribe}</span>}
                              <span>• {new Date(submission.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {submission.status === 'reviewing' && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Under Review
                              </Badge>
                            )}
                            {submission.status === 'approved' && (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Approved
                              </Badge>
                            )}
                            {submission.status === 'published' && (
                              <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Published
                              </Badge>
                            )}
                            {submission.status === 'rejected' && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Rejected
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {submission.review_notes && (
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-sm font-medium text-foreground mb-1">Review Notes:</p>
                            <p className="text-sm text-muted-foreground">{submission.review_notes}</p>
                          </div>
                        )}
                        
                        <div className="text-sm text-muted-foreground">
                          <strong>Preview:</strong> {submission.content.substring(0, 150)}
                          {submission.content.length > 150 && "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Connect with Other Authors
                </CardTitle>
                <CardDescription>
                  View and discuss published content from fellow authors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSubmissions ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading community content...</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {submissions
                      .filter(s => s.status === 'published')
                      .map((submission) => (
                        <div key={submission.id} className="border border-border rounded-lg p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <h3 className="font-semibold text-lg text-foreground">{submission.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {submission.content_type === 'story' && <BookOpen className="h-4 w-4" />}
                                {submission.content_type === 'poem' && <PenTool className="h-4 w-4" />}
                                {submission.content_type === 'article' && <FileText className="h-4 w-4" />}
                                <span className="capitalize">{submission.content_type}</span>
                                {submission.tribe && <span>• {submission.tribe}</span>}
                                <span>• {new Date(submission.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge className="bg-heritage-green">Published</Badge>
                          </div>
                          
                          <div className="text-sm text-foreground/80">
                            <p className="line-clamp-3">{submission.content}</p>
                          </div>

                          <ContentComments contentId={submission.id} user={user} />
                        </div>
                      ))}
                    
                    {submissions.filter(s => s.status === 'published').length === 0 && (
                      <div className="text-center py-8">
                        <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-2">No published content yet</p>
                        <p className="text-sm text-muted-foreground">
                          Published stories will appear here for community discussion
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
    
  );
};

export default AuthorsDashboard;