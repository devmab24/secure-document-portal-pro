
import { MockDocument, MockUser, MockFormSubmission } from '../../mock-db/index';
import { DocumentsAPI } from './api/documents';
import { UsersAPI } from './api/users';
import { FormSubmissionsAPI } from './api/formSubmissions';
import { DocumentSharingService, DocumentSubmission } from './documentSharingService';
import { UserRole, Department, DocumentStatus } from '@/lib/types';

export class MockDataService {
  // Document Exchange Operations
  static async sendDocumentFromCmdToHod(
    documentId: string, 
    fromUserId: string, 
    toUserId: string, 
    message?: string
  ): Promise<DocumentSubmission> {
    const document = await DocumentsAPI.getDocumentById(documentId);
    const fromUser = await UsersAPI.getUserById(fromUserId);
    const toUser = await UsersAPI.getUserById(toUserId);
    
    if (!document || !fromUser || !toUser) {
      throw new Error('Invalid document or user IDs');
    }
    
    if (fromUser.role !== 'CMD') {
      throw new Error('Only CMD can send documents to HODs');
    }
    
    if (toUser.role !== 'HOD') {
      throw new Error('Can only send to HOD users');
    }
    
    return DocumentSharingService.submitDocument({
      documentId,
      title: document.name,
      fromUserId,
      fromUserName: `${fromUser.firstName} ${fromUser.lastName}`,
      fromDepartment: fromUser.department,
      toUserId,
      toUserName: `${toUser.firstName} ${toUser.lastName}`,
      submissionType: 'hod-to-cmd',
      comments: message
    });
  }
  
  static async sendDocumentFromHodToStaff(
    documentId: string, 
    fromUserId: string, 
    toUserId: string, 
    message?: string
  ): Promise<DocumentSubmission> {
    const document = await DocumentsAPI.getDocumentById(documentId);
    const fromUser = await UsersAPI.getUserById(fromUserId);
    const toUser = await UsersAPI.getUserById(toUserId);
    
    if (!document || !fromUser || !toUser) {
      throw new Error('Invalid document or user IDs');
    }
    
    if (fromUser.role !== 'HOD') {
      throw new Error('Only HOD can send documents to staff');
    }
    
    if (toUser.role !== 'STAFF') {
      throw new Error('Can only send to staff users');
    }
    
    // Ensure both users are in the same department
    if (fromUser.department !== toUser.department) {
      throw new Error('HOD can only send documents to staff in their department');
    }
    
    return DocumentSharingService.submitDocument({
      documentId,
      title: document.name,
      fromUserId,
      fromUserName: `${fromUser.firstName} ${fromUser.lastName}`,
      fromDepartment: fromUser.department,
      toUserId,
      toUserName: `${toUser.firstName} ${toUser.lastName}`,
      submissionType: 'hod-to-staff',
      comments: message
    });
  }
  
  static async sendDocumentFromStaffToHod(
    documentId: string, 
    fromUserId: string, 
    toUserId: string, 
    message?: string
  ): Promise<DocumentSubmission> {
    const document = await DocumentsAPI.getDocumentById(documentId);
    const fromUser = await UsersAPI.getUserById(fromUserId);
    const toUser = await UsersAPI.getUserById(toUserId);
    
    if (!document || !fromUser || !toUser) {
      throw new Error('Invalid document or user IDs');
    }
    
    if (fromUser.role !== 'STAFF') {
      throw new Error('Only staff can send documents to HOD');
    }
    
    if (toUser.role !== 'HOD') {
      throw new Error('Can only send to HOD users');
    }
    
    // Ensure both users are in the same department
    if (fromUser.department !== toUser.department) {
      throw new Error('Staff can only send documents to HOD in their department');
    }
    
    return DocumentSharingService.submitDocument({
      documentId,
      title: document.name,
      fromUserId,
      fromUserName: `${fromUser.firstName} ${fromUser.lastName}`,
      fromDepartment: fromUser.department,
      toUserId,
      toUserName: `${toUser.firstName} ${toUser.lastName}`,
      submissionType: 'staff-to-hod',
      comments: message
    });
  }
  
  // Document Acknowledgment Operations
  static async acknowledgeDocument(
    submissionId: string, 
    userId: string, 
    feedback?: string
  ): Promise<DocumentSubmission | null> {
    const user = await UsersAPI.getUserById(userId);
    if (!user) {
      throw new Error('Invalid user ID');
    }
    
    return DocumentSharingService.updateSubmissionStatus(
      submissionId, 
      'acknowledged', 
      feedback
    );
  }
  
  // Approval Workflows - CMD Only
  static async approveDocument(
    documentId: string, 
    approverId: string, 
    feedback?: string
  ): Promise<MockDocument> {
    const approver = await UsersAPI.getUserById(approverId);
    if (!approver) {
      throw new Error('Invalid approver ID');
    }
    
    if (approver.role !== 'CMD') {
      throw new Error('Only CMD can approve documents');
    }
    
    return DocumentsAPI.updateDocumentStatus(documentId, 'APPROVED', feedback);
  }
  
