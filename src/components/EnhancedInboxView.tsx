
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PDFPreview } from './PDFPreview';
import { DocumentCommunicationService, DocumentMessage } from '@/services/documentCommunicationService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Inbox, 
  Eye, 
  CheckCircle, 
  ThumbsUp, 
  Search, 
  FileText, 
  Download,
  Clock,
  Mail,
  MailOpen
} from 'lucide-react';
import { format } from 'date-fns';

export const EnhancedInboxView: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<DocumentMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState<{fileUrl: string, fileName: string} | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'viewed' | 'acknowledged'>('all');

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = () => {
    if (!user) return;
    const inboxMessages = DocumentCommunicationService.getInboxMessages(user.id);
    setMessages(inboxMessages);
  };

  const handleViewDocument = (message: DocumentMessage) => {
    if (message.status === 'sent') {
      DocumentCommunicationService.markAsViewed(message.id, user!.id);
      loadMessages();
      toast({
        title: "Document Viewed",
        description: "Document marked as viewed"
      });
    }
    
    if (message.documentDetails.fileType === 'application/pdf') {
      setSelectedPDF({
        fileUrl: message.documentDetails.fileUrl,
        fileName: message.documentDetails.name
      });
    }
  };

  const handleAcknowledge = (message: DocumentMessage) => {
    DocumentCommunicationService.acknowledgeDocument(message.id, user!.id);
    loadMessages();
    toast({
      title: "Document Acknowledged",
      description: "Document has been acknowledged successfully"
    });
  };

  const handleApprove = (message: DocumentMessage) => {
    if (user?.role !== 'CMD') {
      toast({
        title: "Permission Denied",
        description: "Only CMD can approve documents",
        variant: "destructive"
      });
      return;
    }
    
    DocumentCommunicationService.approveDocument(message.id, user.id);
    loadMessages();
    toast({
      title: "Document Approved",
      description: "Document has been approved by CMD"
    });
  };

  const getStatusIcon = (status: string, isNew: boolean) => {
    if (isNew) return <Mail className="h-4 w-4 text-blue-600" />;
    
    switch (status) {
      case 'viewed': return <MailOpen className="h-4 w-4 text-blue-600" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'approved': return <ThumbsUp className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string, isNew: boolean) => {
    if (isNew) return 'bg-blue-100 text-blue-800 border-blue-300';
    
    switch (status) {
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.documentDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.fromUserName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'new' && message.isNew) ||
                         (filter === 'viewed' && message.status === 'viewed') ||
                         (filter === 'acknowledged' && message.status === 'acknowledged');
    
    return matchesSearch && matchesFilter;
  });

  const getFilterCounts = () => {
    return {
      all: messages.length,
      new: messages.filter(m => m.isNew).length,
      viewed: messages.filter(m => m.status === 'viewed').length,
      acknowledged: messages.filter(m => m.status === 'acknowledged').length
    };
  };

  const counts = getFilterCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Inbox</h1>
          <p className="text-muted-foreground">
            View and manage your document communications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{counts.new}</div>
            <p className="text-sm text-muted-foreground">New Messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.all}</div>
            <p className="text-sm text-muted-foreground">Total Messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts.acknowledged}</div>
            <p className="text-sm text-muted-foreground">Acknowledged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{counts.viewed}</div>
            <p className="text-sm text-muted-foreground">Viewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents or senders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'viewed', 'acknowledged'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType !== 'all' && counts[filterType] > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {counts[filterType]}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages found</p>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search' : 'No messages in your inbox'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className={`border rounded-lg p-4 ${message.isNew ? 'border-blue-300 bg-blue-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status, message.isNew)}
                        <h4 className="font-medium">{message.documentDetails.name}</h4>
                        <Badge className={getStatusColor(message.status, message.isNew)}>
                          {message.isNew ? 'NEW' : message.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>From:</strong> {message.fromUserName} ({message.fromDepartment.replace(/_/g, ' ')})</p>
                        <p><strong>Sent:</strong> {format(new Date(message.sentAt), 'MMM d, yyyy at h:mm a')}</p>
                        {message.message && <p><strong>Message:</strong> {message.message}</p>}
                        <p><strong>File:</strong> {message.documentDetails.name} ({Math.round(message.documentDetails.fileSize / 1024)} KB)</p>
                        {message.viewedAt && (
                          <p><strong>Viewed:</strong> {format(new Date(message.viewedAt), 'MMM d, yyyy at h:mm a')}</p>
                        )}
                        {message.acknowledgedAt && (
                          <p><strong>Acknowledged:</strong> {format(new Date(message.acknowledgedAt), 'MMM d, yyyy at h:mm a')}</p>
                        )}
                        {message.approvedAt && (
                          <p className="text-purple-600"><strong>Approved:</strong> {format(new Date(message.approvedAt), 'MMM d, yyyy at h:mm a')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!['acknowledged', 'approved'].includes(message.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(message)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      {user?.role === 'CMD' && message.status === 'acknowledged' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(message)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Preview Modal */}
      {selectedPDF && (
        <PDFPreview
          fileUrl={selectedPDF.fileUrl}
          fileName={selectedPDF.fileName}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};
