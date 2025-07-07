import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Department, DocumentStatus, DocumentType, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, File, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [department, setDepartment] = useState<Department | "">("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Prepare department options
  const departmentOptions = Object.values(Department);
  
  // If user is HOD or staff, default to their department and disable the select
  const userDepartment = user?.department;
  const canChangeDepartment = user?.role === UserRole.CMD || user?.role === UserRole.ADMIN;
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelected(droppedFile);
    }
  };
  
  // Handle file selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };
  
  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Auto-fill document name from file name (remove extension)
    const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
    setDocumentName(fileName);
    
    // Try to detect document type from file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension) {
      if (['doc', 'docx'].includes(extension)) {
        setDocumentType(DocumentType.PROCEDURE);
      } else if (['xls', 'xlsx'].includes(extension)) {
        setDocumentType(DocumentType.REPORT);
      } else if (['pdf'].includes(extension)) {
        setDocumentType(DocumentType.POLICY);
      }
    }
    
    // If user has a department, set it as default
    if (userDepartment) {
      setDepartment(userDepartment);
    }
  };
  
  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !documentName || !documentType || !department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API upload delay
    setTimeout(() => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and submitted for review.",
      });
      
      setIsSubmitting(false);
      navigate("/documents");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: File upload */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div
                className={`file-drop-area ${isDragging ? "active" : ""} ${
                  file ? "bg-muted/50" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                />
                
                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-hospital-100 mx-auto">
                      <Check className="h-6 w-6 text-hospital-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">File selected</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center cursor-pointer">
                    <UploadIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">
                      Drag & drop your file here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse your files
                    </p>
                    <Badge variant="outline" className="mx-1">PDF</Badge>
                    <Badge variant="outline" className="mx-1">DOC</Badge>
                    <Badge variant="outline" className="mx-1">XLS</Badge>
                    <Badge variant="outline" className="mx-1">JPG</Badge>
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-1">
                <h3 className="font-medium text-sm">Document submission process:</h3>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Upload your document with metadata</li>
                  <li>Document will be submitted for approval</li>
                  <li>Department head will review the document</li>
                  <li>Final approval by Chief Medical Director</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          {/* Right column: Document metadata */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentName" className="required">Document Name</Label>
                <Input
                  id="documentName"
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType" className="required">Document Type</Label>
                  <Select
                    value={documentType}
                    onValueChange={(value) => setDocumentType(value as DocumentType)}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DocumentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department" className="required">Department</Label>
                  <Select
                    value={department}
                    onValueChange={(value) => setDepartment(value as Department)}
                    disabled={!canChangeDepartment && !!userDepartment}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter document description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="E.g. clinical, report, quarterly (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value) => setPriority(value as "low" | "medium" | "high" | "urgent")}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/documents")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-hospital-600 hover:bg-hospital-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Upload;
