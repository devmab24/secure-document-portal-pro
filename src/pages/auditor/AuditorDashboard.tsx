import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ScrollText, FileSearch, ShieldAlert, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface RecentEvent {
  id: string;
  action: string;
  target_type: string | null;
  created_at: string;
}

const AuditorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [auditCount, setAuditCount] = useState(0);
  const [accessCount, setAccessCount] = useState(0);
  const [denialCount, setDenialCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [recent, setRecent] = useState<RecentEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [audit, access, denials, docs, recentEvents] = await Promise.all([
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
        supabase.from("document_access_log").select("id", { count: "exact", head: true }),
        supabase
          .from("audit_logs")
          .select("id", { count: "exact", head: true })
          .eq("action", "storage.denied")
          .gte("created_at", since),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase
          .from("audit_logs")
          .select("id, action, target_type, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);
      if (cancelled) return;
      setAuditCount(audit.count ?? 0);
      setAccessCount(access.count ?? 0);
      setDenialCount(denials.count ?? 0);
      setDocCount(docs.count ?? 0);
      setRecent(recentEvents.data ?? []);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Audit Events", value: auditCount, icon: ScrollText, to: "/dashboard/auditor/audit-logs" },
    { label: "Document Access Events", value: accessCount, icon: FileSearch, to: "/dashboard/auditor/access-logs" },
    { label: "Denied Access (24h)", value: denialCount, icon: ShieldAlert, to: "/dashboard/auditor/security-alerts" },
    { label: "Documents in System", value: docCount, icon: FileText, to: "/dashboard/auditor/documents" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Internal Audit Dashboard</h1>
        <p className="text-muted-foreground">
          Read-only oversight of system activity, document access, and security events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{s.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
          <CardDescription>Latest activity recorded across the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit events recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{e.action}</Badge>
                    {e.target_type && (
                      <span className="text-sm text-muted-foreground">{e.target_type}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(e.created_at), "PPp")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditorDashboard;
