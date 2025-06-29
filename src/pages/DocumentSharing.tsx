
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentShareDialog } from '@/components/DocumentShareDialog';
import { SharedDocumentsView } from '@/components/SharedDocumentsView';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, shareDocument, updateShareStatus } from '@/store/slices/documentSlice';
import { ShareStatus, Document, DocumentShare, User } from '@/lib/types';
import { FileText, Share } from 'lucide-react';

const DocumentSharing = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { documents, shares, loading, shareLoading } = useAppSelector(state => state.documents);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Mock users for demonstration
  const mockUsers: User[] = [
    { id: '1', email: 'john@hospital.com', firstName: 'John', lastName: 'Doe', role: 'STAFF' as any, department: 'Radiology' as any },
    { id: '2', email: 'jane@hospital.com', firstName: 'Jane', lastName: 'Smith', role: 'HOD' as any, department: 'Dental' as any },
    { id: '3', email: 'mike@hospital.com', firstName: 'Mike', lastName: 'Johnson', role: 'STAFF' as any, department: 'Pharmacy' as any },
  ];

  useEffect(() => {
    if (user) {
      dispatch(fetchDocuments({ userId: user.id }));
    }
  }, [dispatch, user]);

  const handleShare = async (shareData: Omit<DocumentShare, 'id' | 'sharedAt'>) => {
    await dispatch(shareDocument(shareData));
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

      <Tabs defaultValue="my-documents" className="w-full">
        <TabsList>
          <TabsTrigger value="my-documents">My Documents</TabsTrigger>
          <TabsTrigger value="shared-documents">Shared Documents</TabsTrigger>
        </TabsList>
        
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
