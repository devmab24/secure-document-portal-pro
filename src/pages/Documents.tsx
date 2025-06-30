import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments } from '@/store/slices/documentSlice';
import { Document, UserRole } from '@/lib/types';
import { Eye, Download, Send } from 'lucide-react';
import { format } from 'date-fns';
import { SendToCmdDialog } from '@/components/SendToCmdDialog';
import { SendToHodDialog } from '@/components/SendToHodDialog';
import { SendToStaffDialog } from '@/components/SendToStaffDialog';

const Documents = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector(state => state.documents);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchDocuments({ userId: user.id }));
    }
  }, [dispatch, user]);

  if (!user) {
    return <div>Please log in to view documents.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No documents available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">{document.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {document.type} • {document.department}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {format(new Date(document.uploadedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    {user?.role === UserRole.HOD && (
                      <>
                        <SendToCmdDialog 
                          document={document}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Send to CMD
                            </Button>
                          }
                        />
                        <SendToStaffDialog 
                          document={document}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Send to Staff
                            </Button>
                          }
                        />
                      </>
                    )}
                    {user?.role === UserRole.STAFF && (
                      <SendToHodDialog 
                        document={document}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Send to HOD
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
