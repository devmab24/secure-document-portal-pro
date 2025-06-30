
import { DocumentShare, ShareStatus, Document, User } from '@/lib/types';

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

export class DocumentSharingService {
  private static STORAGE_KEY = 'document_submissions';

  static getSubmissions(): DocumentSubmission[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveSubmissions(submissions: DocumentSubmission[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
  }

  static submitDocument(submission: Omit<DocumentSubmission, 'id' | 'submittedAt' | 'status'>): DocumentSubmission {
    const submissions = this.getSubmissions();
    const newSubmission: DocumentSubmission = {
      ...submission,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    submissions.unshift(newSubmission);
    this.saveSubmissions(submissions);
    return newSubmission;
  }

  static updateSubmissionStatus(
    submissionId: string, 
    status: DocumentSubmission['status'], 
    feedback?: string,
    digitalSignature?: DocumentSubmission['digitalSignature']
  ): DocumentSubmission | null {
    const submissions = this.getSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission) {
      submission.status = status;
      submission.reviewedAt = new Date().toISOString();
      if (feedback) submission.feedback = feedback;
      if (digitalSignature) submission.digitalSignature = digitalSignature;
      
      this.saveSubmissions(submissions);
      return submission;
    }
    
    return null;
  }

  static getSubmissionsByUser(userId: string): DocumentSubmission[] {
    return this.getSubmissions().filter(s => s.fromUserId === userId);
  }

  static getSubmissionsToUser(userId: string): DocumentSubmission[] {
    return this.getSubmissions().filter(s => s.toUserId === userId);
  }

  static getPendingSubmissions(): DocumentSubmission[] {
    return this.getSubmissions().filter(s => s.status === 'pending');
  }

  static getPendingSubmissionsForUser(userId: string): DocumentSubmission[] {
    return this.getSubmissions().filter(s => s.toUserId === userId && s.status === 'pending');
  }

  static getSubmissionsByType(type: DocumentSubmission['submissionType']): DocumentSubmission[] {
    return this.getSubmissions().filter(s => s.submissionType === type);
  }

  static getStaffSubmissionsForHod(hodUserId: string): DocumentSubmission[] {
    return this.getSubmissions().filter(s => 
      s.toUserId === hodUserId && s.submissionType === 'staff-to-hod'
    );
  }

  static getHodSubmissionsForStaff(staffUserId: string): DocumentSubmission[] {
    return this.getSubmissions().filter(s => 
      s.toUserId === staffUserId && s.submissionType === 'hod-to-staff'
    );
  }
}
