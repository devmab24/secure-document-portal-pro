
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";
import { UserRole, Department } from "@/lib/types";
import { Search, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
// import { currentUser } from "@/lib/currentUser"; // Assuming this is how you get the current user

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();
  
  // Filter users based on search term
  const filteredUsers = mockUsers.filter((user) => {
  const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
  const email = user.email.toLowerCase();
  const department = user.department.toLowerCase();
  const role = user.role.toLowerCase();
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    fullName.includes(search) ||
    email.includes(search) ||
    department.includes(search) ||
    role.includes(search);

  // CMD and Admins can see all users
  if (
    currentUser?.role === UserRole.CMD ||
    currentUser?.role === UserRole.ADMIN
  ) {
    return matchesSearch;
  }

  // HODs only see staff in their department
  if (
    currentUser?.role === UserRole.HOD &&
    user.role === UserRole.STAFF &&
    user.department === currentUser.department
  ) {
    return matchesSearch;
  }

  // Default: hide users from others (like staff)
  return false;
});

  // Map role to badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.CMD:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case UserRole.HOD:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case UserRole.STAFF:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage hospital staff and their access levels
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{getUserInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
