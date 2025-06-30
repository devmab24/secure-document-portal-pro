
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch } from '@/store';
import { submitDocument } from '@/store/slices/documentSharingSlice';

interface SendToStaffDialogProps {
  document?: any;
  trigger?: React.ReactNode;
  departmentStaff?: { id: string; name: string; email: string }[];
}

export const SendToStaffDialog: React.FC<SendToStaffDialogProps> = ({ 
  document, 
  trigger,
  departmentStaff = []
}) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(document?.name || '');
  const [comments, setComments] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock staff data if not provided
  const mockStaff = [
    { id: 'staff-1', name: 'John Smith', email: 'john.smith@hospital.com' },
    { id: 'staff-2', name: 'Sarah Johnson', email: 'sarah.johnson@hospital.com' },
    { id: 'staff-3', name: 'Mike Brown', email: 'mike.brown@hospital.com' }
  ];

  const staffList = departmentStaff.length > 0 ? departmentStaff : mockStaff;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a document title.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedStaff) {
      toast({
        title: "Staff member required",
        description: "Please select a staff member to send the document to.",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      const attachmentObjects = attachments.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));

      const selectedStaffMember = staffList.find(s => s.id === selectedStaff);

      await dispatch(submitDocument({
        documentId: document?.id || `doc-${Date.now()}`,
        title: title.trim(),
        fromUserId: user.id,
        fromUserName: `${user.firstName} ${user.lastName}`,
        fromDepartment: user.department,
        toUserId: selectedStaff,
        toUserName: selectedStaffMember?.name,
        submissionType: 'hod-to-staff',
        comments: comments.trim() || undefined,
        attachments: attachmentObjects.length > 0 ? attachmentObjects : undefined
      }));

      toast({
        title: "Document sent to staff",
        description: `"${title}" has been sent to ${selectedStaffMember?.name}.`
      });

      // Reset form
      setTitle(document?.name || '');
      setComments('');
      setSelectedStaff('');
      setAttachments([]);
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
        {trigger || (
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send to Staff
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Document to Staff</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-select">Select Staff Member</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="attachments">Attach Files (Optional)</Label>
            <div className="space-y-2">
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments or instructions for the staff member..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send to Staff'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
