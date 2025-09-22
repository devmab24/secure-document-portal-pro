import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Send, Users, Upload, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
}

interface Document {
  id: string;
  name: string;
  description: string;
  document_type: string;
  status: string;
  created_by: string;
  created_at: string;
  file_url: string;
  priority: string;
}

interface DocumentShare {
  id: string;
  document_id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  shared_at: string;
  feedback: string | null;
  documents?: {
    name: string;
    document_type: string;
    file_url?: string;
  };
  users?: {
    first_name: string;
    last_name: string;
    role: string;
    department: string;
  };
}

export const DocumentCommunicationHub = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sentDocuments, setSentDocuments] = useState<DocumentShare[]>([]);
  const [receivedDocuments, setReceivedDocuments] = useState<DocumentShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Load current user
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userData) {
        setCurrentUser(userData);

        // Load available recipients based on user role
        await loadRecipients(userData);
        
        // Load user's documents
        await loadUserDocuments(userData.id);
        
        // Load sent and received documents
        await loadSentDocuments(userData.id);
        await loadReceivedDocuments(userData.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecipients = async (user: User) => {
    try {
      let query = supabase.from('users').select('*');
      
      // Filter recipients based on user role
      if (user.role === 'CMD') {
        // CMD can send to all HODs and Staff
        query = query.in('role', ['HOD', 'STAFF']);
      } else if (user.role === 'HOD') {
        // HOD can send to CMD and Staff in their department
        query = query.or(`role.eq.CMD,and(role.eq.STAFF,department.eq.${user.department})`);
      } else if (user.role === 'STAFF') {
        // Staff can send to HOD in their department and CMD
        query = query.or(`role.eq.CMD,and(role.eq.HOD,department.eq.${user.department})`);
      }
      
      const { data } = await query;
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  const loadUserDocuments = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });
      
      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadSentDocuments = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('document_shares')
        .select(`
          *,
          documents (name, document_type),
          users!document_shares_to_user_id_fkey (first_name, last_name, role, department)
        `)
        .eq('from_user_id', userId)
        .order('shared_at', { ascending: false });
      
      if (data) {
        setSentDocuments(data);
      }
    } catch (error) {
      console.error('Error loading sent documents:', error);
    }
  };

  const loadReceivedDocuments = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('document_shares')
        .select(`
          *,
          documents (name, document_type, file_url),
          users!document_shares_from_user_id_fkey (first_name, last_name, role, department)
        `)
        .eq('to_user_id', userId)
        .order('shared_at', { ascending: false });
      
      if (data) {
        setReceivedDocuments(data);
      }
    } catch (error) {
      console.error('Error loading received documents:', error);
    }
  };

  const handleSendDocument = async () => {
    if (!selectedDocument || !selectedRecipient || !currentUser) {
      toast({
        title: "Error",
        description: "Please select a document and recipient",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('document_shares')
        .insert({
          document_id: selectedDocument,
          from_user_id: currentUser.id,
          to_user_id: selectedRecipient,
          status: 'sent'
        });

      if (error) throw error;

      // Create inter-department message
      const recipient = users.find(u => u.id === selectedRecipient);
      if (recipient) {
        await supabase
          .from('inter_department_messages')
          .insert({
            from_user_id: currentUser.id,
            to_user_id: selectedRecipient,
            document_id: selectedDocument,
            subject: `Document Shared: ${documents.find(d => d.id === selectedDocument)?.name}`,
            message_content: message || 'A document has been shared with you.',
            priority: priority,
            message_type: 'document_share',
            status: 'sent'
          });
      }

      toast({
        title: "Success",
        description: "Document sent successfully",
      });

      // Reset form
      setSelectedDocument('');
      setSelectedRecipient('');
      setMessage('');
      setPriority('medium');

      // Reload sent documents
      loadSentDocuments(currentUser.id);
    } catch (error) {
      console.error('Error sending document:', error);
      toast({
        title: "Error",
        description: "Failed to send document",
        variant: "destructive",
      });
    }
  };

  const handleAcknowledgeDocument = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('document_shares')
        .update({ status: 'acknowledged' })
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document acknowledged",
      });

      // Reload received documents
      if (currentUser) {
        loadReceivedDocuments(currentUser.id);
      }
    } catch (error) {
      console.error('Error acknowledging document:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="p-8 text-center">Please log in to access document communications.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Document Communication Hub</h1>
          <p className="text-muted-foreground">
            Send and receive documents between departments ({currentUser.role} - {currentUser.department})
          </p>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Documents
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Received
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Document</CardTitle>
              <CardDescription>
                Share documents with other departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Document</label>
                  <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a document..." />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{doc.name}</span>
                            <Badge variant="secondary">{doc.document_type}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Recipient</label>
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose recipient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{user.first_name} {user.last_name}</span>
                            <Badge variant="outline">{user.role}</Badge>
                            <span className="text-xs text-muted-foreground">{user.department}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <Textarea
                  placeholder="Add a message for the recipient..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleSendDocument}
                className="w-full md:w-auto"
                disabled={!selectedDocument || !selectedRecipient}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <div className="grid gap-4">
            {receivedDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No documents received yet.
                </CardContent>
              </Card>
            ) : (
              receivedDocuments.map((share) => (
                <Card key={share.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{share.documents?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            From: {share.users?.first_name} {share.users?.last_name} ({share.users?.role})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(share.shared_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={share.status === 'acknowledged' ? 'default' : 'secondary'}>
                          {share.status}
                        </Badge>
                        {share.status !== 'acknowledged' && (
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledgeDocument(share.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <div className="grid gap-4">
            {sentDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No documents sent yet.
                </CardContent>
              </Card>
            ) : (
              sentDocuments.map((share) => (
                <Card key={share.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{share.documents?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            To: {share.users?.first_name} {share.users?.last_name} ({share.users?.role})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(share.shared_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={share.status === 'acknowledged' ? 'default' : 'secondary'}>
                        {share.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};