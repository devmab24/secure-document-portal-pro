
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, X } from 'lucide-react';
import { Department } from '@/lib/types';

interface DocumentSendDialogProps {
  onSend: (data: {
    title: string;
    recipient: string;
    department: Department;
    message?: string;
    file?: File;
  }) => void;
}

export const DocumentSendDialog: React.FC<DocumentSendDialogProps> = ({ onSend }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
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

    setIsLoading(true);

    try {
      await onSend({
        title: title.trim(),
        recipient: recipient.trim(),
        department: department as Department,
        message: message.trim() || undefined,
        file: file || undefined
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="file">Attach Document (Optional)</Label>
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
