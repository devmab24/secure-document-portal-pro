import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SendToCmdDialog } from '@/components/SendToCmdDialog';
import { SendToStaffDialog } from '@/components/SendToStaffDialog';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadUserSubmissions, updateSubmissionStatus } from '@/store/slices/documentSharingSlice';
import { Search, Send, Clock, CheckCircle, XCircle, MessageSquare, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { NavLink } from "react-router-dom";
import { SendToHodDialog } from '@/components/SendToHodDialog';

const HodDocumentSubmissions = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { userSubmissions, loading } = useAppSelector(state => state.documentSharing);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'revision_requested'>('all');
  const [staffSubmissions, setStaffSubmissions] = useState<DocumentSubmission[]>([]);

  useEffect(() => {
    if (user) {
      dispatch(loadUserSubmissions(user.id));
      loadStaffSubmissions();
    }
  }, [user, dispatch]);

  const loadStaffSubmissions = async () => {
    if (user) {
      try {
        const staffDocs = await DocumentSharingService.getStaffSubmissionsForHod(user.id);
        setStaffSubmissions(staffDocs);
      } catch (error) {
        console.error('Error loading staff submissions:', error);
      }
    }
  };

  const handleApproveStaffDocument = async (submissionId: string) => {
    await dispatch(updateSubmissionStatus({
      submissionId,
      status: 'approved',
      feedback: 'Document approved by HOD'
    }));
    loadStaffSubmissions();
  };

  const handleRejectStaffDocument = async (submissionId: string) => {
    await dispatch(updateSubmissionStatus({
      submissionId,
      status: 'rejected',
      feedback: 'Document rejected by HOD'
    }));
    loadStaffSubmissions();
  };

  const filteredSubmissions = userSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || submission.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredStaffSubmissions = staffSubmissions.filter(submission =>
    submission.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      all: userSubmissions.length,
      pending: userSubmissions.filter(s => s.status === 'pending').length,
      approved: userSubmissions.filter(s => s.status === 'approved').length,
      rejected: userSubmissions.filter(s => s.status === 'rejected').length,
      revision_requested: userSubmissions.filter(s => s.status === 'revision_requested').length
    };
  };

  const counts = getFilterCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents submisions</h1>
          <p className="text-muted-foreground">
            Manage document communications with CMD and staff
          </p>
        </div>
        <div className="flex gap-2">
          <SendToCmdDialog trigger={
            <Button variant='outline'>
              <Send className="h-4 w-4 mr-2" />
              Send to CMD
            </Button>
          } />
          <SendToHodDialog trigger={
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send to HOD
            </Button>
          } />
          <SendToStaffDialog trigger={
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Send to Staff
            </Button>
          } />
        </div>
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

      <Tabs defaultValue="to-cmd" className="w-full">
        <TabsList>
          <TabsTrigger value="to-cmd">To CMD ({filteredSubmissions.length})</TabsTrigger>
          <TabsTrigger value="from-hod">From HODs ({filteredSubmissions.length})</TabsTrigger>
          <TabsTrigger value="from-staff">From Staff ({filteredStaffSubmissions.length})</TabsTrigger>
        </TabsList>

        {/* Documents sent to CMD */}
        <TabsContent value="to-cmd">
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
          <Card>
            <CardHeader>
              <CardTitle>Documents Sent to CMD</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No submissions found</p>
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
                            {submission.feedback && (
                              <div className="mt-2 p-2 bg-muted rounded">
                                <p><strong>CMD Feedback:</strong> {submission.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents from staff */}
        <TabsContent value="from-staff">
          <Card>
            <CardHeader>
              <CardTitle>Documents from Staff</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStaffSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents from staff</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStaffSubmissions.map((submission) => (
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
                            <p><strong>Submitted:</strong> {format(new Date(submission.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                            {submission.comments && <p><strong>Comments:</strong> {submission.comments}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApproveStaffDocument(submission.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectStaffDocument(submission.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
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

export default HodDocumentSubmissions;
