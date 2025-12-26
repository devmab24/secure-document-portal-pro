import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Send, Upload, X, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DepartmentUnit {
  id: string;
  name: string;
  code: string | null;
  head_user_id: string | null;
  department_id: string;
}

interface SendToUnitHeadDialogProps {
  document?: any;
  trigger?: React.ReactNode;
  onSent?: () => void;
}

export const SendToUnitHeadDialog: React.FC<SendToUnitHeadDialogProps> = ({ 
  document, 
  trigger,
  onSent
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(document?.name || '');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [units, setUnits] = useState<DepartmentUnit[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUnits();
    }
  }, [isOpen]);

  const fetchUnits = async () => {
    setLoadingUnits(true);
    try {
      const { data, error } = await supabase
        .from('department_units')
        .select('id, name, code, head_user_id, department_id')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoadingUnits(false);
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

    if (!selectedUnit) {
      toast({
        title: "Unit required",
        description: "Please select a unit to send the document to.",
        variant: "destructive"
      });
      return;
    }

    const unit = units.find(u => u.id === selectedUnit);
    if (!unit?.head_user_id) {
      toast({
        title: "No Unit Head assigned",
        description: "The selected unit does not have a Head of Unit assigned yet.",
        variant: "destructive"
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      // Create inter-department message
      const { error: messageError } = await supabase
        .from('inter_department_messages')
        .insert({
          from_user_id: user.id,
          to_user_id: unit.head_user_id,
          subject: subject.trim(),
          message_content: message.trim(),
          priority,
          message_type: 'document_routing',
          document_id: document?.id || null,
          metadata: {
            from_role: 'DIRECTOR_ADMIN',
            to_role: 'HEAD_OF_UNIT',
            unit_id: unit.id,
            unit_name: unit.name,
            workflow_step: 'director_to_unit_head'
          }
        });

      if (messageError) throw messageError;

      toast({
        title: "Document sent successfully",
        description: `"${subject}" has been sent to the Head of ${unit.name}.`
      });

      // Reset form
      setSubject(document?.name || '');
      setMessage('');
      setPriority('normal');
      setSelectedUnit('');
      setAttachments([]);
      setIsOpen(false);
      onSent?.();
    } catch (error) {
      console.error('Error sending document:', error);
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
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Send to Unit Head
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Send Document to Unit Head
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit-select">Select Administrative Unit</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit} disabled={loadingUnits}>
              <SelectTrigger>
                <SelectValue placeholder={loadingUnits ? "Loading units..." : "Choose a unit"} />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} {unit.code ? `(${unit.code})` : ''}
                    {!unit.head_user_id && ' - No Head Assigned'}
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
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal text-orange-600">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="font-normal text-red-600">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attach Files (Optional)</Label>
            <div className="space-y-2">
              <input
                id="unit-attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('unit-attachments')?.click()}
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
            <Label htmlFor="message">Message / Instructions</Label>
            <Textarea
              id="message"
              placeholder="Add instructions or context for the Unit Head..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Unit Head
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
