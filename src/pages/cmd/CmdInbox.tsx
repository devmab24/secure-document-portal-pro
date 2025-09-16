
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CmdReviewDialog } from '@/components/CmdReviewDialog';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { Search, Clock, CheckCircle, XCircle, MessageSquare, FileText, Inbox, Share } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const CmdInbox = () => {
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'revision_requested'>('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const allSubmissions = DocumentSharingService.getSubmissions();
    setSubmissions(allSubmissions);
  };

  const handleReview = (submissionId: string, status: DocumentSubmission['status'], feedback?: string) => {
    // Refresh submissions after review
    loadSubmissions();
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.fromDepartment.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMD Inbox</h1>
          <p className="text-muted-foreground">
            Review document submissions from department heads
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.all}</div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
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
            placeholder="Search by title, sender, or department..."
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
          <CardTitle>Document Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No submissions found</p>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search' : 'No document submissions yet'}
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
                        {submission.status === 'pending' && (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>From:</strong> {submission.fromUserName} ({submission.fromDepartment})</p>
                        <p><strong>Submitted:</strong> {format(new Date(submission.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                        {submission.reviewedAt && (
                          <p><strong>Reviewed:</strong> {format(new Date(submission.reviewedAt), 'MMM d, yyyy at h:mm a')}</p>
                        )}
                        {submission.comments && <p><strong>Comments:</strong> {submission.comments}</p>}
                        {submission.feedback && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p><strong>Your Feedback:</strong> {submission.feedback}</p>
                          </div>
                        )}
                        {submission.digitalSignature && (
                          <p className="text-green-600"><strong>Digitally Signed</strong> on {format(new Date(submission.digitalSignature.signedAt), 'MMM d, yyyy')}</p>
                        )}
                      </div>
                      {submission.attachments && submission.attachments.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Attachments:</strong> {submission.attachments.length} file(s)</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <CmdReviewDialog
                        submission={submission}
                        onReview={handleReview}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Document Share Link */}
      <Card>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full bg-blue-600 hover:bg-blue-700 hover:text-white">
            <Link to="/dashboard/cmd/documents/sharing" className='text-white'>
              <Share className="h-4 w-4 mr-2" />
              Send a Document 
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CmdInbox;
