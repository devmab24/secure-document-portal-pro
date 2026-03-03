
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

export const SendToHodDialog: React.FC<SendToHodDialogProps> = ({ 
  document: doc, 
  trigger, 
  hodUserId, 
  hodName 
}) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(doc?.name || '');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hods, setHods] = useState<HodOption[]>([]);
  const [selectedHod, setSelectedHod] = useState(hodUserId || '');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !hodUserId) {
      // Fetch all HODs from Supabase
      supabase
        .from('users')
        .select('id, first_name, last_name, department')
        .eq('role', 'HOD')
        .eq('is_active', true)
        .order('department')
        .then(({ data }) => {
          if (data) setHods(data);
        });
    }
  }, [isOpen, hodUserId]);

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

    const targetId = hodUserId || selectedHod;
    if (!targetId) {
      toast({ title: "HOD required", description: "Please select a department head.", variant: "destructive" });
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

      toast({
        title: "Document sent to HOD",
        description: `"${title}" has been submitted to ${toName} for review.`
      });

      setTitle(doc?.name || '');
      setComments('');
      setAttachments([]);
      setSelectedHod('');
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
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Send className="h-4 w-4 mr-2" />
            Send to HOD
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
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department head..." />
                </SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="hod-attachments">Attach Files (Optional)</Label>
            <div className="space-y-2">
              <input id="hod-attachments" type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls" />
              <Button type="button" variant="outline" onClick={() => window.document.getElementById('hod-attachments')?.click()} className="w-full">
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
            <Label htmlFor="hod-comments">Comments (Optional)</Label>
            <Textarea id="hod-comments" placeholder="Add any comments or context for the HOD..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send to HOD'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};