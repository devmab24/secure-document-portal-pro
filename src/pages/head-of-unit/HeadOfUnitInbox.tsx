import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Inbox, Mail, MailOpen, CheckCircle, Forward,
  FileText, User, Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ForwardToStaffDialog } from "@/components/ForwardToStaffDialog";

interface Message {
  id: string;
  subject: string;
  message_content: string;
  priority: string;
  status: string;
  created_at: string;
  read_at: string | null;
  acknowledged_at: string | null;
  from_user_id: string;
  document_id: string | null;
  metadata: any;
  from_user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const HeadOfUnitInbox = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [user?.id]);

  const fetchMessages = async () => {
    if (!user?.id) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('inter_department_messages')
        .select('*')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('first_name, last_name, email')
            .eq('id', message.from_user_id)
            .single();
          
          return {
            ...message,
            from_user: senderData || undefined
          };
        })
      );

      setMessages(messagesWithSenders as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('inter_department_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, read_at: new Date().toISOString() } : m)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const acknowledgeMessage = async (messageId: string) => {
    try {
      await supabase
        .from('inter_department_messages')
        .update({ 
          acknowledged_at: new Date().toISOString(),
          status: 'acknowledged'
        })
        .eq('id', messageId);

      setMessages(prev => 
        prev.map(m => m.id === messageId ? { 
          ...m, 
          acknowledged_at: new Date().toISOString(),
          status: 'acknowledged'
        } : m)
      );
    } catch (error) {
      console.error('Error acknowledging message:', error);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read_at) {
      markAsRead(message.id);
    }
  };

  const handleMessageForwarded = () => {
    fetchMessages();
    setSelectedMessage(null);
  };

  const unreadMessages = messages.filter(m => !m.read_at);
  const readMessages = messages.filter(m => m.read_at && !m.acknowledged_at && m.status !== 'forwarded');
  const forwardedMessages = messages.filter(m => m.status === 'forwarded');
  const acknowledgedMessages = messages.filter(m => m.acknowledged_at);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'forwarded':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Forward className="h-3 w-3 mr-1" />Forwarded</Badge>;
      case 'acknowledged':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-600"><CheckCircle className="h-3 w-3 mr-1" />Acknowledged</Badge>;
      default:
        return null;
    }
  };

  const MessageCard = ({ message }: { message: Message }) => (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        selectedMessage?.id === message.id ? 'border-primary' : ''
      } ${!message.read_at ? 'bg-primary/5' : ''}`}
      onClick={() => handleSelectMessage(message)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {message.read_at ? (
              <MailOpen className="h-5 w-5 text-muted-foreground mt-1" />
            ) : (
              <Mail className="h-5 w-5 text-primary mt-1" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium truncate ${!message.read_at ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {message.subject}
                </h4>
                <Badge className={`${getPriorityColor(message.priority)} text-white text-xs`}>
                  {message.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                From: {message.from_user?.first_name} {message.from_user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {message.status === 'forwarded' && <Forward className="h-5 w-5 text-blue-500" />}
            {message.acknowledged_at && <CheckCircle className="h-5 w-5 text-emerald-500" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Messages and documents from Director of Administration
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Message List */}
        <div className="space-y-4">
          <Tabs defaultValue="unread">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="unread" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Unread ({unreadMessages.length})
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">
                <MailOpen className="h-3 w-3 mr-1" />
                Read ({readMessages.length})
              </TabsTrigger>
              <TabsTrigger value="forwarded" className="text-xs">
                <Forward className="h-3 w-3 mr-1" />
                Forwarded ({forwardedMessages.length})
              </TabsTrigger>
              <TabsTrigger value="acknowledged" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Done ({acknowledgedMessages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="space-y-3 mt-4">
              {unreadMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No unread messages</p>
                  </CardContent>
                </Card>
              ) : (
                unreadMessages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-3 mt-4">
              {readMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <MailOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages pending action</p>
                  </CardContent>
                </Card>
              ) : (
                readMessages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))
              )}
            </TabsContent>

            <TabsContent value="forwarded" className="space-y-3 mt-4">
              {forwardedMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Forward className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No forwarded messages</p>
                  </CardContent>
                </Card>
              ) : (
                forwardedMessages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))
              )}
            </TabsContent>

            <TabsContent value="acknowledged" className="space-y-3 mt-4">
              {acknowledgedMessages.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No acknowledged messages</p>
                  </CardContent>
                </Card>
              ) : (
                acknowledgedMessages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Message Detail */}
        <Card className="h-fit sticky top-6">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedMessage.from_user?.first_name} {selectedMessage.from_user?.last_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(selectedMessage.created_at), 'PPp')}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getPriorityColor(selectedMessage.priority)} text-white`}>
                      {selectedMessage.priority}
                    </Badge>
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.message_content}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
                  {selectedMessage.read_at && selectedMessage.status !== 'forwarded' && !selectedMessage.acknowledged_at && (
                    <>
                      <ForwardToStaffDialog 
                        message={{
                          id: selectedMessage.id,
                          subject: selectedMessage.subject,
                          message_content: selectedMessage.message_content || '',
                          from_user_id: selectedMessage.from_user_id,
                          document_id: selectedMessage.document_id || undefined,
                          metadata: selectedMessage.metadata
                        }}
                        onForwarded={handleMessageForwarded}
                      />
                      <Button variant="outline" onClick={() => acknowledgeMessage(selectedMessage.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledge Only
                      </Button>
                    </>
                  )}
                  {selectedMessage.status === 'forwarded' && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      <Forward className="h-4 w-4 mr-1" />
                      Forwarded to staff
                    </Badge>
                  )}
                  {selectedMessage.acknowledged_at && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Acknowledged on {format(new Date(selectedMessage.acknowledged_at), 'PPp')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-12 text-center text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a message to view</p>
              <p className="text-sm">Click on a message from the list to see its details</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HeadOfUnitInbox;
