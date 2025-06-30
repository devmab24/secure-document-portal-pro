
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, MessageSquare, PenTool, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';
import { format } from 'date-fns';

interface CmdReviewDialogProps {
  submission: DocumentSubmission;
  onReview: (submissionId: string, status: DocumentSubmission['status'], feedback?: string) => void;
}

export const CmdReviewDialog: React.FC<CmdReviewDialogProps> = ({ submission, onReview }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeSignature, setIncludeSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleReview = async (status: DocumentSubmission['status']) => {
    if (!user) return;

    setIsLoading(true);

    try {
      let digitalSignature;
      
      if (includeSignature && hasSignature) {
        const canvas = canvasRef.current;
        if (canvas) {
          digitalSignature = {
            signedBy: `${user.firstName} ${user.lastName}`,
            signedAt: new Date().toISOString(),
            signatureData: canvas.toDataURL()
          };
        }
      }

      DocumentSharingService.updateSubmissionStatus(
        submission.id,
        status,
        feedback.trim() || undefined,
        digitalSignature
      );

      onReview(submission.id, status, feedback.trim() || undefined);

      toast({
        title: `Document ${status}`,
        description: `The document has been ${status}.`
      });

      setIsOpen(false);
      setFeedback('');
      setIncludeSignature(false);
      clearSignature();
    } catch (error) {
      toast({
        title: "Review failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Document Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submission Details */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Submission Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Title: </span>
                {submission.title}
              </div>
              <div>
                <span className="font-medium">From: </span>
                {submission.fromUserName}
              </div>
              <div>
                <span className="font-medium">Department: </span>
                {submission.fromDepartment}
              </div>
              <div>
                <span className="font-medium">Status: </span>
                <Badge className={getStatusColor(submission.status)}>
                  {submission.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Submitted: </span>
                {format(new Date(submission.submittedAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
              {submission.comments && (
                <div className="col-span-2">
                  <span className="font-medium">Comments: </span>
                  <p className="mt-1 text-muted-foreground">{submission.comments}</p>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {submission.attachments && submission.attachments.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Attachments</h4>
              <div className="space-y-2">
                {submission.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submission.status === 'pending' && (
            <>
              <Separator />
              
              {/* Feedback */}
              <div>
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add your feedback or comments..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Digital Signature Option */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-signature"
                    checked={includeSignature}
                    onChange={(e) => setIncludeSignature(e.target.checked)}
                  />
                  <Label htmlFor="include-signature" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Include Digital Signature
                  </Label>
                </div>

                {includeSignature && (
                  <div className="border-2 border-dashed border-muted-foreground rounded-lg p-4">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="border border-border rounded cursor-crosshair bg-white w-full"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-muted-foreground">Sign above with your mouse</p>
                      <Button variant="outline" size="sm" onClick={clearSignature}>
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview('revision_requested')}
                  disabled={isLoading}
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReview('rejected')}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleReview('approved')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </>
          )}

          {/* Already Reviewed */}
          {submission.status !== 'pending' && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Review Complete</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Decision: </span>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status.replace('_', ' ')}
                  </Badge>
                </div>
                {submission.reviewedAt && (
                  <div>
                    <span className="font-medium">Reviewed: </span>
                    {format(new Date(submission.reviewedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                )}
                {submission.cmdFeedback && (
                  <div>
                    <span className="font-medium">Feedback: </span>
                    <p className="mt-1 text-muted-foreground">{submission.cmdFeedback}</p>
                  </div>
                )}
                {submission.digitalSignature && (
                  <div>
                    <span className="font-medium">Digitally Signed: </span>
                    <span className="text-green-600">Yes</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
