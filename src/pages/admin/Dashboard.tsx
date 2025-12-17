import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total submissions
      const { count: totalSubmissions } = await (supabase
        .from('content_submissions' as any)
        .select('*', { count: 'exact', head: true }) as any);

      // Get pending submissions
      const { count: pendingSubmissions } = await (supabase
        .from('content_submissions' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending') as any);

      // Get approved submissions
      const { count: approvedSubmissions } = await (supabase
        .from('content_submissions' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved') as any);

      // Get total users
      const { count: totalUsers } = await (supabase
        .from('user_roles' as any)
        .select('user_id', { count: 'exact', head: true }) as any);

      setStats({
        totalSubmissions: totalSubmissions || 0,
        pendingSubmissions: pendingSubmissions || 0,
        approvedSubmissions: approvedSubmissions || 0,
        totalUsers: totalUsers || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Submissions",
      value: stats.totalSubmissions,
      icon: FileText,
      description: "All content submissions",
    },
    {
      title: "Pending Review",
      value: stats.pendingSubmissions,
      icon: Clock,
      description: "Awaiting approval",
    },
    {
      title: "Approved",
      value: stats.approvedSubmissions,
      icon: CheckCircle,
      description: "Published content",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Sauti Za Kale Afrika admin panel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
