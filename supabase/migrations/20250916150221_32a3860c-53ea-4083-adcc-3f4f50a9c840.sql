-- Create inter-department communications table
CREATE TABLE public.inter_department_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID,
  to_department TEXT,
  document_id UUID,
  subject TEXT NOT NULL,
  message_content TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'broadcast', 'forward')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'acknowledged')),
  requires_response BOOLEAN DEFAULT false,
  response_deadline TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create message recipients table for broadcast messages
CREATE TABLE public.message_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.inter_department_messages(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL,
  recipient_department TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'acknowledged')),
  read_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message attachments table
CREATE TABLE public.message_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.inter_department_messages(id) ON DELETE CASCADE,
  attachment_name TEXT NOT NULL,
  attachment_url TEXT NOT NULL,
  attachment_type TEXT,
  attachment_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.inter_department_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inter_department_messages
CREATE POLICY "Users can create messages they send" 
ON public.inter_department_messages 
FOR INSERT 
WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can view messages they sent" 
ON public.inter_department_messages 
FOR SELECT 
USING (from_user_id = auth.uid());

CREATE POLICY "Users can view messages sent to them" 
ON public.inter_department_messages 
FOR SELECT 
USING (to_user_id = auth.uid());

CREATE POLICY "Users can update messages they sent" 
ON public.inter_department_messages 
FOR UPDATE 
USING (from_user_id = auth.uid());

CREATE POLICY "Recipients can update message status" 
ON public.inter_department_messages 
FOR UPDATE 
USING (to_user_id = auth.uid());

-- RLS Policies for message_recipients
CREATE POLICY "Recipients can view their messages" 
ON public.message_recipients 
FOR SELECT 
USING (recipient_user_id = auth.uid());

CREATE POLICY "Recipients can update their message status" 
ON public.message_recipients 
FOR UPDATE 
USING (recipient_user_id = auth.uid());

-- RLS Policies for message_attachments  
CREATE POLICY "Users can view attachments for messages they can see" 
ON public.message_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.inter_department_messages 
    WHERE id = message_attachments.message_id 
    AND (from_user_id = auth.uid() OR to_user_id = auth.uid())
  )
);

-- Create indexes for performance
CREATE INDEX idx_inter_dept_messages_from_user ON public.inter_department_messages(from_user_id);
CREATE INDEX idx_inter_dept_messages_to_user ON public.inter_department_messages(to_user_id);
CREATE INDEX idx_inter_dept_messages_department ON public.inter_department_messages(to_department);
CREATE INDEX idx_inter_dept_messages_status ON public.inter_department_messages(status);
CREATE INDEX idx_inter_dept_messages_priority ON public.inter_department_messages(priority);
CREATE INDEX idx_message_recipients_user ON public.message_recipients(recipient_user_id);
CREATE INDEX idx_message_recipients_message ON public.message_recipients(message_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_inter_dept_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_inter_dept_messages_updated_at
BEFORE UPDATE ON public.inter_department_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_inter_dept_message_updated_at();