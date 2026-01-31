import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Department, DocumentType, UserRole } from "@/lib/types";
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
import { Upload as UploadIcon, X, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StorageService } from "@/services/storageService";
import { Progress } from "@/components/ui/progress";

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
  const [confidentiality, setConfidentiality] = useState<"public" | "internal" | "confidential" | "restricted">("internal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
    setUploadError(null);
    
    // Validate file size (50MB limit)
    if (selectedFile.size > 52428800) {
      setUploadError("File size exceeds 50MB limit");
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError("File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, TXT, or image files.");
      return;
    }
    
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
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle form submission with real Supabase upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !documentName || !documentType || !department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Simulate progress for UX (real progress would need XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to Supabase Storage
      const uploadResult = await StorageService.uploadDocument(
        file,
        user.id,
        documentType
      );
      
      clearInterval(progressInterval);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      
      setUploadProgress(95);
      
      // Create document record in database
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
      
      const documentRecord = await StorageService.createDocumentRecord(
        documentName,
        uploadResult.url || '',
        file.type,
        file.size,
        user.id,
        {
          description,
          documentType,
          documentCategory: department,
          priority,
          confidentialityLevel: confidentiality,
          tags: tagsArray.length > 0 ? tagsArray : undefined
        }
      );
      
      if (!documentRecord) {
        throw new Error('Failed to create document record');
      }
      
      setUploadProgress(100);
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and submitted for review.",
      });
      
      navigate("/documents");
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                } ${uploadError ? "border-destructive" : ""}`}
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
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif"
                />
                
                {uploadError ? (
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-medium text-destructive">Upload Error</h3>
                      <p className="text-sm text-muted-foreground">{uploadError}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : file ? (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
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
                    <div className="flex flex-wrap justify-center gap-1">
                      <Badge variant="outline">PDF</Badge>
                      <Badge variant="outline">DOC</Badge>
                      <Badge variant="outline">XLS</Badge>
                      <Badge variant="outline">JPG</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Max 50MB</p>
                  </div>
                )}
              </div>
              
              {isSubmitting && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="clinical, report (comma separated)"
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

                <div className="space-y-2">
                  <Label htmlFor="confidentiality">Confidentiality</Label>
                  <Select
                    value={confidentiality}
                    onValueChange={(value) => setConfidentiality(value as "public" | "internal" | "confidential" | "restricted")}
                  >
                    <SelectTrigger id="confidentiality">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/documents")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-hospital-600 hover:bg-hospital-700"
                  disabled={isSubmitting || !file}
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
