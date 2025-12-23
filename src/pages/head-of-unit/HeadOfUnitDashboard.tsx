import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Users, Inbox, CheckCircle, Clock, 
  Building2, ArrowRight, Upload, Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UnitInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  staff_count: number;
  location: string;
}

const HeadOfUnitDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unitInfo, setUnitInfo] = useState<UnitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingDocuments: 0,
    approvedDocuments: 0,
    inboxCount: 0,
    staffCount: 0
  });

  useEffect(() => {
    const fetchUnitInfo = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch the unit where this user is the head
        const { data: unit, error } = await supabase
          .from('department_units')
          .select('*')
          .eq('head_user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching unit info:', error);
        }

        if (unit) {
          setUnitInfo(unit);
          setStats(prev => ({ ...prev, staffCount: unit.staff_count || 0 }));
        }

        // Fetch inbox count (messages sent to this user)
        const { count: inboxCount } = await supabase
          .from('inter_department_messages')
          .select('*', { count: 'exact', head: true })
          .eq('to_user_id', user.id)
          .is('read_at', null);

        setStats(prev => ({ ...prev, inboxCount: inboxCount || 0 }));

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitInfo();
  }, [user?.id]);

  const quickStats = [
    {
      title: "Pending Documents",
      value: stats.pendingDocuments,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Approved Documents",
      value: stats.approvedDocuments,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Unread Messages",
      value: stats.inboxCount,
      icon: Inbox,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Unit Staff",
      value: stats.staffCount,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  const quickActions = [
    {
      title: "View Inbox",
      description: "Check messages from Director Admin",
      icon: Inbox,
      action: () => navigate('/dashboard/head-of-unit/inbox'),
      variant: "default" as const
    },
    {
      title: "Upload Document",
      description: "Upload a new document",
      icon: Upload,
      action: () => navigate('/dashboard/head-of-unit/upload'),
      variant: "outline" as const
    },
    {
      title: "Send Document",
      description: "Send document to Director or Staff",
      icon: Send,
      action: () => navigate('/dashboard/head-of-unit/send-document'),
      variant: "outline" as const
    },
    {
      title: "View All Documents",
      description: "Browse unit documents",
      icon: FileText,
      action: () => navigate('/dashboard/head-of-unit/documents'),
      variant: "outline" as const
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Head of Unit Dashboard</h1>
            {unitInfo ? (
              <p className="text-muted-foreground">
                {unitInfo.name} ({unitInfo.code})
              </p>
            ) : (
              <p className="text-muted-foreground">
                No unit assigned yet. Please contact Director of Administration.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Unit Info Card */}
      {unitInfo && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{unitInfo.name}</CardTitle>
                <CardDescription>{unitInfo.description}</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {unitInfo.code}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm text-muted-foreground">
              {unitInfo.location && (
                <span>Location: {unitInfo.location}</span>
              )}
              <span>Staff Count: {unitInfo.staff_count || 0}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <action.icon className="h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Workflow</CardTitle>
          <CardDescription>
            How documents flow between you, the Director Admin, and your unit staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Director Admin</p>
              <p className="text-xs text-muted-foreground">Sends documents for review</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">You (Head of Unit)</p>
              <p className="text-xs text-muted-foreground">Review, approve, forward</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Unit Staff</p>
              <p className="text-xs text-muted-foreground">Execute tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadOfUnitDashboard;
