
import type { MockDocument, MockUser, MockDocumentShare, MockFormSubmission } from "mock-db/index";
import { UserRole, Department, DocumentType, DocumentStatus, ShareStatus } from "@/lib/types";

// Mock Database Service
export class MockDataService {
  
  // User Authentication
  static async authenticateUser(email: string, password: string): Promise<MockUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock users for testing
    const mockUsers: MockUser[] = [
      {
        id: 'user-cmd-1',
        email: 'cmd@hospital.org',
        firstName: 'Chief Medical',
        lastName: 'Director',
        role: UserRole.CMD,
        department: Department.ADMIN,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-hod-radiology',
        email: 'hod.radiology@hospital.org',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: UserRole.HOD,
        department: Department.RADIOLOGY,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-staff-radiology-1',
        email: 'staff.radiology@hospital.org',
        firstName: 'Dr. Mike',
        lastName: 'Wilson',
        role: UserRole.STAFF,
        department: Department.RADIOLOGY,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    return mockUsers.find(user => user.email === email) || null;
  }

  // Role Validation
  static async validateUserRole(userId: string, expectedRole: UserRole): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const roleMap: Record<string, UserRole> = {
      'user-cmd-1': UserRole.CMD,
      'user-hod-radiology': UserRole.HOD,
      'user-staff-radiology-1': UserRole.STAFF
    };

    return roleMap[userId] === expectedRole;
  }

  // Document Upload
  static async uploadDocument(
    documentData: Omit<MockDocument, 'id' | 'uploadedAt' | 'modifiedAt' | 'version'>,
    uploaderId: string
  ): Promise<MockDocument> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newDocument: MockDocument = {
      ...documentData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      version: 1,
      uploadedBy: uploaderId
    };

    return newDocument;
  }

  // Document Exchange: CMD to HOD
  static async sendDocumentFromCmdToHod(
    documentId: string,
    cmdUserId: string,
    hodUserId: string,
    message?: string
  ): Promise<MockDocumentShare> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Validate CMD role
    const isCmd = await this.validateUserRole(cmdUserId, UserRole.CMD);
    if (!isCmd) {
      throw new Error('Only CMD can send documents to HODs');
    }

    const share: MockDocumentShare = {
      id: `share-${Date.now()}`,
      documentId,
      fromUserId: cmdUserId,
      toUserId: hodUserId,
      status: ShareStatus.SENT,
      message,
      sharedAt: new Date().toISOString()
    };

    return share;
  }

  // Document Exchange: Staff to HOD
  static async sendDocumentFromStaffToHod(
    documentId: string,
    staffUserId: string,
    hodUserId: string,
    message?: string
  ): Promise<MockDocumentShare> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const share: MockDocumentShare = {
      id: `share-${Date.now()}`,
      documentId,
      fromUserId: staffUserId,
      toUserId: hodUserId,
      status: ShareStatus.SENT,
      message,
      sharedAt: new Date().toISOString()
    };

    return share;
  }

  // Document Acknowledgment
  static async acknowledgeDocument(
    shareId: string,
    userId: string,
    acknowledgmentMessage?: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`Document share ${shareId} acknowledged by ${userId}: ${acknowledgmentMessage}`);
  }

  // CMD Approval
  static async approveDocument(
    documentId: string,
    cmdUserId: string,
    approvalMessage?: string
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Validate CMD role
    const isCmd = await this.validateUserRole(cmdUserId, UserRole.CMD);
    if (!isCmd) {
      throw new Error('Only CMD can approve documents');
    }

    console.log(`Document ${documentId} approved by CMD ${cmdUserId}: ${approvalMessage}`);
  }

  // Department Users
  static async getUsersByDepartment(department: Department): Promise<MockUser[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const allUsers: MockUser[] = [
      {
        id: 'user-hod-radiology',
        email: 'hod.radiology@hospital.org',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: UserRole.HOD,
        department: Department.RADIOLOGY,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-staff-radiology-1',
        email: 'staff1.radiology@hospital.org',
        firstName: 'Dr. Mike',
        lastName: 'Wilson',
        role: UserRole.STAFF,
        department: Department.RADIOLOGY,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-staff-radiology-2',
        email: 'staff2.radiology@hospital.org',
        firstName: 'Dr. Lisa',
        lastName: 'Brown',
        role: UserRole.STAFF,
        department: Department.RADIOLOGY,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    return allUsers.filter(user => user.department === department);
  }

  static async getHodForDepartment(department: Department): Promise<MockUser | null> {
    const users = await this.getUsersByDepartment(department);
    return users.find(user => user.role === UserRole.HOD) || null;
  }

  static async getStaffForDepartment(department: Department): Promise<MockUser[]> {
    const users = await this.getUsersByDepartment(department);
    return users.filter(user => user.role === UserRole.STAFF);
  }

  // Dashboard Data
  static async getDashboardDataForUser(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock dashboard data based on user role
    const mockData = {
      totalDocuments: 25,
      pendingApprovals: 5,
      recentUploads: 8,
      departmentStats: {
        [Department.RADIOLOGY]: 12,
        [Department.DENTAL]: 8,
        [Department.EYE_CLINIC]: 3,
        [Department.ANTENATAL]: 2
      },
      pendingSubmissions: [
        {
          id: 'sub-001',
          documentId: 'doc-001',
          submittedBy: 'user-staff-radiology-1',
          status: 'submitted' as const,
          submittedAt: new Date().toISOString()
        }
      ]
    };

    return mockData;
  }

  // Create Test Scenario
  static async createTestScenario(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Create a test document
    const testDoc = await this.uploadDocument({
      name: 'Test Scenario Document',
      type: 'REPORT',
      department: 'Radiology',
      uploadedBy: 'user-hod-radiology',
      description: 'Document created for testing complete workflow',
      status: 'DRAFT',
      fileUrl: '/test-scenario.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
      tags: ['test', 'scenario'],
      priority: 'medium',
      requiresSignature: true,
      isDigitalForm: false
    }, 'user-hod-radiology');

    // Send from HOD to CMD for approval
    await this.sendDocumentFromCmdToHod(
      testDoc.id,
      'user-cmd-1',
      'user-hod-radiology',
      'Test scenario document flow'
    );

    // Approve the document
    await this.approveDocument(
      testDoc.id,
      'user-cmd-1',
      'Approved for test scenario completion'
    );

    console.log('Test scenario completed successfully');
  }
}
