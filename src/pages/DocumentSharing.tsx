
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DocumentShareDialog } from '@/components/DocumentShareDialog';
import { DocumentSendDialog } from '@/components/DocumentSendDialog';
import { SharedDocumentsView } from '@/components/SharedDocumentsView';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, shareDocument, updateShareStatus } from '@/store/slices/documentSlice';
import { ShareStatus, Document, DocumentShare, User, UserRole, Department } from '@/lib/types';
import { FileText, Share, Send, Eye, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';

interface SentDocument {
  id: string;
  title: string;
  recipient: string;
  department: Department;
  status: 'sent' | 'delivered' | 'acknowledged';
  sentAt: string;
  message?: string;
  fileName?: string;
}

const DocumentSharing = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { documents, shares, loading, shareLoading } = useAppSelector(state => state.documents);
  const [sentDocuments, setSentDocuments] = useState<SentDocument[]>([]);

  // Mock users for demonstration
  const mockUsers: User[] = [
    { id: '1', email: 'john@hospital.com', firstName: 'John', lastName: 'Doe', role: 'STAFF' as any, department: 'RADIOLOGY' as any },
    { id: '2', email: 'jane@hospital.com', firstName: 'Jane', lastName: 'Smith', role: 'HOD' as any, department: 'DENTAL' as any },
    { id: '3', email: 'mike@hospital.com', firstName: 'Mike', lastName: 'Johnson', role: 'STAFF' as any, department: 'PHARMACY' as any },
  ];

  // Mock sent documents for CMD
  useEffect(() => {
    if (user && user.role === UserRole.CMD) {
      const mockSentDocuments: SentDocument[] = [
        {
          id: '1',
          title: 'Monthly Budget Report',
          recipient: 'Dr. Sarah Johnson',
          department: Department.RADIOLOGY,
          status: 'acknowledged',
          sentAt: '2024-01-15T10:30:00Z',
          message: 'Please review the budget allocation for Q1',
          fileName: 'budget_report_jan_2024.pdf'
        },
        {
          id: '2',
          title: 'Staff Training Guidelines',
          recipient: 'Dr. Michael Chen',
          department: Department.DENTAL,
          status: 'delivered',
          sentAt: '2024-01-14T14:20:00Z',
          message: 'New training protocols for dental staff'
        },
        {
          id: '3',
          title: 'Equipment Maintenance Schedule',
          recipient: 'Pharmacy Head',
          department: Department.PHARMACY,
          status: 'sent',
          sentAt: '2024-01-13T09:15:00Z'
        }
      ];
      setSentDocuments(mockSentDocuments);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDocuments({ userId: user.id }));
    }
  }, [dispatch, user]);

  const handleShare = async (shareData: Omit<DocumentShare, 'id' | 'sharedAt'>) => {
    await dispatch(shareDocument(shareData));
  };

  const handleSendDocument = async (data: {
    title: string;
    recipient: string;
    department: Department;
    message?: string;
    file?: File;
  }) => {
    // Simulate sending document
    const newSentDoc: SentDocument = {
      id: Date.now().toString(),
      title: data.title,
      recipient: data.recipient,
      department: data.department,
      status: 'sent',
      sentAt: new Date().toISOString(),
      message: data.message,
      fileName: data.file?.name
    };

    setSentDocuments(prev => [newSentDoc, ...prev]);
  };

  const handleMarkAsSeen = async (shareId: string) => {
    await dispatch(updateShareStatus({ shareId, status: ShareStatus.SEEN }));
  };

  const handleMarkAsAcknowledged = async (shareId: string) => {
    await dispatch(updateShareStatus({ shareId, status: ShareStatus.ACKNOWLEDGED }));
  };

  const getUserById = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acknowledged':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div>Please log in to access document sharing.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Share className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMD Document Sharing</h1>
          <p className="text-muted-foreground">Share documents with colleagues and departments</p>
        </div>
      </div>

      <Tabs defaultValue="send-documents" className="w-full">
        <TabsList>
          <TabsTrigger value="send-documents">Send Documents</TabsTrigger>
          <TabsTrigger value="my-documents">My Documents</TabsTrigger>
          <TabsTrigger value="shared-documents">Shared Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send-documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Document Sending
                </CardTitle>
                <DocumentSendDialog onSend={handleSendDocument} />
              </div>
            </CardHeader>
            <CardContent>
              {sentDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents sent yet</p>
                  <p className="text-sm">Use the "Send A New Document" button to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentDocuments.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium">{doc.title}</h4>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>To:</strong> {doc.recipient} ({doc.department.replace(/_/g, ' ')})</p>
                            <p><strong>Sent:</strong> {format(new Date(doc.sentAt), 'MMM d, yyyy at h:mm a')}</p>
                            {doc.message && <p><strong>Message:</strong> {doc.message}</p>}
                            {doc.fileName && <p><strong>File:</strong> {doc.fileName}</p>}
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
        
        <TabsContent value="my-documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents Available for Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents available for sharing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{document.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {document.type} • {document.department}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Shared {document.shares?.length || 0} times
                          </p>
                        </div>
                        <DocumentShareDialog
                          document={document}
                          currentUser={user}
                          onShare={handleShare}
                          availableUsers={mockUsers}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared-documents">
          <SharedDocumentsView
            shares={shares}
            currentUser={user}
            onMarkAsSeen={handleMarkAsSeen}
            onMarkAsAcknowledged={handleMarkAsAcknowledged}
            getUserById={getUserById}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentSharing;
