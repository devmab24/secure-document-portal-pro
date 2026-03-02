
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Inbox, 
  Eye, 
  CheckCircle, 
  ThumbsUp, 
  Search, 
  FileText, 
  Clock,
  Mail,
  MailOpen
} from 'lucide-react';
import { format } from 'date-fns';

export const EnhancedInboxView: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'acknowledged'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSubmissions();
  }, [user]);

  const loadSubmissions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const received = await DocumentSharingService.getSubmissionsToUser(user.id);
      const sent = await DocumentSharingService.getSubmissionsByUser(user.id);
      setSubmissions([...received, ...sent]);
    } catch (error) {
      console.error('Error loading inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (submission: DocumentSubmission) => {
    try {
      await DocumentSharingService.updateSubmissionStatus(submission.id, 'acknowledged');
      await loadSubmissions();
      toast({
        title: "Document Acknowledged",
        description: "Document has been acknowledged successfully"
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to acknowledge", variant: "destructive" });
    }
  };

  const handleApprove = async (submission: DocumentSubmission) => {
    try {
      await DocumentSharingService.updateSubmissionStatus(submission.id, 'approved');
      await loadSubmissions();
      toast({
        title: "Document Approved",
        description: "Document has been approved"
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'approved': return <ThumbsUp className="h-4 w-4 text-primary" />;
      case 'rejected': return <Mail className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.fromDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || sub.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    acknowledged: submissions.filter(s => s.status === 'acknowledged').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            View and manage your document communications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{counts.all}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{counts.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
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
            <div className="text-2xl font-bold text-blue-600">{counts.approved}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
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
          {(['all', 'pending', 'acknowledged', 'approved'] as const).map((filterType) => (
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

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents found</p>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search' : 'No documents in your inbox'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((sub) => (
                <div key={sub.id} className={`border rounded-lg p-4 ${sub.status === 'pending' ? 'border-amber-300 bg-amber-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sub.status)}
                        <h4 className="font-medium">{sub.title}</h4>
                        <Badge className={getStatusColor(sub.status)}>
                          {sub.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {sub.toUserId === user?.id && sub.status === 'pending' && (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>{sub.fromUserId === user?.id ? 'To:' : 'From:'}</strong> {sub.fromUserId === user?.id ? (sub.toUserName || 'Recipient') : sub.fromUserName} ({sub.fromDepartment})</p>
                        <p><strong>Date:</strong> {format(new Date(sub.submittedAt), 'MMM d, yyyy at h:mm a')}</p>
                        {sub.comments && <p><strong>Comments:</strong> {sub.comments}</p>}
                        {sub.feedback && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p><strong>Feedback:</strong> {sub.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.toUserId === user?.id && sub.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleAcknowledge(sub)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button variant="default" size="sm" onClick={() => handleApprove(sub)}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Approve
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
    </div>
  );
};
