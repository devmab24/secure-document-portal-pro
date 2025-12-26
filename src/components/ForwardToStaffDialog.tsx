import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Forward, Upload, X, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  department: string | null;
}

interface ForwardToStaffDialogProps {
  message?: {
    id: string;
    subject: string;
    message_content: string;
    from_user_id: string;
    document_id?: string;
    metadata?: any;
  };
  trigger?: React.ReactNode;
  onForwarded?: () => void;
}

export const ForwardToStaffDialog: React.FC<ForwardToStaffDialogProps> = ({ 
  message, 
  trigger,
  onForwarded
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchStaffMembers();
      if (message) {
        setSubject(`FW: ${message.subject}`);
      }
    }
  }, [isOpen, message]);

  const fetchStaffMembers = async () => {
    setLoadingStaff(true);
    try {
      // Fetch staff members from the same department
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, department')
        .eq('is_active', true)
        .neq('id', user?.id || '')
        .order('first_name');

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for the message.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedStaff) {
      toast({
        title: "Staff member required",
        description: "Please select a staff member to forward to.",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      const staffMember = staffMembers.find(s => s.id === selectedStaff);
      
      // Create inter-department message for forwarding
      const { error: messageError } = await supabase
        .from('inter_department_messages')
        .insert({
          from_user_id: user.id,
          to_user_id: selectedStaff,
          subject: subject.trim(),
          message_content: instructions.trim() || message?.message_content || '',
          priority,
          message_type: 'document_routing',
          document_id: message?.document_id || null,
          metadata: {
            from_role: 'HEAD_OF_UNIT',
            to_role: 'STAFF',
            original_message_id: message?.id,
            workflow_step: 'unit_head_to_staff',
            forwarded_from: message?.from_user_id
          }
        });

      if (messageError) throw messageError;

      // Update original message status if exists
      if (message?.id) {
        await supabase
          .from('inter_department_messages')
          .update({ 
            status: 'forwarded',
            metadata: {
              ...message.metadata,
              forwarded_to: selectedStaff,
              forwarded_at: new Date().toISOString()
            }
          })
          .eq('id', message.id);
      }

      toast({
        title: "Document forwarded successfully",
        description: `"${subject}" has been forwarded to ${staffMember?.first_name} ${staffMember?.last_name}.`
      });

      // Reset form
      setSubject('');
      setInstructions('');
      setPriority('normal');
      setSelectedStaff('');
      setAttachments([]);
      setIsOpen(false);
      onForwarded?.();
    } catch (error) {
      console.error('Error forwarding document:', error);
      toast({
        title: "Failed to forward document",
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
            <Forward className="h-4 w-4 mr-2" />
            Forward to Staff
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Forward to Staff Member
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-select">Select Staff Member</Label>
            <Select value={selectedStaff} onValueChange={setSelectedStaff} disabled={loadingStaff}>
              <SelectTrigger>
                <SelectValue placeholder={loadingStaff ? "Loading staff..." : "Choose a staff member"} />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.first_name} {staff.last_name} ({staff.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as any)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="fwd-normal" />
                <Label htmlFor="fwd-normal" className="font-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="fwd-high" />
                <Label htmlFor="fwd-high" className="font-normal text-orange-600">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="fwd-urgent" />
                <Label htmlFor="fwd-urgent" className="font-normal text-red-600">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-attachments">Attach Additional Files (Optional)</Label>
            <div className="space-y-2">
              <input
                id="staff-attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('staff-attachments')?.click()}
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
            <Label htmlFor="instructions">Instructions for Staff</Label>
            <Textarea
              id="instructions"
              placeholder="Add specific instructions or actions required..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
            />
          </div>

          {message && (
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Original Message:</p>
              <p className="text-sm font-medium">{message.subject}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{message.message_content}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  Forwarding...
                </>
              ) : (
                <>
                  <Forward className="h-4 w-4 mr-2" />
                  Forward to Staff
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
