
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, CheckCircle, Clock, Send, FileText } from 'lucide-react';
import { DocumentShare, ShareStatus, User } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface SharedDocumentsViewProps {
  shares: DocumentShare[];
  currentUser: User;
  onMarkAsSeen?: (shareId: string) => void;
  onMarkAsAcknowledged?: (shareId: string) => void;
  getUserById?: (userId: string) => User | undefined;
}

export const SharedDocumentsView: React.FC<SharedDocumentsViewProps> = ({
  shares,
  currentUser,
  onMarkAsSeen,
  onMarkAsAcknowledged,
  getUserById
}) => {
  const getStatusIcon = (status: ShareStatus) => {
    switch (status) {
      case ShareStatus.SENT:
        return <Send className="h-4 w-4" />;
      case ShareStatus.RECEIVED:
        return <Clock className="h-4 w-4" />;
      case ShareStatus.SEEN:
        return <Eye className="h-4 w-4" />;
      case ShareStatus.ACKNOWLEDGED:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ShareStatus) => {
    switch (status) {
      case ShareStatus.SENT:
        return 'bg-blue-100 text-blue-800';
      case ShareStatus.RECEIVED:
        return 'bg-yellow-100 text-yellow-800';
      case ShareStatus.SEEN:
        return 'bg-purple-100 text-purple-800';
      case ShareStatus.ACKNOWLEDGED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sentShares = shares.filter(share => share.fromUserId === currentUser.id);
  const receivedShares = shares.filter(share => 
    share.toUserId === currentUser.id || 
    (share.toDepartment && share.toDepartment === currentUser.department)
  );

  return (
    <div className="space-y-6">
      {/* Received Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents Shared With Me ({receivedShares.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {receivedShares.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No documents have been shared with you yet.
            </p>
          ) : (
            <div className="space-y-4">
              {receivedShares.map((share) => {
                const sender = getUserById?.(share.fromUserId);
                const canMarkAsSeen = share.status === ShareStatus.RECEIVED && onMarkAsSeen;
                const canMarkAsAcknowledged = share.status === ShareStatus.SEEN && onMarkAsAcknowledged;
                
                return (
                  <div key={share.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Document ID: {share.documentId}</h4>
                        <p className="text-sm text-muted-foreground">
                          From: {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown User'}
                          {share.toDepartment && ` • To: ${share.toDepartment}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Shared {formatDistanceToNow(share.sharedAt)} ago
                        </p>
                      </div>
                      <Badge className={getStatusColor(share.status)}>
                        {getStatusIcon(share.status)}
                        <span className="ml-1">{share.status}</span>
                      </Badge>
                    </div>
                    
                    {share.message && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{share.message}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {canMarkAsSeen && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onMarkAsSeen(share.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Mark as Seen
                        </Button>
                      )}
                      {canMarkAsAcknowledged && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onMarkAsAcknowledged(share.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Sent Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Documents I've Shared ({sentShares.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sentShares.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              You haven't shared any documents yet.
            </p>
          ) : (
            <div className="space-y-4">
              {sentShares.map((share) => {
                const recipient = share.toUserId ? getUserById?.(share.toUserId) : null;
                
                return (
                  <div key={share.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Document ID: {share.documentId}</h4>
                        <p className="text-sm text-muted-foreground">
                          To: {recipient 
                            ? `${recipient.firstName} ${recipient.lastName}` 
                            : share.toDepartment || 'Unknown Recipient'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Shared {formatDistanceToNow(share.sharedAt)} ago
                        </p>
                      </div>
                      <Badge className={getStatusColor(share.status)}>
                        {getStatusIcon(share.status)}
                        <span className="ml-1">{share.status}</span>
                      </Badge>
                    </div>
                    
                    {share.message && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{share.message}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
