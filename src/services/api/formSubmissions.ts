
import { MockFormSubmission } from '../../mock-db';

const BASE_URL = '/mock-db';

export class FormSubmissionsAPI {
  static async getFormSubmissions(filters?: {
    submittedBy?: string;
    assignedTo?: string;
    status?: string;
    templateId?: string;
  }): Promise<MockFormSubmission[]> {
    const response = await fetch(`${BASE_URL}/formSubmissions.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch form submissions');
    }
    
    let submissions: MockFormSubmission[] = await response.json();
    
    // Apply filters
    if (filters?.submittedBy) {
      submissions = submissions.filter(sub => sub.submittedBy === filters.submittedBy);
    }
    
    if (filters?.assignedTo) {
      submissions = submissions.filter(sub => sub.assignedTo === filters.assignedTo);
    }
    
    if (filters?.status) {
      submissions = submissions.filter(sub => sub.status === filters.status);
    }
    
    if (filters?.templateId) {
      submissions = submissions.filter(sub => sub.templateId === filters.templateId);
    }
    
    return submissions;
  }

  static async getSubmissionById(id: string): Promise<MockFormSubmission | null> {
    const submissions = await this.getFormSubmissions();
    return submissions.find(sub => sub.id === id) || null;
  }

  static async createSubmission(submissionData: Omit<MockFormSubmission, 'id' | 'submittedAt' | 'lastModified'>): Promise<MockFormSubmission> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSubmission: MockFormSubmission = {
      ...submissionData,
      id: `form-sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    console.log('Creating form submission:', newSubmission);
    return newSubmission;
  }

  static async updateSubmissionStatus(id: string, status: string, feedback?: string): Promise<MockFormSubmission> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const submissions = await this.getFormSubmissions();
    const submission = submissions.find(sub => sub.id === id);
    if (!submission) {
      throw new Error('Form submission not found');
    }
    
    const updatedSubmission = {
      ...submission,
      status,
      lastModified: new Date().toISOString(),
      ...(status === 'approved' && { approvedAt: new Date().toISOString() }),
      ...(feedback && { feedback })
    };
    
    console.log('Updating form submission:', updatedSubmission);
    return updatedSubmission;
  }
}
