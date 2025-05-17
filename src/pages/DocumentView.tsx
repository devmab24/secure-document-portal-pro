
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockDocuments, mockUsers } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentStatus, UserRole } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  File as FileIcon,
  FileText,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the document
  const document = mockDocuments.find(doc => doc.id === id);
  
  // State for approval comment
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!document || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The document you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={() => navigate("/documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
      </div>
    );
  }
  
  // Find document uploader
  const uploader = mockUsers.find(u => u.id === document.uploadedBy);
  
  // Check if user can approve the document
  const canApproveDocument = 
    user.id === document.currentApprover || 
    user.role === UserRole.CMD || 
    user.role === UserRole.ADMIN;
  
  // Check if the document is in a state that can be approved
  const isApprovable = 
    document.status === DocumentStatus.SUBMITTED || 
    document.status === DocumentStatus.UNDER_REVIEW;
  
  // Handle document approval
  const handleApproveDocument = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Document Approved",
        description: "The document has been approved successfully.",
      });
      
      setIsSubmitting(false);
      navigate("/documents");
    }, 1000);
  };
  
  // Handle document rejection
  const handleRejectDocument = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Document Rejected",
        description: "The document has been rejected with your feedback.",
      });
      
      setIsSubmitting(false);
      navigate("/documents");
    }, 1000);
  };
  
  // Handle document download
  const handleDownloadDocument = () => {
    toast({
      title: "Download Started",
      description: "Your document download has started.",
    });
  };
  
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
  
  // Format the file size
  const formattedSize = (document.fileSize / 1024 / 1024).toFixed(2) + " MB";

  return (
    <div className="space-y-6">
      {/* Navigation and header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/documents")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold truncate">{document.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(document.status)}>
            {document.status}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadDocument}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          {canApproveDocument && isApprovable && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" className="w-24">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Document</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please provide a reason for rejecting this document. This feedback will be shared with the document uploader.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    placeholder="Enter rejection reason"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    className="my-4"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRejectDocument}
                      disabled={!rejectionComment.trim() || isSubmitting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isSubmitting ? "Processing..." : "Reject Document"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-hospital-600 hover:bg-hospital-700 w-24">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Document</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this document? You can optionally add a comment.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    placeholder="Optional approval comment"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="my-4"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleApproveDocument}
                      disabled={isSubmitting}
                      className="bg-hospital-600 hover:bg-hospital-700"
                    >
                      {isSubmitting ? "Processing..." : "Approve Document"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
      
      {/* Document content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="pt-4">
                <div className="border rounded-md p-8 text-center">
                  <FileIcon className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preview not available. Please download the document to view its contents.
                  </p>
                  <Button 
                    onClick={handleDownloadDocument}
                    className="mt-4 bg-hospital-600 hover:bg-hospital-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Document Name</h3>
                      <p className="text-base">{document.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
                      <p className="text-base">{document.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                      <p className="text-base">{document.department}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge variant={getStatusBadgeVariant(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="text-base">{document.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Uploaded By</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={uploader?.avatarUrl} alt={uploader?.firstName} />
                          <AvatarFallback>{uploader ? `${uploader.firstName[0]}${uploader.lastName[0]}` : "UU"}</AvatarFallback>
                        </Avatar>
                        <span>{uploader ? `${uploader.firstName} ${uploader.lastName}` : "Unknown User"}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                      <p className="text-base capitalize">{document.priority || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Upload Date</h3>
                      <p className="text-base">{format(document.uploadedAt, "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                      <p className="text-base">{formattedSize}</p>
                    </div>
                  </div>
                  
                  {document.tags && document.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Document History</h3>
                  </div>
                  
                  <div className="border-l-2 border-muted pl-4 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-[25px] bg-background p-1 border-2 border-muted rounded-full">
                        <FileIcon className="h-3 w-3" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Document Created</p>
                        <p className="text-xs text-muted-foreground">
                          {format(document.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-sm">
                          {uploader ? `${uploader.firstName} ${uploader.lastName}` : "Unknown User"} uploaded the document
                        </p>
                      </div>
                    </div>
                    
                    {document.status !== DocumentStatus.DRAFT && (
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-background p-1 border-2 border-muted rounded-full">
                          <FileText className="h-3 w-3" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Document Submitted</p>
                          <p className="text-xs text-muted-foreground">
                            {format(document.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          <p className="text-sm">
                            Document was submitted for review
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {document.status === DocumentStatus.APPROVED && (
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-background p-1 border-2 border-accent rounded-full">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Document Approved</p>
                          <p className="text-xs text-muted-foreground">
                            {format(document.modifiedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          <p className="text-sm">
                            Document was approved and finalized
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {document.status === DocumentStatus.REJECTED && (
                      <div className="relative">
                        <div className="absolute -left-[25px] bg-background p-1 border-2 border-destructive rounded-full">
                          <XCircle className="h-3 w-3 text-destructive" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Document Rejected</p>
                          <p className="text-xs text-muted-foreground">
                            {format(document.modifiedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          <p className="text-sm">
                            Document was rejected and requires revision
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Document metadata sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-medium">File Information</h3>
              </div>
              
              <ul className="space-y-3 mt-3">
                <li className="flex items-start text-sm">
                  <FileIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span>{document.fileType.split('/')[1].toUpperCase()}</span>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Uploaded: </span>
                    <span>{format(document.uploadedAt, "dd MMM yyyy")}</span>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Modified: </span>
                    <span>{format(document.modifiedAt, "dd MMM yyyy")}</span>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <Tag className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Size: </span>
                    <span>{formattedSize}</span>
                  </div>
                </li>
                <li className="flex items-start text-sm">
                  <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="text-muted-foreground">Uploader: </span>
                    <span>
                      {uploader ? `${uploader.firstName} ${uploader.lastName}` : "Unknown User"}
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {document.approvalChain && document.approvalChain.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="font-medium">Approval Chain</h3>
                </div>
                
                <ul className="space-y-3 mt-3">
                  {document.approvalChain.map((approverID, index) => {
                    const approver = mockUsers.find(u => u.id === approverID);
                    
                    // Determine approval status
                    let status = "Pending";
                    let statusClass = "text-muted-foreground";
                    
                    if (document.status === DocumentStatus.APPROVED) {
                      status = "Approved";
                      statusClass = "text-green-500";
                    } else if (document.currentApprover === approverID) {
                      status = "Awaiting";
                      statusClass = "text-amber-500";
                    } else if (index === 0 && document.status === DocumentStatus.UNDER_REVIEW) {
                      status = "Approved";
                      statusClass = "text-green-500";
                    }
                    
                    return (
                      <li key={approverID} className="flex items-center text-sm">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={approver?.avatarUrl} alt={approver?.firstName} />
                          <AvatarFallback>{approver ? `${approver.firstName[0]}${approver.lastName[0]}` : "UU"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div>
                            {approver ? `${approver.firstName} ${approver.lastName}` : "Unknown"}
                            <span className="text-xs text-muted-foreground ml-1">({approver?.role})</span>
                          </div>
                          <span className={statusClass}>{status}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Download button on mobile */}
          <Button 
            onClick={handleDownloadDocument}
            className="w-full md:hidden bg-hospital-600 hover:bg-hospital-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
