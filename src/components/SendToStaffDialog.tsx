
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  department: string | null;
}

interface SendToStaffDialogProps {
  document?: any;
  trigger?: React.ReactNode;
  departmentStaff?: { id: string; name: string; email: string }[];
}

export const SendToStaffDialog: React.FC<SendToStaffDialogProps> = ({ 
  document: doc, 
  trigger,
  departmentStaff = []
}) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(doc?.name || '');
  const [comments, setComments] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && departmentStaff.length === 0) {
      setLoadingStaff(true);
      supabase
        .from('users')
        .select('id, first_name, last_name, email, department')
        .eq('is_active', true)
        .neq('id', user?.id || '')
        .order('first_name')
        .then(({ data }) => {
          if (data) setStaffMembers(data);
          setLoadingStaff(false);
        });
    }
  }, [isOpen, user, departmentStaff.length]);

  // Build unified staff list
  const staffList: { id: string; name: string; email: string; department?: string }[] = 
    departmentStaff.length > 0 
      ? departmentStaff 
      : staffMembers.map(s => ({ 
          id: s.id, 
          name: `${s.first_name || ''} ${s.last_name || ''}`.trim(), 
          email: s.email,
          department: s.department || undefined
        }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a document title.", variant: "destructive" });
      return;
    }

    if (!selectedStaff) {
      toast({ title: "Staff member required", description: "Please select a staff member.", variant: "destructive" });
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
        documentId: doc?.id || `doc-${Date.now()}`,
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

      setTitle(doc?.name || '');
      setComments('');
      setSelectedStaff('');
      setAttachments([]);
      setIsOpen(false);
    } catch (error) {
      toast({ title: "Failed to send document", description: "Please try again.", variant: "destructive" });
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
            <Select value={selectedStaff} onValueChange={setSelectedStaff} disabled={loadingStaff}>
              <SelectTrigger>
                <SelectValue placeholder={loadingStaff ? "Loading staff..." : "Choose a staff member"} />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email}){staff.department ? ` — ${staff.department}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-title">Document Title</Label>
            <Input id="staff-title" placeholder="Enter document title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-attachments">Attach Files (Optional)</Label>
            <div className="space-y-2">
              <input id="staff-attachments" type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls" />
              <Button type="button" variant="outline" onClick={() => window.document.getElementById('staff-attachments')?.click()} className="w-full">
                <Upload className="h-4 w-4 mr-2" /> Choose Files
              </Button>
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-comments">Comments (Optional)</Label>
            <Textarea id="staff-comments" placeholder="Add any comments or instructions..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send to Staff'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};