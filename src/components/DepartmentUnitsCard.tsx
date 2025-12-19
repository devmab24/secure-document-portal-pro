import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Users, 
  MapPin, 
  User,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDepartmentUnits, DepartmentUnit } from "@/hooks/useDepartmentUnits";

interface UnitItemProps {
  unit: DepartmentUnit;
}

const UnitItem = ({ unit }: UnitItemProps) => {
  const headName = unit.head_user 
    ? `${unit.head_user.first_name || ''} ${unit.head_user.last_name || ''}`.trim() || unit.head_user.email
    : 'Unassigned';

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{unit.name}</h4>
            {unit.code && (
              <Badge variant="outline" className="text-xs">
                {unit.code}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {headName}
            </span>
            {unit.staff_count !== null && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {unit.staff_count} staff
              </span>
            )}
            {unit.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {unit.location}
              </span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8">
    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Building2 className="h-6 w-6 text-muted-foreground" />
    </div>
    <h4 className="font-medium text-muted-foreground">No Units Found</h4>
    <p className="text-sm text-muted-foreground mt-1">
      This department doesn't have any sub-units configured yet.
    </p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-8">
    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="h-6 w-6 text-destructive" />
    </div>
    <h4 className="font-medium text-destructive">Error Loading Units</h4>
    <p className="text-sm text-muted-foreground mt-1">{message}</p>
  </div>
);

interface DepartmentUnitsCardProps {
  showViewAll?: boolean;
  maxUnits?: number;
}

const DepartmentUnitsCard = ({ showViewAll = true, maxUnits = 5 }: DepartmentUnitsCardProps) => {
  const { units, department, loading, error } = useDepartmentUnits();

  const displayUnits = maxUnits ? units.slice(0, maxUnits) : units;
  const hasMore = units.length > maxUnits;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Units
          </CardTitle>
          <CardDescription>
            {department 
              ? `Sub-units and sections under ${department.name}`
              : 'Manage your department sub-units and sections'
            }
          </CardDescription>
        </div>
        {department && (
          <Badge 
            variant="secondary" 
            className="capitalize"
          >
            {department.service_type?.replace('_', '-') || 'Administrative'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : units.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {displayUnits.map((unit) => (
              <UnitItem key={unit.id} unit={unit} />
            ))}
            
            {hasMore && showViewAll && (
              <div className="pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/hod/units">
                    View All {units.length} Units
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentUnitsCard;
