import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Building2,
  Library,
  UserCheck,
  Megaphone,
  HeartPulse,
  FolderOpen,
  CreditCard,
  Heart,
  Monitor,
  GraduationCap,
  Scale,
  BarChart3,
  Wallet,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Users,
  ExternalLink,
} from "lucide-react";
import { AdminUnit } from "@/lib/admin-units";
import { Link } from "react-router-dom";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Library,
  UserCheck,
  Megaphone,
  HeartPulse,
  FolderOpen,
  CreditCard,
  Heart,
  Monitor,
  GraduationCap,
  Scale,
  BarChart3,
  Wallet,
  ShieldCheck,
};

interface AdminUnitCardProps {
  unit: AdminUnit;
  isCompact?: boolean;
}

const AdminUnitCard = ({ unit, isCompact = false }: AdminUnitCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconMap[unit.icon] || Building2;
  const hasSubUnits = unit.subUnits && unit.subUnits.length > 0;

  if (isCompact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{unit.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {unit.code}
                </Badge>
                {hasSubUnits && (
                  <span className="text-xs text-muted-foreground">
                    {unit.subUnits!.length} sub-units
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-base leading-tight">
                  {unit.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {unit.description}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{unit.code}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {hasSubUnits && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{unit.subUnits!.length} sub-units</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unit.id === "registry" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/registry">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Dashboard
                  </Link>
                </Button>
              )}
              {hasSubUnits && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="ml-1">
                      {isOpen ? "Hide" : "Show"} Sub-units
                    </span>
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
          </div>

          {hasSubUnits && (
            <CollapsibleContent className="mt-4">
              <div className="border-t pt-4">
                <div className="grid gap-2">
                  {unit.subUnits!.map((subUnit) => (
                    <div
                      key={subUnit.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{subUnit.name}</p>
                        {subUnit.description && (
                          <p className="text-xs text-muted-foreground">
                            {subUnit.description}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          )}
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default AdminUnitCard;
