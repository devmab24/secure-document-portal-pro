import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, Users, MapPin, FileText, 
  Clock, CheckCircle, AlertCircle
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
  is_active: boolean;
  created_at: string;
  department: {
    name: string;
    code: string;
  };
}

const HeadOfUnitMyUnit = () => {
  const { user } = useAuth();
  const [unitInfo, setUnitInfo] = useState<UnitInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnitInfo = async () => {
      if (!user?.id) return;
      
      try {
        const { data: unit, error } = await supabase
          .from('department_units')
          .select(`
            *,
            department:departments!department_units_department_id_fkey(
              name,
              code
            )
          `)
          .eq('head_user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching unit info:', error);
        }

        if (unit) {
          setUnitInfo(unit as unknown as UnitInfo);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitInfo();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!unitInfo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Unit</h1>
            <p className="text-muted-foreground">View and manage your assigned unit</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-semibold mb-2">No Unit Assigned</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't been assigned to any unit yet. Please contact the Director of Administration
              to get assigned to a unit.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Unit</h1>
          <p className="text-muted-foreground">View and manage your assigned unit</p>
        </div>
      </div>

      {/* Unit Overview Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{unitInfo.name}</CardTitle>
                <Badge variant="outline" className="text-primary border-primary">
                  {unitInfo.code}
                </Badge>
                {unitInfo.is_active ? (
                  <Badge className="bg-emerald-500">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
              <CardDescription className="text-base">
                {unitInfo.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent Department</p>
                <p className="font-medium">{unitInfo.department?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Staff Count</p>
                <p className="font-medium">{unitInfo.staff_count || 0} members</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 bg-emerald-500/10 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{unitInfo.location || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Responsibilities</CardTitle>
          <CardDescription>
            Key areas and functions managed by this unit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unitInfo.description.split(',').map((responsibility, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span>{responsibility.trim()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{unitInfo.staff_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeadOfUnitMyUnit;
