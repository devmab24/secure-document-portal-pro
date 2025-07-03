
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock/users';
import { Settings, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RoleSwitcher: React.FC = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const availableRoles = [
    { role: UserRole.CMD, label: 'CMD', color: 'bg-red-100 text-red-800' },
    { role: UserRole.HOD, label: 'HOD', color: 'bg-blue-100 text-blue-800' },
    { role: UserRole.STAFF, label: 'Staff', color: 'bg-green-100 text-green-800' },
    { role: UserRole.SUPER_ADMIN, label: 'Super Admin', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleRoleSwitch = async () => {
    if (!selectedRole) return;

    // Find a user with the selected role
    const targetUser = mockUsers.find(u => u.role === selectedRole);
    if (!targetUser) {
      toast({
        title: "Error",
        description: "No user found with the selected role",
        variant: "destructive"
      });
      return;
    }

    // Simulate login with the target user
    const success = await login(targetUser.email, 'password');
    if (success) {
      toast({
        title: "Role Switched",
        description: `Successfully switched to ${selectedRole} role as ${targetUser.firstName} ${targetUser.lastName}`,
      });
      setIsExpanded(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to switch role",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="shadow-lg border-2 border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Dev Tools
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Current:</span>
                <Badge className={availableRoles.find(r => r.role === user.role)?.color}>
                  {user.role}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Switch to:</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((roleOption) => (
                      <SelectItem key={roleOption.role} value={roleOption.role}>
                        <div className="flex items-center gap-2">
                          <Badge className={roleOption.color} variant="secondary">
                            {roleOption.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleRoleSwitch}
                disabled={!selectedRole || selectedRole === user.role}
                className="w-full"
                size="sm"
              >
                Switch Role
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
