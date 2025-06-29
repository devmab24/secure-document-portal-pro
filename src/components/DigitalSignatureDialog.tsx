import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, PenTool, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Document, DigitalSignature, DocumentStatus, UserRole } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

interface DigitalSignatureDialogProps {
  document: Document;
  onSign: (signatureData: Omit<DigitalSignature, 'id' | 'signedAt'>) => void;
  loading?: boolean;
}

export const DigitalSignatureDialog = ({ document, onSign, loading }: DigitalSignatureDialogProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'approval' | 'rejection' | 'acknowledgment'>('approval');
  const [comments, setComments] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Check if user can sign this document
  const canSign = user && (
    user.role === UserRole.CMD || 
    user.role === UserRole.HOD || 
    user.role === UserRole.ADMIN ||
    user.role === UserRole.SUPER_ADMIN
  ) && (
    document.currentApprover === user.id || 
    document.assignedTo?.includes(user.id) ||
    user.role === UserRole.CMD
  );

  // Check if document is already signed by this user
  const existingSignature = document.signatures?.find(sig => sig.signerId === user?.id);
  const hasExistingSignature = Boolean(existingSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen]);

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

  const handleSign = () => {
    if (!user || !hasSignature) {
      toast.error("Please provide a signature");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get signature as base64
    const signatureData = canvas.toDataURL();

    const signature: Omit<DigitalSignature, 'id' | 'signedAt'> = {
      documentId: document.id,
      signerId: user.id,
      signerName: `${user.firstName} ${user.lastName}`,
      signerRole: user.role,
      signatureData,
      signatureType,
      comments: comments.trim() || undefined,
      isValid: true,
      ipAddress: '192.168.1.1', // In real app, get from server
      userAgent: navigator.userAgent
    };

    onSign(signature);
    setIsOpen(false);
    clearSignature();
    setComments('');
  };

  if (!canSign) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasExistingSignature ? "outline" : "default"}
          disabled={document.isLocked && hasExistingSignature}
          className="flex items-center gap-2"
        >
          <PenTool className="h-4 w-4" />
          {hasExistingSignature ? "View Signature" : "Digital Sign"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Digital Signature - {document.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Document Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type: </span>
                {document.type}
              </div>
              <div>
                <span className="font-medium">Department: </span>
                {document.department}
              </div>
              <div>
                <span className="font-medium">Status: </span>
                <Badge variant="outline">{document.status}</Badge>
              </div>
              <div>
                <span className="font-medium">Version: </span>
                v{document.version}
              </div>
            </div>
          </div>

          {/* Existing Signatures */}
          {document.signatures && document.signatures.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Existing Signatures</h4>
              <div className="space-y-2">
                {document.signatures.map((sig) => (
                  <div key={sig.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {sig.signatureType === 'approval' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : sig.signatureType === 'rejection' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium">{sig.signerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {sig.signerRole} • {format(sig.signedAt, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        {sig.comments && (
                          <p className="text-sm text-muted-foreground mt-1">"{sig.comments}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Actions */}
          {!hasExistingSignature && !document.isLocked && (
            <>
              <Separator />
              
              {/* Signature Type Selection */}
              <div>
                <Label className="text-base font-medium">Signature Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={signatureType === 'approval' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSignatureType('approval')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant={signatureType === 'rejection' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setSignatureType('rejection')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    variant={signatureType === 'acknowledgment' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setSignatureType('acknowledgment')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Acknowledge
                  </Button>
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label htmlFor="signature-comments">Comments (Optional)</Label>
                <Textarea
                  id="signature-comments"
                  placeholder="Add any comments about your decision..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Signature Canvas */}
              <div>
                <Label className="text-base font-medium">Digital Signature</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground rounded-lg p-4">
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
                    <p className="text-sm text-muted-foreground">Sign above with your mouse or touch</p>
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sign Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSign} 
                  disabled={!hasSignature || loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Signing..." : `${signatureType === 'approval' ? 'Approve' : signatureType === 'rejection' ? 'Reject' : 'Acknowledge'} & Sign`}
                </Button>
              </div>
            </>
          )}

          {/* Locked Document Message */}
          {document.isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Document Locked</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This document has been digitally signed and is now locked to prevent further modifications.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
