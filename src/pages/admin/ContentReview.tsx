import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  content: string;
  content_type: string;
  tribe: string | null;
  status: string;
  review_notes: string | null;
  created_at: string;
  user_id: string;
}

const ContentReview = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await (supabase
        .from('content_submissions' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      setSubmissions((data || []) as Submission[]);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await (supabase
        .from('content_submissions' as any)
        .update({
          status,
          review_notes: reviewNotes[id] || null,
        } as any)
        .eq('id', id) as any);

      if (error) throw error;

      toast.success(`Submission ${status}`);
      loadSubmissions();
      setReviewNotes((prev) => ({ ...prev, [id]: '' }));
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const { error } = await (supabase
        .from('content_submissions' as any)
        .update({ status: 'published' } as any)
        .eq('id', id)
        .eq('status', 'approved') as any);

      if (error) throw error;

      toast.success("Content published successfully!");
      loadSubmissions();
    } catch (error) {
      console.error("Error publishing content:", error);
      toast.error("Failed to publish content");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { icon: Clock, variant: "secondary" as const, label: "Pending" },
      approved: { icon: CheckCircle, variant: "default" as const, label: "Approved" },
      rejected: { icon: XCircle, variant: "destructive" as const, label: "Rejected" },
      published: { icon: CheckCircle, variant: "default" as const, label: "Published", className: "bg-heritage-green" },
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;
    const { icon: Icon, variant, label, className } = statusConfig as any;

    return (
      <Badge variant={variant} className={`flex items-center gap-1 ${className || ''}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Content Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve content submissions
        </p>
      </div>

      <div className="space-y-6">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No submissions yet</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{submission.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{submission.content_type}</span>
                      {submission.tribe && <span>• {submission.tribe}</span>}
                      <span>• {new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{submission.content}</p>
                </div>

                {submission.review_notes && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{submission.review_notes}</p>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="space-y-3 pt-4 border-t">
                    <Textarea
                      placeholder="Add review notes (optional)"
                      value={reviewNotes[submission.id] || ''}
                      onChange={(e) => setReviewNotes((prev) => ({
                        ...prev,
                        [submission.id]: e.target.value,
                      }))}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview(submission.id, 'approved')}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(submission.id, 'rejected')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {submission.status === 'approved' && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => handlePublish(submission.id)}
                      className="w-full bg-heritage-green hover:bg-heritage-green/90"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish to Main Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentReview;