  static async rejectDocument(
    documentId: string, 
    approverId: string, 
    feedback?: string
  ): Promise<MockDocument> {
    const approver = await UsersAPI.getUserById(approverId);
    if (!approver) {
      throw new Error('Invalid approver ID');
    }
    
    if (approver.role !== 'CMD') {
      throw new Error('Only CMD can reject documents');
    }
    
    return DocumentsAPI.updateDocumentStatus(documentId, 'REJECTED', feedback);
  }
  
  // User Authentication & Role Validation
  static async authenticateUser(email: string, password: string): Promise<MockUser | null> {
    const users = await UsersAPI.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user && password === 'password') { // Mock password validation
      console.log(`Authentication successful for ${email} with role ${user.role}`);
      return user;
    }
    
    console.log(`Authentication failed for ${email}`);
    return null;
  }
  
  static async validateUserRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    const user = await UsersAPI.getUserById(userId);
    if (!user) return false;
    
    return user.role === requiredRole;
  }
  
  static async getUsersByDepartment(department: Department): Promise<MockUser[]> {
    return UsersAPI.getUsersByDepartment(department);
  }
  
  static async getHodForDepartment(department: Department): Promise<MockUser | null> {
    const users = await UsersAPI.getUsersByDepartment(department);
    return users.find(u => u.role === 'HOD') || null;
  }
  
  static async getStaffForDepartment(department: Department): Promise<MockUser[]> {
    const users = await UsersAPI.getUsersByDepartment(department);
    return users.filter(u => u.role === 'STAFF');
  }
  
  // Document Upload & Management
  static async uploadDocument(
    documentData: Omit<MockDocument, 'id' | 'uploadedAt' | 'modifiedAt' | 'version'>,
    uploaderId: string
  ): Promise<MockDocument> {
    const uploader = await UsersAPI.getUserById(uploaderId);
    if (!uploader) {
      throw new Error('Invalid uploader ID');
    }
    
    const enrichedDocumentData = {
      ...documentData,
      uploadedBy: uploaderId,
      uploadedByName: `${uploader.firstName} ${uploader.lastName}`,
      status: 'DRAFT'
    };
    
    return DocumentsAPI.createDocument(enrichedDocumentData);
  }
  
  // Dashboard Data
  static async getDashboardDataForUser(userId: string): Promise<{
    totalDocuments: number;
    pendingApprovals: number;
    recentUploads: MockDocument[];
    pendingSubmissions: DocumentSubmission[];
    departmentStats?: Record<string, number>;
  }> {
    const user = await UsersAPI.getUserById(userId);
    if (!user) {
      throw new Error('Invalid user ID');
    }
    
    let documents: MockDocument[] = [];
    let pendingSubmissions: DocumentSubmission[] = [];
    
    if (user.role === 'CMD') {
      // CMD can see all documents
      documents = await DocumentsAPI.getDocuments();
      pendingSubmissions = await DocumentSharingService.getPendingSubmissions();
    } else if (user.role === 'HOD') {
      // HOD can see department documents and submissions to them
      documents = await DocumentsAPI.getDocuments({ department: user.department });
      pendingSubmissions = await DocumentSharingService.getPendingSubmissionsForUser(userId);
    } else {
      // Staff can see their own documents and submissions to them
      documents = await DocumentsAPI.getDocuments({ userId });
      pendingSubmissions = await DocumentSharingService.getPendingSubmissionsForUser(userId);
    }
    
    const pendingApprovals = documents.filter(doc => 
      doc.status === 'SUBMITTED' || doc.status === 'UNDER_REVIEW'
    ).length;
    
    const recentUploads = documents
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5);
    
    let departmentStats: Record<string, number> | undefined;
    if (user.role === 'CMD') {
      departmentStats = documents.reduce((acc, doc) => {
        acc[doc.department] = (acc[doc.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
    
    return {
      totalDocuments: documents.length,
      pendingApprovals,
      recentUploads,
      pendingSubmissions,
      departmentStats
    };
  }
  
  // Test Data Creation
  static async createTestScenario(): Promise<void> {
    console.log('Creating test scenario with mock data...');
    
    // Test document upload
    const testDoc = await this.uploadDocument({
      name: 'Test Monthly Report',
      type: 'REPORT',
      department: 'Radiology',
      description: 'Test document for validation',
      status: 'SUBMITTED',
      fileUrl: '/test-document.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
      tags: ['test', 'monthly', 'report'],
      priority: 'medium',
      requiresSignature: true,
      isDigitalForm: false
    }, 'user-hod-radiology');
    
    console.log('Test document created:', testDoc.name);
    
    // Test document sharing
    const submission = await this.sendDocumentFromHodToStaff(
      testDoc.id,
      'user-hod-radiology',
      'user-staff-radiology-1',
      'Please review this monthly report'
    );
    
    console.log('Test document shared:', submission.title);
    
    // Test acknowledgment
    await this.acknowledgeDocument(
      submission.id,
      'user-staff-radiology-1',
      'Report reviewed and acknowledged'
    );
    
    console.log('Test scenario completed successfully!');
  }
}
