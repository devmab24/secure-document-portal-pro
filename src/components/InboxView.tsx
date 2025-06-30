
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadSubmissionsToUser, loadPendingSubmissions, updateSubmissionStatus } from '@/store/slices/documentSharingSlice';
import { fetchDocuments } from '@/store/slices/documentSlice';
import { DocumentSubmission } from '@/services/documentSharingService';
import { UserRole, Department } from '@/lib/types';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Inbox,
  Send,
  ArrowDown
} from 'lucide-react';
import { format } from 'date-fns';

const InboxView = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { 
    userSubmissions, 
    pendingSubmissions, 
    loading, 
    statusUpdateLoading 
  } = useAppSelector(state => state.documentSharing);
  const { documents } = useAppSelector(state => state.documents);

  // Mock received documents for demonstration
  const [receivedDocuments, setReceivedDocuments] = useState<DocumentSubmission[]>([
    {
      id: '1',
      documentId: 'doc1',
      title: 'Budget Allocation Report Q1 2024',
      fromUserId: 'cmd1',
      fromUserName: 'CMD Office',
      fromDepartment: 'ADMINISTRATION',
      toUserId: user?.id || '',
      toUserName: user?.firstName + ' ' + user?.lastName,
      submissionType: 'hod-to-cmd',
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      comments: 'Please review and provide feedback by end of week',
      attachments: [{
        id: 'att1',
        name: 'budget_report_q1.pdf',
        size: 2048576,
        type: 'application/pdf',
        url: '#'
      }]
    },
    {
      id: '2',
      documentId: 'doc2',
      title: 'Staff Training Schedule',
      fromUserId: 'hod1',
      fromUserName: 'Dr. Sarah Johnson',
      fromDepartment: user?.department || 'RADIOLOGY',
      toUserId: user?.id || '',
      toUserName: user?.firstName + ' ' + user?.lastName,
      submissionType: 'staff-to-hod',
      status: 'acknowledged',
      submittedAt: '2024-01-14T14:20:00Z',
      reviewedAt: '2024-01-15T09:15:00Z',
      feedback: 'Schedule approved. Please proceed with implementation.'
    }
  ]);

  // Mock available department documents
  const [departmentDocuments, setDepartmentDocuments] = useState<any[]>([
    {
      id: 'dept1',
      name: 'Department Guidelines 2024',
      type: 'PDF',
      department: user?.department || 'RADIOLOGY',
      createdAt: '2024-01-10T12:00:00Z',
      createdBy: 'HOD Office',
      size: '1.5 MB'
    },
    {
      id: 'dept2',
      name: 'Equipment Maintenance Protocol',
      type: 'DOC',
      department: user?.department || 'RADIOLOGY',
      createdAt: '2024-01-08T15:30:00Z',
      createdBy: 'Technical Staff',
      size: '850 KB'
    }
  ]);

  useEffect(() => {
    if (user) {
      dispatch(loadSubmissionsToUser(user.id));
      dispatch(fetchDocuments({ userId: user.id }));
      
      if (user.role === UserRole.HOD || user.role === UserRole.ADMIN) {
        dispatch(loadPendingSubmissions());
      }
    }
  }, [dispatch, user]);

  const handleStatusUpdate = async (submissionId: string, status: DocumentSubmission['status'], feedback?: string) => {
    await dispatch(updateSubmissionStatus({ submissionId, status, feedback }));
    
    // Update local state
    setReceivedDocuments(prev => 
      prev.map(doc => 
        doc.id === submissionId 
          ? { ...doc, status, feedback, reviewedAt: new Date().toISOString() }
          : doc
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'acknowledged':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'revision_requested':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!user) {
    return <div>Please log in to access your inbox.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            View documents sent to you and available department resources
          </p>
        </div>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            Received Documents
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Department Documents
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5" />
                Documents Sent to You
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receivedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Inbox className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents received yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(doc.status)}
                            <h4 className="font-medium">{doc.title}</h4>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>From:</strong> {doc.fromUserName} ({doc.fromDepartment.replace(/_/g, ' ')})</p>
                            <p><strong>Received:</strong> {format(new Date(doc.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                            {doc.comments && <p><strong>Message:</strong> {doc.comments}</p>}
                            {doc.feedback && <p><strong>Feedback:</strong> {doc.feedback}</p>}
                            {doc.attachments && doc.attachments.length > 0 && (
                              <p><strong>Attachments:</strong> {doc.attachments.map(att => att.name).join(', ')}</p>
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
                          {doc.status === 'pending' && (user.role === UserRole.HOD || user.role === UserRole.ADMIN) && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(doc.id, 'acknowledged')}
                                disabled={statusUpdateLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Acknowledge
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStatusUpdate(doc.id, 'revision_requested', 'Please review and resubmit')}
                                disabled={statusUpdateLoading}
                              >
                                Request Revision
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

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Department Documents ({user.department?.replace(/_/g, ' ')})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No department documents available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Type:</strong> {doc.type} • <strong>Size:</strong> {doc.size}</p>
                            <p><strong>Created by:</strong> {doc.createdBy}</p>
                            <p><strong>Date:</strong> {format(new Date(doc.createdAt), 'MMM d, yyyy')}</p>
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

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Documents You've Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSubmissions.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium">{doc.title}</h4>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>To:</strong> {doc.toUserName || 'Unknown'}</p>
                            <p><strong>Sent:</strong> {format(new Date(doc.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                            {doc.feedback && <p><strong>Response:</strong> {doc.feedback}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default InboxView;
