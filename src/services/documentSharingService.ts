
import { supabase } from "@/integrations/supabase/client";
import { NotificationService } from "./notificationService";

export interface DocumentSubmission {
  id: string;
  documentId: string;
  title: string;
  fromUserId: string;
  fromUserName: string;
  fromDepartment: string;
  toUserId: string;
  toUserName?: string;
  submissionType: 'hod-to-cmd' | 'staff-to-hod' | 'hod-to-staff';
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested' | 'acknowledged';
  submittedAt: string;
  reviewedAt?: string;
  comments?: string;
  feedback?: string;
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  digitalSignature?: {
    signedBy: string;
    signedAt: string;
    signatureData: string;
  };
}

// Map a document_shares row to our DocumentSubmission interface
function mapShareToSubmission(share: any): DocumentSubmission {
  const metadata = share.feedback ? JSON.parse(share.feedback) : {};
  return {
    id: share.id,
    documentId: share.document_id || '',
    title: metadata.title || 'Document',
    fromUserId: share.from_user_id || '',
    fromUserName: metadata.fromUserName || '',
    fromDepartment: metadata.fromDepartment || share.to_department || '',
    toUserId: share.to_user_id || '',
    toUserName: metadata.toUserName || '',
    submissionType: metadata.submissionType || 'staff-to-hod',
    status: (share.status as DocumentSubmission['status']) || 'pending',
    submittedAt: share.shared_at || new Date().toISOString(),
    reviewedAt: share.acknowledged_at || undefined,
    comments: metadata.comments,
    feedback: metadata.feedbackText,
    attachments: metadata.attachments,
    digitalSignature: metadata.digitalSignature,
  };
}

export class DocumentSharingService {
  static getSubmissions(): DocumentSubmission[] {
    // Sync fallback – kept for backward compat but prefer async methods
    const stored = localStorage.getItem('document_submissions');
    return stored ? JSON.parse(stored) : [];
  }

  static saveSubmissions(submissions: DocumentSubmission[]): void {
    localStorage.setItem('document_submissions', JSON.stringify(submissions));
  }

  static async submitDocument(
    submission: Omit<DocumentSubmission, 'id' | 'submittedAt' | 'status'>
  ): Promise<DocumentSubmission> {
    const metadata = JSON.stringify({
      title: submission.title,
      fromUserName: submission.fromUserName,
      fromDepartment: submission.fromDepartment,
      toUserName: submission.toUserName,
      submissionType: submission.submissionType,
      comments: submission.comments,
      attachments: submission.attachments,
    });

    const { data, error } = await supabase
      .from('document_shares')
      .insert({
        document_id: submission.documentId || null,
        from_user_id: submission.fromUserId,
        to_user_id: submission.toUserId,
        to_department: submission.fromDepartment,
        status: 'pending',
        feedback: metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting document:', error);
      throw error;
    }

    // Create notification for recipient
    await NotificationService.createNotification({
      userId: submission.toUserId,
      title: 'New Document Submission',
      message: `${submission.fromUserName} submitted "${submission.title}" for your review.`,
      type: 'approval',
      referenceId: data.id,
      referenceType: 'submission',
    });

    return mapShareToSubmission(data);
  }

  static async updateSubmissionStatus(
    submissionId: string,
    status: DocumentSubmission['status'],
    feedbackText?: string,
    digitalSignature?: DocumentSubmission['digitalSignature']
  ): Promise<DocumentSubmission | null> {
    // First get existing record to preserve metadata
    const { data: existing } = await supabase
      .from('document_shares')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!existing) return null;

    const existingMeta = existing.feedback ? JSON.parse(existing.feedback) : {};
    const updatedMeta = {
      ...existingMeta,
      feedbackText: feedbackText || existingMeta.feedbackText,
      digitalSignature: digitalSignature || existingMeta.digitalSignature,
    };

    const { data, error } = await supabase
      .from('document_shares')
      .update({
        status,
        acknowledged_at: new Date().toISOString(),
        feedback: JSON.stringify(updatedMeta),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating submission:', error);
      return null;
    }

    // Notify the original sender
    const statusLabel = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated';
    await NotificationService.createNotification({
      userId: existing.from_user_id,
      title: `Document ${statusLabel}`,
      message: `Your submission "${existingMeta.title || 'Document'}" has been ${statusLabel}.`,
      type: 'document',
      referenceId: submissionId,
      referenceType: 'submission',
    });

    return mapShareToSubmission(data);
  }

  static async getSubmissionsByUser(userId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('document_shares')
      .select('*')
      .eq('from_user_id', userId)
      .order('shared_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions by user:', error);
      return [];
    }
    return (data || []).map(mapShareToSubmission);
  }

  static async getSubmissionsToUser(userId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('document_shares')
      .select('*')
      .eq('to_user_id', userId)
      .order('shared_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions to user:', error);
      return [];
    }
    return (data || []).map(mapShareToSubmission);
  }

  static async getPendingSubmissions(): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('document_shares')
      .select('*')
      .eq('status', 'pending')
      .order('shared_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending submissions:', error);
      return [];
    }
    return (data || []).map(mapShareToSubmission);
  }

  static async getPendingSubmissionsForUser(userId: string): Promise<DocumentSubmission[]> {
    const { data, error } = await supabase
      .from('document_shares')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('shared_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapShareToSubmission);
  }

  static async getSubmissionsByType(type: DocumentSubmission['submissionType']): Promise<DocumentSubmission[]> {
    // Filter by submissionType stored in the feedback JSON metadata
    const { data, error } = await supabase
      .from('document_shares')
      .select('*')
      .order('shared_at', { ascending: false });

    if (error) return [];
    return (data || [])
      .map(mapShareToSubmission)
      .filter((s) => s.submissionType === type);
  }

  static async getStaffSubmissionsForHod(hodUserId: string): Promise<DocumentSubmission[]> {
    const all = await this.getSubmissionsToUser(hodUserId);
    return all.filter((s) => s.submissionType === 'staff-to-hod');
  }

  static async getHodSubmissionsForStaff(staffUserId: string): Promise<DocumentSubmission[]> {
    const all = await this.getSubmissionsToUser(staffUserId);
    return all.filter((s) => s.submissionType === 'hod-to-staff');
  }
}
