
import { DocumentShare, ShareStatus, Document, User } from '@/lib/types';
import { FormSubmissionsAPI, apiCall } from './api';

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

  // Use localStorage as a temporary storage while we don't have a real backend
  // In production, these would be replaced with actual API calls
  static getSubmissions(): DocumentSubmission[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static saveSubmissions(submissions: DocumentSubmission[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
  }

  static async submitDocument(submission: Omit<DocumentSubmission, 'id' | 'submittedAt' | 'status'>): Promise<DocumentSubmission> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const submissions = this.getSubmissions();
    const newSubmission: DocumentSubmission = {
      ...submission,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    submissions.unshift(newSubmission);
    this.saveSubmissions(submissions);
    
    console.log('Document submitted via API:', newSubmission);
    return newSubmission;
  }

  static async updateSubmissionStatus(
    submissionId: string, 
    status: DocumentSubmission['status'], 
    feedback?: string,
    digitalSignature?: DocumentSubmission['digitalSignature']
  ): Promise<DocumentSubmission | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const submissions = this.getSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission) {
      submission.status = status;
      submission.reviewedAt = new Date().toISOString();
      if (feedback) submission.feedback = feedback;
      if (digitalSignature) submission.digitalSignature = digitalSignature;
      
      this.saveSubmissions(submissions);
      console.log('Submission status updated via API:', submission);
      return submission;
    }
    
    return null;
  }

  static async getSubmissionsByUser(userId: string): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => s.fromUserId === userId);
  }

  static async getSubmissionsToUser(userId: string): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => s.toUserId === userId);
  }

  static async getPendingSubmissions(): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => s.status === 'pending');
  }

  static async getPendingSubmissionsForUser(userId: string): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => s.toUserId === userId && s.status === 'pending');
  }

  static async getSubmissionsByType(type: DocumentSubmission['submissionType']): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => s.submissionType === type);
  }

  static async getStaffSubmissionsForHod(hodUserId: string): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => 
      s.toUserId === hodUserId && s.submissionType === 'staff-to-hod'
    );
  }

  static async getHodSubmissionsForStaff(staffUserId: string): Promise<DocumentSubmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getSubmissions().filter(s => 
      s.toUserId === staffUserId && s.submissionType === 'hod-to-staff'
    );
  }
}
