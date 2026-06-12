import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, FileText, CheckCircle2, Clock, Lock, Unlock, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocRow {
  id: string;
  name: string;
  status: string | null;
  document_type: string | null;
  board_restricted: boolean | null;
  approval_required: boolean | null;
  current_approver: string | null;
  confidentiality_level: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const statusVariant = (s: string | null) => {
  switch ((s || "").toUpperCase()) {
    case "APPROVED":
      return "default" as const;
    case "REJECTED":
      return "destructive" as const;
    case "UNDER_REVIEW":
    case "SUBMITTED":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

const BoardMemberDashboard = () => {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyRestricted, setOnlyRestricted] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    let query = supabase
      .from("documents")
      .select("id,name,status,document_type,board_restricted,approval_required,current_approver,confidentiality_level,created_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(500);
    if (onlyRestricted) query = query.eq("board_restricted", true);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Failed to load documents", description: error.message, variant: "destructive" });
    } else {
      setDocs((data as DocRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyRestricted]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => d.name?.toLowerCase().includes(q));
  }, [docs, search]);

  const stats = useMemo(() => {
    const restricted = docs.filter((d) => d.board_restricted).length;
    const pending = docs.filter((d) =>
      ["SUBMITTED", "UNDER_REVIEW"].includes((d.status || "").toUpperCase())
    ).length;
    const approved = docs.filter((d) => (d.status || "").toUpperCase() === "APPROVED").length;
    return { total: docs.length, restricted, pending, approved };
  }, [docs]);

  const toggleRestriction = async (doc: DocRow) => {
    setBusyId(doc.id);
    const next = !doc.board_restricted;
    const { error } = await supabase
      .from("documents")
      .update({ board_restricted: next })
      .eq("id", doc.id);
    setBusyId(null);
    if (error) {
      toast({ title: "Cannot update restriction", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: next ? "Marked as board-restricted" : "Restriction lifted",
      description: doc.name,
    });
    fetchDocs();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Board Member Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Governance oversight of board-restricted correspondence, policies, and approvals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Visible documents" value={stats.total} hint="Within your scope" />
        <StatCard icon={ShieldCheck} label="Board-restricted" value={stats.restricted} hint="Confidential to Board" />
        <StatCard icon={Clock} label="Pending approval" value={stats.pending} hint="Submitted / Under review" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} hint="Finalised" />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Toggle visibility between board-restricted only and your full accessible scope.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-muted/30">
              <Switch
                id="only-restricted"
                checked={onlyRestricted}
                onCheckedChange={setOnlyRestricted}
              />
              <Label htmlFor="only-restricted" className="cursor-pointer text-sm font-medium">
                Show only board-restricted
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              {onlyRestricted
                ? "No board-restricted documents yet. Flag a document below to make it Board-only."
                : "No documents in your scope."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Restriction</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium max-w-xs truncate">{d.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {d.document_type || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(d.status)}>{d.status || "DRAFT"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {d.approval_required ? (
                        d.current_approver ? (
                          <span className="text-amber-600">Awaiting approver</span>
                        ) : (
                          <span className="text-muted-foreground">Required</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">Not required</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {d.board_restricted ? (
                        <Badge className="bg-primary/15 text-primary border border-primary/30">
                          <Lock className="h-3 w-3 mr-1" /> Board-only
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Unlock className="h-3 w-3 mr-1" /> Open
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={d.board_restricted ? "outline" : "default"}
                        disabled={busyId === d.id}
                        onClick={() => toggleRestriction(d)}
                      >
                        {d.board_restricted ? "Lift restriction" : "Mark Board-only"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </CardContent>
  </Card>
);

export default BoardMemberDashboard;
