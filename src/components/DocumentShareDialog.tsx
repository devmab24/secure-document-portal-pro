
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Department, User, Document, DocumentShare, ShareStatus } from '@/lib/types';

interface DocumentShareDialogProps {
  document: Document;
  currentUser: User;
  onShare: (shareData: Omit<DocumentShare, 'id' | 'sharedAt'>) => void;
  availableUsers?: User[];
}

export const DocumentShareDialog: React.FC<DocumentShareDialogProps> = ({
  document,
  currentUser,
  onShare,
  availableUsers = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareType, setShareType] = useState<'user' | 'department'>('user');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (shareType === 'user' && !selectedUser) {
      toast({
        title: "Please select a user",
        description: "You must select a user to share the document with.",
        variant: "destructive"
      });
      return;
    }

    if (shareType === 'department' && !selectedDepartment) {
      toast({
        title: "Please select a department",
        description: "You must select a department to share the document with.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const shareData: Omit<DocumentShare, 'id' | 'sharedAt'> = {
        documentId: document.id,
        fromUserId: currentUser.id,
        toUserId: shareType === 'user' ? selectedUser : undefined,
        toDepartment: shareType === 'department' ? selectedDepartment as Department : undefined,
        status: ShareStatus.SENT,
        message: message.trim() || undefined
      };

      await onShare(shareData);

      toast({
        title: "Document shared successfully",
        description: `Document "${document.name}" has been shared.`
      });

      // Reset form
      setSelectedUser('');
      setSelectedDepartment('');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Failed to share document",
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
        <Button variant="outline" size="sm">
          <Send className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Document: {document.name}
            </Label>
          </div>

          <div className="space-y-3">
            <Label>Share with</Label>
            <RadioGroup value={shareType} onValueChange={(value) => setShareType(value as 'user' | 'department')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Specific User
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="department" id="department" />
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Entire Department
                </Label>
              </div>
            </RadioGroup>
          </div>

          {shareType === 'user' && (
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {shareType === 'department' && (
            <div className="space-y-2">
              <Label>Select Department</Label>
              <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Department).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Textarea
              placeholder="Add a message for the recipient..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={isLoading}>
              {isLoading ? 'Sharing...' : 'Share Document'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
