
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, X, FileText } from 'lucide-react';
import { Department } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments } from '@/store/slices/documentSlice';
import { useAuth } from '@/contexts/AuthContext';

interface CmdDocumentSendDialogProps {
  onSend: (data: {
    title: string;
    recipient: string;
    department: Department;
    message?: string;
    file?: File;
    selectedDocumentId?: string;
  }) => void;
}

export const CmdDocumentSendDialog: React.FC<CmdDocumentSendDialogProps> = ({ onSend }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector(state => state.documents);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      dispatch(fetchDocuments({ userId: user.id }));
    }
  }, [dispatch, user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Set title from filename
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    const selectedDoc = documents.find(doc => doc.id === documentId);
    if (selectedDoc) {
      setTitle(selectedDoc.name);
    }
  };

  const handleSend = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a document title.",
        variant: "destructive"
      });
      return;
    }

    if (!recipient.trim()) {
      toast({
        title: "Recipient required",
        description: "Please enter a recipient.",
        variant: "destructive"
      });
      return;
    }

    if (!department) {
      toast({
        title: "Department required",
        description: "Please select a department.",
        variant: "destructive"
      });
      return;
    }

    if (!file && !selectedDocumentId) {
      toast({
        title: "Document required",
        description: "Please select a document from your forms or upload a file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await onSend({
        title: title.trim(),
        recipient: recipient.trim(),
        department: department as Department,
        message: message.trim() || undefined,
        file: file || undefined,
        selectedDocumentId: selectedDocumentId || undefined
      });

      toast({
        title: "Document sent successfully",
        description: `Document "${title}" has been sent to ${recipient}.`
      });

      // Reset form
      setTitle('');
      setRecipient('');
      setDepartment('');
      setMessage('');
      setFile(null);
      setSelectedDocumentId('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send document",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-hospital-600 hover:bg-hospital-700">
          <Send className="h-4 w-4 mr-2" />
          Send A New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Send to (Recipient)</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Department).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="select-form" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select-form">Select from My Forms</TabsTrigger>
              <TabsTrigger value="upload-file">Upload File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="select-form" className="space-y-2">
              <Label>Select Document from My Forms</Label>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <Select value={selectedDocumentId} onValueChange={handleDocumentSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document..." />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{doc.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </TabsContent>
            
            <TabsContent value="upload-file" className="space-y-2">
              <Label htmlFor="file">Upload Document</Label>
              <div className="flex items-center gap-2">
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Document'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
