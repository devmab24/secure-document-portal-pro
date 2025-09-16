import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Send, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Eye,
  Calendar,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { InterDepartmentService, InterDepartmentMessage } from '@/services/interDepartmentService';
import { Department, UserRole } from '@/lib/types';

const InterDepartmentMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sentMessages, setSentMessages] = useState<InterDepartmentMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<InterDepartmentMessage[]>([]);
  const [broadcastMessages, setBroadcastMessages] = useState<InterDepartmentMessage[]>([]);
  const [allHODs, setAllHODs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageStats, setMessageStats] = useState({
    unreadCount: 0,
    pendingResponseCount: 0,
    totalSentToday: 0
  });

  // New message form state
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState<'direct' | 'broadcast'>('direct');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [requiresResponse, setRequiresResponse] = useState(false);
  const [responseDeadline, setResponseDeadline] = useState('');

  useEffect(() => {
    if (user) {
      loadMessages();
      loadHODs();
      loadStats();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [sent, direct, broadcast] = await Promise.all([
        InterDepartmentService.getSentMessages(user.id),
        InterDepartmentService.getReceivedDirectMessages(user.id),
        InterDepartmentService.getReceivedBroadcastMessages(user.id, user.department)
      ]);

      setSentMessages(sent);
      setDirectMessages(direct);
      setBroadcastMessages(broadcast);
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHODs = async () => {
    try {
      const hods = await InterDepartmentService.getAllHODs();
      setAllHODs(hods.filter(hod => hod.id !== user?.id)); // Exclude current user
    } catch (error: any) {
      console.error('Error loading HODs:', error);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const stats = await InterDepartmentService.getMessageStats(user.id);
      setMessageStats(stats);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!user) return;

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your message",
        variant: "destructive"
      });
      return;
    }

    if (messageType === 'direct' && !selectedRecipient) {
      toast({
        title: "Recipient required",
        description: "Please select a recipient for your direct message",
        variant: "destructive"
      });
      return;
    }

    if (messageType === 'broadcast' && !selectedDepartment) {
      toast({
        title: "Department required",
        description: "Please select a department for your broadcast message",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (messageType === 'direct') {
        await InterDepartmentService.sendDirectMessage({
          to_user_id: selectedRecipient,
          subject,
          message_content: messageContent,
          priority,
          requires_response: requiresResponse,
          response_deadline: responseDeadline || undefined
        });
      } else {
        await InterDepartmentService.sendDepartmentBroadcast({
          to_department: selectedDepartment,
          subject,
          message_content: messageContent,
          priority,
          requires_response: requiresResponse,
          response_deadline: responseDeadline || undefined
        });
      }

      toast({
        title: "Message sent successfully",
        description: `Your ${messageType} message has been sent`,
      });

      // Reset form
      setIsNewMessageOpen(false);
      setSelectedRecipient('');
      setSelectedDepartment('');
      setSubject('');
      setMessageContent('');
      setPriority('normal');
      setRequiresResponse(false);
      setResponseDeadline('');

      // Reload messages
      loadMessages();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string, isDirectMessage: boolean = true) => {
    try {
      await InterDepartmentService.markAsRead(messageId, user!.id, isDirectMessage);
      loadMessages();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAcknowledge = async (messageId: string, isDirectMessage: boolean = true) => {
    try {
      await InterDepartmentService.acknowledgeMessage(messageId, user!.id, isDirectMessage);
      loadMessages();
      loadStats();
      toast({
        title: "Message acknowledged",
        description: "The message has been acknowledged successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error acknowledging message",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4" />;
      case 'read': return <Eye className="h-4 w-4" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const renderMessage = (message: InterDepartmentMessage, isDirectMessage: boolean = true) => (
    <Card key={message.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{message.subject}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              {message.from_user && (
                <>
                  <span>From: {message.from_user.first_name} {message.from_user.last_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {message.from_user.department}
                  </Badge>
                </>
              )}
              {message.to_user && (
                <>
                  <span>To: {message.to_user.first_name} {message.to_user.last_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {message.to_user.department}
                  </Badge>
                </>
              )}
              {message.to_department && !message.to_user && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {message.to_department}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(message.priority)}>
                {message.priority.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {getStatusIcon(message.status)}
                <span className="capitalize">{message.status}</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(message.created_at), 'MMM dd, HH:mm')}
            </span>
          </div>
        </div>

        {message.message_content && (
          <p className="text-gray-700 mb-3">{message.message_content}</p>
        )}

        {message.requires_response && (
          <div className="flex items-center gap-2 text-amber-600 text-sm mb-3">
            <Clock className="h-4 w-4" />
            <span>Response required</span>
            {message.response_deadline && (
              <span>by {format(new Date(message.response_deadline), 'MMM dd, yyyy')}</span>
            )}
          </div>
        )}

        {/* Action buttons for received messages */}
        {(message.to_user_id === user?.id || !isDirectMessage) && message.status !== 'acknowledged' && (
          <div className="flex gap-2 pt-2 border-t">
            {message.status === 'sent' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleMarkAsRead(message.id, isDirectMessage)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Mark as Read
              </Button>
            )}
            {message.status === 'read' && (
              <Button 
                size="sm" 
                onClick={() => handleAcknowledge(message.id, isDirectMessage)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Acknowledge
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!user || (user.role !== UserRole.HOD && user.role !== UserRole.CMD)) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            Inter-department messaging is only available to HODs and CMD.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold">{messageStats.unreadCount}</p>
              </div>
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Responses</p>
                <p className="text-2xl font-bold">{messageStats.pendingResponseCount}</p>
              </div>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">{messageStats.totalSentToday}</p>
              </div>
              <Send className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Message Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inter-Department Messages</h2>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Message Type</Label>
                <Select value={messageType} onValueChange={(value: 'direct' | 'broadcast') => setMessageType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Message</SelectItem>
                    <SelectItem value="broadcast">Department Broadcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {messageType === 'direct' && (
                <div>
                  <Label>Recipient (HOD)</Label>
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a HOD..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allHODs.map((hod) => (
                        <SelectItem key={hod.id} value={hod.id}>
                          {hod.first_name} {hod.last_name} - {hod.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {messageType === 'broadcast' && (
                <div>
                  <Label>Target Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department..." />
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

              <div>
                <Label>Subject *</Label>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                />
              </div>

              <div>
                <Label>Message Content</Label>
                <Textarea 
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={requiresResponse}
                      onCheckedChange={setRequiresResponse}
                    />
                    <Label>Requires Response</Label>
                  </div>
                  
                  {requiresResponse && (
                    <div>
                      <Label>Response Deadline</Label>
                      <Input 
                        type="datetime-local"
                        value={responseDeadline}
                        onChange={(e) => setResponseDeadline(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewMessageOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={loading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages Tabs */}
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Received ({(directMessages.length + broadcastMessages.length)})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent ({sentMessages.length})
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Broadcasts ({broadcastMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Direct Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {directMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No direct messages received
                </p>
              ) : (
                directMessages.map((message) => renderMessage(message, true))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Sent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sentMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages sent yet
                </p>
              ) : (
                sentMessages.map((message) => renderMessage(message, true))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcasts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {broadcastMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No broadcast messages received
                </p>
              ) : (
                broadcastMessages.map((message) => renderMessage(message, false))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterDepartmentMessaging;