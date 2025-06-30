
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SendToCmdDialog } from '@/components/SendToCmdDialog';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Send, Clock, CheckCircle, XCircle, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';

const HodDocumentSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'revision_requested'>('all');

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  const loadSubmissions = () => {
    if (user) {
      const userSubmissions = DocumentSharingService.getSubmissionsByUser(user.id);
      setSubmissions(userSubmissions);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || submission.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'revision_requested': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getFilterCounts = () => {
    return {
      all: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      revision_requested: submissions.filter(s => s.status === 'revision_requested').length
    };
  };

  const counts = getFilterCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Submissions</h1>
          <p className="text-muted-foreground">
            Send documents to CMD for review and track their status
          </p>
        </div>
        <SendToCmdDialog trigger={
          <Button className="bg-hospital-600 hover:bg-hospital-700">
            <Send className="h-4 w-4 mr-2" />
            Send New Document
          </Button>
        } />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.all}</div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{counts.pending}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.revision_requested}</div>
            <p className="text-sm text-muted-foreground">Needs Revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'revision_requested'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              {status !== 'all' && counts[status] > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {counts[status]}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No submissions found</p>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search' : 'Send your first document to CMD to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
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
                        <p><strong>Submitted:</strong> {format(new Date(submission.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                        {submission.reviewedAt && (
                          <p><strong>Reviewed:</strong> {format(new Date(submission.reviewedAt), 'MMM d, yyyy at h:mm a')}</p>
                        )}
                        {submission.comments && <p><strong>Your Comments:</strong> {submission.comments}</p>}
                        {submission.cmdFeedback && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p><strong>CMD Feedback:</strong> {submission.cmdFeedback}</p>
                          </div>
                        )}
                        {submission.digitalSignature && (
                          <p className="text-green-600"><strong>Digitally Signed</strong> by {submission.digitalSignature.signedBy}</p>
                        )}
                      </div>
                      {submission.attachments && submission.attachments.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Attachments:</strong> {submission.attachments.length} file(s)</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.status === 'revision_requested' && (
                        <SendToCmdDialog 
                          document={{ id: submission.documentId, name: submission.title }}
                          trigger={
                            <Button size="sm" variant="outline">
                              <Send className="h-4 w-4 mr-1" />
                              Resubmit
                            </Button>
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HodDocumentSubmissions;
