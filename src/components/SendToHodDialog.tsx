
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch } from '@/store';
import { submitDocument } from '@/store/slices/documentSharingSlice';
import { supabase } from '@/integrations/supabase/client';
import { uploadAttachments, AttachmentProgress } from '@/backend/modules/storage/attachments.service';
import { AttachmentsField } from '@/components/AttachmentsField';

interface HodOption {
  id: string;
  first_name: string | null;
  last_name: string | null;
  department: string | null;
}

interface SendToHodDialogProps {
  document?: any;
  trigger?: React.ReactNode;
  hodUserId?: string;
  hodName?: string;
}

export const SendToHodDialog: React.FC<SendToHodDialogProps> = ({ document: doc, trigger, hodUserId, hodName }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(doc?.name || '');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<AttachmentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hods, setHods] = useState<HodOption[]>([]);
  const [selectedHod, setSelectedHod] = useState(hodUserId || '');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !hodUserId) {
      supabase
        .from('users')
        .select('id, first_name, last_name, department')
        .eq('role', 'HOD')
        .eq('is_active', true)
        .order('department')
        .then(({ data }) => { if (data) setHods(data); });
    }
  }, [isOpen, hodUserId]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter a document title.", variant: "destructive" });
      return;
    }
    const targetId = hodUserId || selectedHod;
    if (!targetId) {
      toast({ title: "HOD required", description: "Please select a department head.", variant: "destructive" });
      return;
    }
    if (!user) return;

    setIsLoading(true);
    setUploadProgress([]);
    try {
      const attachmentObjects = attachments.length > 0
        ? await uploadAttachments(attachments, user.id, 'hod-submissions', (p) => {
            setUploadProgress(prev => {
              const next = prev.filter(x => x.index !== p.index);
              next.push(p);
              return next;
            });
          })
        : [];

      const selectedHodData = hods.find(h => h.id === targetId);
      const toName = hodName || (selectedHodData ? `${selectedHodData.first_name} ${selectedHodData.last_name}` : 'Department Head');

      await dispatch(submitDocument({
        documentId: doc?.id || `doc-${Date.now()}`,
        title: title.trim(),
        fromUserId: user.id,
        fromUserName: `${user.firstName} ${user.lastName}`,
        fromDepartment: user.department,
        toUserId: targetId,
        toUserName: toName,
        submissionType: 'staff-to-hod',
        comments: comments.trim() || undefined,
        attachments: attachmentObjects.length > 0 ? attachmentObjects : undefined
      }));

      toast({ title: "Document sent to HOD", description: `"${title}" has been submitted to ${toName} for review.` });

      setTitle(doc?.name || '');
      setComments('');
      setAttachments([]);
      setUploadProgress([]);
      setSelectedHod('');
      setIsOpen(false);
    } catch (error: any) {
      toast({ title: "Failed to send document", description: error?.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Send className="h-4 w-4 mr-2" /> Send to HOD
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Document to HOD</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!hodUserId && (
            <div className="space-y-2">
              <Label>Select Department Head</Label>
              <Select value={selectedHod} onValueChange={setSelectedHod}>
                <SelectTrigger><SelectValue placeholder="Choose a department head..." /></SelectTrigger>
                <SelectContent>
                  {hods.map((hod) => (
                    <SelectItem key={hod.id} value={hod.id}>
                      {hod.first_name} {hod.last_name} — {hod.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hodUserId && hodName && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <strong>Sending to:</strong> {hodName}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hod-title">Document Title</Label>
            <Input id="hod-title" placeholder="Enter document title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <AttachmentsField
            id="hod-attachments"
            files={attachments}
            onChange={setAttachments}
            progress={uploadProgress}
            disabled={isLoading}
          />

          <div className="space-y-2">
            <Label htmlFor="hod-comments">Comments (Optional)</Label>
            <Textarea id="hod-comments" placeholder="Add any comments or context for the HOD..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Sending…' : 'Send to HOD'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
