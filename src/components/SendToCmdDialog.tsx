
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentSharingService } from '@/services/documentSharingService';
import { supabase } from '@/integrations/supabase/client';

interface SendToCmdDialogProps {
  document?: any;
  trigger?: React.ReactNode;
}

export const SendToCmdDialog: React.FC<SendToCmdDialogProps> = ({ document: doc, trigger }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(doc?.name || '');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cmdUser, setCmdUser] = useState<{ id: string; first_name: string; last_name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Look up the CMD user from Supabase
      supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('role', 'CMD')
        .eq('is_active', true)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) setCmdUser(data[0]);
        });
    }
  }, [isOpen]);

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

    if (!cmdUser) {
      toast({ title: "CMD not found", description: "Unable to find the CMD user. Please try again.", variant: "destructive" });
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

      await DocumentSharingService.submitDocument({
        documentId: doc?.id || `doc-${Date.now()}`,
        title: title.trim(),
        fromUserId: user.id,
        fromUserName: `${user.firstName} ${user.lastName}`,
        fromDepartment: user.department,
        toUserId: cmdUser.id,
        toUserName: `${cmdUser.first_name} ${cmdUser.last_name}`,
        submissionType: 'hod-to-cmd',
        comments: comments.trim() || undefined,
        attachments: attachmentObjects.length > 0 ? attachmentObjects : undefined
      });

      toast({
        title: "Document sent to CMD",
        description: `"${title}" has been submitted to ${cmdUser.first_name} ${cmdUser.last_name} for review.`
      });

      setTitle(doc?.name || '');
      setComments('');
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
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Send className="h-4 w-4 mr-2" />
            Send to CMD
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Document to CMD</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cmdUser && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <strong>Sending to:</strong> {cmdUser.first_name} {cmdUser.last_name} (CMD)
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cmd-title">Document Title</Label>
            <Input id="cmd-title" placeholder="Enter document title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cmd-attachments">Attach Files (Optional)</Label>
            <div className="space-y-2">
              <input id="cmd-attachments" type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls" />
              <Button type="button" variant="outline" onClick={() => window.document.getElementById('cmd-attachments')?.click()} className="w-full">
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
            <Label htmlFor="cmd-comments">Comments (Optional)</Label>
            <Textarea id="cmd-comments" placeholder="Add any comments or context for the CMD..." value={comments} onChange={(e) => setComments(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading || !cmdUser}>
              {isLoading ? 'Sending...' : 'Send to CMD'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};