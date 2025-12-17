import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Comment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

interface ContentCommentsProps {
  contentId: string;
  user: User | null;
}

const ContentComments = ({ contentId, user }: ContentCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contentId) {
      loadComments();
    }
  }, [contentId]);

  const loadComments = async () => {
    try {
      const { data, error } = await (supabase
        .from('content_comments' as any)
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      
      // Fetch profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((c: any) => c.user_id))];
        const { data: profiles } = await (supabase
          .from('profiles' as any)
          .select('user_id, full_name')
          .in('user_id', userIds) as any);
        
        const commentsWithProfiles = data.map((comment: any) => ({
          ...comment,
          profiles: profiles?.find((p: any) => p.user_id === comment.user_id) || null
        }));
        
        setComments(commentsWithProfiles as Comment[]);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await (supabase
        .from('content_comments' as any)
        .insert({
          content_id: contentId,
          user_id: user.id,
          comment: newComment.trim(),
        } as any) as any);

      if (error) throw error;

      toast.success("Comment added!");
      setNewComment("");
      loadComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await (supabase
        .from('content_comments' as any)
        .delete()
        .eq('id', commentId) as any);

      if (error) throw error;

      toast.success("Comment deleted");
      loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5" />
        <span>Author Discussions ({comments.length})</span>
      </div>

      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts or connect with other authors..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-heritage-red text-white">
                      {(comment.profiles?.full_name || 'A')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {comment.profiles?.full_name || 'Anonymous Author'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {user && user.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentComments;
