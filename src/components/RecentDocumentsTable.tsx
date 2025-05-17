
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document, DocumentStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "date-fns";

interface RecentDocumentsTableProps {
  documents: Document[];
  onRowClick: (documentId: string) => void;
}

const RecentDocumentsTable = ({ documents, onRowClick }: RecentDocumentsTableProps) => {
  const formatDate = (date: Date) => {
    return formatRelative(date, new Date());
  };

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow 
                key={document.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRowClick(document.id)}
              >
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.department}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(document.status)}>
                    {document.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(document.modifiedAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentDocumentsTable;
