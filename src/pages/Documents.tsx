
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Department, Document as DocumentType, DocumentStatus, DocumentType as DocType, UserRole } from "@/lib/types";
import { mockDocuments } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, File, Upload, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Documents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter documents based on user role and department
  const accessibleDocuments = useMemo(() => {
    if (!user) return [];
    
    return mockDocuments.filter(doc => {
      if (user.role === UserRole.CMD || user.role === UserRole.ADMIN) {
        // CMD and Admin can see all documents
        return true;
      } else if (user.role === UserRole.HOD) {
        // HOD can see documents from their department and documents assigned to them
        return (
          doc.department === user.department ||
          doc.assignedTo?.includes(user.id) ||
          doc.uploadedBy === user.id
        );
      } else {
        // Staff can only see documents they uploaded, documents from their department that were approved,
        // or documents specifically assigned to them
        return (
          doc.uploadedBy === user.id ||
          (doc.department === user.department && doc.status === DocumentStatus.APPROVED) ||
          doc.assignedTo?.includes(user.id)
        );
      }
    });
  }, [user]);

  // Apply filters and search
  const filteredDocuments = useMemo(() => {
    return accessibleDocuments.filter(doc => {
      // Apply search term
      const matchesSearch = 
        searchTerm === "" ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply department filter
      const matchesDepartment = 
        departmentFilter === "all" || 
        doc.department === departmentFilter;
      
      // Apply status filter
      const matchesStatus = 
        statusFilter === "all" || 
        doc.status === statusFilter;
        
      // Apply type filter
      const matchesType = 
        typeFilter === "all" || 
        doc.type === typeFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesType;
    });
  }, [accessibleDocuments, searchTerm, departmentFilter, statusFilter, typeFilter]);

  // Get unique departments from documents
  const departments = useMemo(() => {
    const deptSet = new Set<Department>();
    accessibleDocuments.forEach(doc => deptSet.add(doc.department));
    return Array.from(deptSet);
  }, [accessibleDocuments]);

  // Get statuses from enum
  const statuses = Object.values(DocumentStatus);
  
  // Get document types from enum
  const documentTypes = Object.values(DocType);

  // Get status badge variant
  const getStatusBadgeVariant = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return "outline";
      case DocumentStatus.DRAFT:
        return "secondary";
      case DocumentStatus.REJECTED:
        return "destructive";
      case DocumentStatus.SUBMITTED:
      case DocumentStatus.UNDER_REVIEW:
        return "default";
      case DocumentStatus.ARCHIVED:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <Button className="bg-hospital-600 hover:bg-hospital-700" onClick={() => navigate("/upload")}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="relative md:col-span-2 lg:col-span-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by name, description or tags..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Department</SelectLabel>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilter === "all"}
              onCheckedChange={() => setStatusFilter("all")}
            >
              All Statuses
            </DropdownMenuCheckboxItem>
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter === status}
                onCheckedChange={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Document Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={typeFilter === "all"}
              onCheckedChange={() => setTypeFilter("all")}
            >
              All Types
            </DropdownMenuCheckboxItem>
            {documentTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={typeFilter === type}
                onCheckedChange={() => setTypeFilter(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Document Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Modified</TableHead>
              <TableHead className="hidden lg:table-cell">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <File className="h-10 w-10 mb-2 opacity-30" />
                    <span className="font-medium">No documents found</span>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((document) => (
                <TableRow
                  key={document.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/documents/${document.id}`)}
                >
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{document.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{document.department}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(document.status)}>
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {format(document.modifiedAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {(document.fileSize / 1024 / 1024).toFixed(1)} MB
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Documents;
