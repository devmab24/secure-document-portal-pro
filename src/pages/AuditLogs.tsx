
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockAuditLogs, mockUsers, mockDocuments } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Search, FileText, Eye, FilePlus, FileEdit, Trash2, CheckCircle, XCircle, Download } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AuditLogs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  
  // Get user by ID helper
  const getUserById = (userId: string) => {
    const foundUser = mockUsers.find(u => u.id === userId);
    return foundUser ? `${foundUser.firstName} ${foundUser.lastName}` : "Unknown User";
  };
  
  // Get document by ID helper
  const getDocumentById = (documentId: string) => {
    const foundDoc = mockDocuments.find(d => d.id === documentId);
    return foundDoc ? foundDoc.name : "Unknown Document";
  };

  // Filter logs based on user role and search criteria
  const filteredLogs = useMemo(() => {
    if (!user) return [];
    
    // Filter logs based on user role
    const accessibleLogs = mockAuditLogs.filter(log => {
      if (user.role === UserRole.CMD || user.role === UserRole.ADMIN) {
        // CMD and Admin can see all logs
        return true;
      } else if (user.role === UserRole.HOD) {
        // HOD can only see logs related to their department
        const relatedDoc = mockDocuments.find(doc => doc.id === log.documentId);
        return relatedDoc && relatedDoc.department === user.department;
      } else {
        // Staff can only see logs for documents they created or that are assigned to them
        const relatedDoc = mockDocuments.find(doc => doc.id === log.documentId);
        return relatedDoc && (
          relatedDoc.uploadedBy === user.id || 
          (relatedDoc.assignedTo && relatedDoc.assignedTo.includes(user.id))
        );
      }
    });
    
    // Apply search and filter
    return accessibleLogs.filter(log => {
      // Filter by action
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      
      // Search in user name, document name, or details
      const userName = getUserById(log.userId).toLowerCase();
      const documentName = getDocumentById(log.documentId).toLowerCase();
      const details = (log.details || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      
      const matchesSearch = search === "" || 
        userName.includes(search) || 
        documentName.includes(search) || 
        details.includes(search);
      
      return matchesAction && matchesSearch;
    });
  }, [user, searchTerm, actionFilter]);

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <FilePlus className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      case 'update': return <FileEdit className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'approve': return <CheckCircle className="h-4 w-4" />;
      case 'reject': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Get action badge color
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create': 
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case 'view': 
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case 'update': 
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
      case 'delete': 
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case 'download': 
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case 'approve': 
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
      case 'reject': 
        return "bg-rose-100 text-rose-800 hover:bg-rose-100/80";
      default: 
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Activity Logs
              </CardTitle>
              <CardDescription>
                Track document activities and user actions
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(log.timestamp, "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>{getUserById(log.userId)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {getDocumentById(log.documentId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getActionBadgeColor(log.action)}>
                          <span className="flex items-center">
                            {getActionIcon(log.action)}
                            <span className="ml-1 capitalize">{log.action}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No audit logs found matching your criteria.
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

export default AuditLogs;
