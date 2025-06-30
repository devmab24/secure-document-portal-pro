
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SendToHodDialog } from '@/components/SendToHodDialog';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUserSubmissions, updateSubmissionStatus } from '@/store/slices/documentSharingSlice';
import { Search, Send, Clock, CheckCircle, MessageSquare, FileText, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';

const StaffDocumentCommunications = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { userSubmissions, loading } = useAppSelector(state => state.documentSharing);
  const [searchTerm, setSearchTerm] = useState('');
  const [receivedDocuments, setReceivedDocuments] = useState<DocumentSubmission[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(loadUserSubmissions(user.id));
      loadReceivedDocuments();
    }
  }, [user, dispatch]);

  const loadReceivedDocuments = () => {
    if (user) {
      const received = DocumentSharingService.getSubmissionsToUser(user.id);
      setReceivedDocuments(received);
    }
  };

  const handleAcknowledge = async (submissionId: string) => {
    await dispatch(updateSubmissionStatus({
      submissionId,
      status: 'acknowledged',
      feedback: 'Document acknowledged by staff member'
    }));
    loadReceivedDocuments();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4" />;
      case 'revision_requested': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredSentDocuments = userSubmissions.filter(submission =>
    submission.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceivedDocuments = receivedDocuments.filter(submission =>
    submission.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Communications</h1>
          <p className="text-muted-foreground">
            Send documents to your HOD and view communications
          </p>
        </div>
        <SendToHodDialog trigger={
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Send className="h-4 w-4 mr-2" />
            Send to HOD
          </Button>
        } />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="sent" className="w-full">
        <TabsList>
          <TabsTrigger value="sent">Documents Sent ({filteredSentDocuments.length})</TabsTrigger>
          <TabsTrigger value="received">Documents Received ({filteredReceivedDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Documents Sent to HOD</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
              ) : filteredSentDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents sent yet</p>
                  <p className="text-sm">Send your first document to HOD to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSentDocuments.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{submission.title}</h4>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Sent:</strong> {format(new Date(submission.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                            {submission.reviewedAt && (
                              <p><strong>Reviewed:</strong> {format(new Date(submission.reviewedAt), 'MMM d, yyyy at h:mm a')}</p>
                            )}
                            {submission.comments && <p><strong>Your Comments:</strong> {submission.comments}</p>}
                            {submission.feedback && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <p><strong>HOD Feedback:</strong> {submission.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>Documents from HOD</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredReceivedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents received yet</p>
                  <p className="text-sm">Documents from your HOD will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReceivedDocuments.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{submission.title}</h4>
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">{submission.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>From:</strong> {submission.fromUserName}</p>
                            <p><strong>Received:</strong> {format(new Date(submission.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                            {submission.comments && <p><strong>Comments:</strong> {submission.comments}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {submission.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledge(submission.id)}
                            >
                              Acknowledge
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDocumentCommunications;
