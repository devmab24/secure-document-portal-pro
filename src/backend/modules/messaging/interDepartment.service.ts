import { supabase } from '@/integrations/supabase/client';
import { Department, UserRole } from '@/lib/types';

export interface InterDepartmentMessage {
  id: string;
  from_user_id: string;
  to_user_id?: string;
  to_department?: string;
  document_id?: string;
  subject: string;
  message_content?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  message_type: 'direct' | 'broadcast' | 'forward';
  status: 'sent' | 'delivered' | 'read' | 'acknowledged';
  requires_response: boolean;
  response_deadline?: string;
  read_at?: string;
  acknowledged_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  
  // Joined data from users table
  from_user?: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
  };
  to_user?: {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
  };
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  recipient_user_id: string;
  recipient_department?: string;
  status: 'sent' | 'delivered' | 'read' | 'acknowledged';
  read_at?: string;
  acknowledged_at?: string;
  created_at: string;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  attachment_name: string;
  attachment_url: string;
  attachment_type?: string;
  attachment_size?: number;
  created_at: string;
}

export class InterDepartmentService {
  // Send a direct message to a specific user
  static async sendDirectMessage(data: {
    to_user_id: string;
    subject: string;
    message_content?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    requires_response?: boolean;
    response_deadline?: string;
    document_id?: string;
  }): Promise<InterDepartmentMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: message, error } = await supabase
      .from('inter_department_messages')
      .insert({
        from_user_id: user.id,
        to_user_id: data.to_user_id,
        subject: data.subject,
        message_content: data.message_content,
        priority: data.priority || 'normal',
        message_type: 'direct',
        requires_response: data.requires_response || false,
        response_deadline: data.response_deadline,
        document_id: data.document_id,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Get user data separately to avoid foreign key issues
    const [fromUser, toUser] = await Promise.all([
      supabase.from('users').select('first_name, last_name, email, department, role').eq('id', user.id).single(),
      supabase.from('users').select('first_name, last_name, email, department, role').eq('id', data.to_user_id).single()
    ]);

    return {
      ...message,
      from_user: fromUser.data,
      to_user: toUser.data,
    } as InterDepartmentMessage;
  }

  // Send a broadcast message to a department
  static async sendDepartmentBroadcast(data: {
    to_department: string;
    subject: string;
    message_content?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    requires_response?: boolean;
    response_deadline?: string;
    document_id?: string;
  }): Promise<{ message: InterDepartmentMessage; recipients: MessageRecipient[] }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First create the message
    const { data: message, error: messageError } = await supabase
      .from('inter_department_messages')
      .insert({
        from_user_id: user.id,
        to_department: data.to_department,
        subject: data.subject,
        message_content: data.message_content,
        priority: data.priority || 'normal',
        message_type: 'broadcast',
        requires_response: data.requires_response || false,
        response_deadline: data.response_deadline,
        document_id: data.document_id,
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Get sender data
    const { data: fromUser } = await supabase
      .from('users')
      .select('first_name, last_name, email, department, role')
      .eq('id', user.id)
      .single();

    // Get all users in the target department (excluding the sender)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, department')
      .eq('department', data.to_department)
      .neq('id', user.id);

    if (usersError) throw usersError;

    // Create recipient records for each user
    const recipientInserts = users.map(targetUser => ({
      message_id: message.id,
      recipient_user_id: targetUser.id,
      recipient_department: data.to_department,
    }));

    const { data: recipients, error: recipientsError } = await supabase
      .from('message_recipients')
      .insert(recipientInserts)
      .select();

    if (recipientsError) throw recipientsError;

    return { 
      message: { ...message, from_user: fromUser } as InterDepartmentMessage, 
      recipients: recipients as MessageRecipient[] 
    };
  }

  // Get messages sent by the current user
  static async getSentMessages(userId: string): Promise<InterDepartmentMessage[]> {
    const { data: messages, error } = await supabase
      .from('inter_department_messages')
      .select('*')
      .eq('from_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Get user data for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message: any) => {
        const toUserData = message.to_user_id ? 
          await supabase.from('users').select('first_name, last_name, email, department, role').eq('id', message.to_user_id).single() :
          { data: null };
        
        return {
          ...message,
          to_user: toUserData.data,
        };
      })
    );

    return messagesWithUsers as InterDepartmentMessage[];
  }

  // Get messages received by the current user (direct messages)
  static async getReceivedDirectMessages(userId: string): Promise<InterDepartmentMessage[]> {
    const { data: messages, error } = await supabase
      .from('inter_department_messages')
      .select('*')
      .eq('to_user_id', userId)
      .eq('message_type', 'direct')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Get user data for each message
    const messagesWithUsers = await Promise.all(
      messages.map(async (message: any) => {
        const fromUserData = await supabase
          .from('users')
          .select('first_name, last_name, email, department, role')
          .eq('id', message.from_user_id)
          .single();
        
        return {
          ...message,
          from_user: fromUserData.data,
        };
      })
    );

    return messagesWithUsers as InterDepartmentMessage[];
  }

  // Get broadcast messages for the current user's department
  static async getReceivedBroadcastMessages(userId: string, userDepartment: string): Promise<InterDepartmentMessage[]> {
    // Get messages sent to user's department where they are a recipient
    const { data: recipients, error } = await supabase
      .from('message_recipients')
      .select(`
        *,
        message:inter_department_messages(*)
      `)
      .eq('recipient_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get user data for each message and transform
    const messagesWithUsers = await Promise.all(
      recipients.map(async (recipient: any) => {
        const fromUserData = await supabase
          .from('users')
          .select('first_name, last_name, email, department, role')
          .eq('id', recipient.message.from_user_id)
          .single();

        return {
          ...recipient.message,
          status: recipient.status as 'sent' | 'delivered' | 'read' | 'acknowledged',
          read_at: recipient.read_at,
          acknowledged_at: recipient.acknowledged_at,
          from_user: fromUserData.data,
        };
      })
    );

    return messagesWithUsers as InterDepartmentMessage[];
  }

  // Mark a message as read
  static async markAsRead(messageId: string, userId: string, isDirectMessage: boolean = true): Promise<void> {
    if (isDirectMessage) {
      const { error } = await supabase
        .from('inter_department_messages')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('to_user_id', userId);

      if (error) throw error;
    } else {
      // For broadcast messages, update the recipient record
      const { error } = await supabase
        .from('message_recipients')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('message_id', messageId)
        .eq('recipient_user_id', userId);

      if (error) throw error;
    }
  }

  // Acknowledge a message
  static async acknowledgeMessage(messageId: string, userId: string, isDirectMessage: boolean = true): Promise<void> {
    if (isDirectMessage) {
      const { error } = await supabase
        .from('inter_department_messages')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('to_user_id', userId);

      if (error) throw error;
    } else {
      // For broadcast messages, update the recipient record
      const { error } = await supabase
        .from('message_recipients')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('message_id', messageId)
        .eq('recipient_user_id', userId);

      if (error) throw error;
    }
  }

  // Get all users by department (for HOD-to-HOD communication)
  static async getUsersByDepartment(department?: string): Promise<Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
  }>> {
    let query = supabase
      .from('users')
      .select('id, first_name, last_name, email, department, role')
      .eq('is_active', true);

    if (department) {
      query = query.eq('department', department);
    }

    const { data, error } = await query.order('first_name');

    if (error) throw error;
    return data;
  }

  // Get all HODs (for cross-department communication)
  static async getAllHODs(): Promise<Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    role: string;
  }>> {
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, department, role')
      .eq('role', 'HOD')
      .eq('is_active', true)
      .order('department');

    if (error) throw error;
    return data;
  }

  // Get message statistics for dashboard
  static async getMessageStats(userId: string): Promise<{
    unreadCount: number;
    pendingResponseCount: number;
    totalSentToday: number;
  }> {
    // Count unread direct messages
    const { count: unreadDirect } = await supabase
      .from('inter_department_messages')
      .select('id', { count: 'exact' })
      .eq('to_user_id', userId)
      .eq('status', 'sent');

    // Count unread broadcast messages
    const { count: unreadBroadcast } = await supabase
      .from('message_recipients')
      .select('id', { count: 'exact' })
      .eq('recipient_user_id', userId)
      .eq('status', 'sent');

    // Count messages requiring response
    const { count: pendingResponse } = await supabase
      .from('inter_department_messages')
      .select('id', { count: 'exact' })
      .eq('to_user_id', userId)
      .eq('requires_response', true)
      .in('status', ['sent', 'read']);

    // Count messages sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: sentToday } = await supabase
      .from('inter_department_messages')
      .select('id', { count: 'exact' })
      .eq('from_user_id', userId)
      .gte('created_at', today.toISOString());

    return {
      unreadCount: (unreadDirect || 0) + (unreadBroadcast || 0),
      pendingResponseCount: pendingResponse || 0,
      totalSentToday: sentToday || 0,
    };
  }
}