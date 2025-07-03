
import { MockDocument, MockUser } from 'mock-db/index';
import { UserRole, Department } from '@/lib/types';
import { mockUsers } from '@/lib/mock/users';

interface DocumentMessage {
  id: string;
  documentId: string;
  fromUserId: string;
  fromUserName: string;
  fromDepartment: Department;
  toUserId: string;
  toUserName: string;
  toDepartment: Department;
  message?: string;
  status: 'sent' | 'delivered' | 'viewed' | 'acknowledged' | 'approved' | 'rejected';
  sentAt: string;
  viewedAt?: string;
  acknowledgedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  isNew: boolean;
  documentDetails: {
    name: string;
    type: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  };
}

interface AuditLogEntry {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  action: 'sent' | 'received' | 'viewed' | 'acknowledged' | 'approved' | 'rejected';
  timestamp: string;
  details: string;
  fromRole: UserRole;
  toRole?: UserRole;
}

class DocumentCommunicationService {
  private static messages: DocumentMessage[] = [];
  private static auditLog: AuditLogEntry[] = [];

  static initializeMockData() {
    // Create some sample document messages
    const sampleMessages: DocumentMessage[] = [
      {
        id: 'msg-001',
        documentId: 'doc-001',
        fromUserId: 'user-cmd-1',
        fromUserName: 'Dr. CMD Admin',
        fromDepartment: Department.ADMIN,
        toUserId: 'user-hod-radiology',
        toUserName: 'Dr. Sarah Johnson',
        toDepartment: Department.RADIOLOGY,
        message: 'Please review this budget report for Q1 2024',
        status: 'sent',
        sentAt: new Date().toISOString(),
        isNew: true,
        documentDetails: {
          name: 'Q1 Budget Report',
          type: 'REPORT',
          fileUrl: '/sample-budget.pdf',
          fileSize: 1024000,
          fileType: 'application/pdf'
        }
      },
      {
        id: 'msg-002',
        documentId: 'doc-002',
        fromUserId: 'user-hod-radiology',
        fromUserName: 'Dr. Sarah Johnson',
        fromDepartment: Department.RADIOLOGY,
        toUserId: 'user-staff-radiology-1',
        toUserName: 'Dr. Mike Wilson',
        toDepartment: Department.RADIOLOGY,
        message: 'New safety protocols for radiology equipment',
        status: 'acknowledged',
        sentAt: new Date(Date.now() - 86400000).toISOString(),
        acknowledgedAt: new Date().toISOString(),
        isNew: false,
        documentDetails: {
          name: 'Safety Protocols Update',
          type: 'POLICY',
          fileUrl: '/sample-safety.pdf',
          fileSize: 512000,
          fileType: 'application/pdf'
        }
      }
    ];

    this.messages = sampleMessages;
    this.generateAuditTrail();
  }

  static sendDocument(data: {
    documentId: string;
    fromUserId: string;
    toUserId: string;
    message?: string;
    documentDetails: DocumentMessage['documentDetails'];
  }): DocumentMessage {
    const fromUser = mockUsers.find(u => u.id === data.fromUserId);
    const toUser = mockUsers.find(u => u.id === data.toUserId);

    if (!fromUser || !toUser) {
      throw new Error('User not found');
    }

    const newMessage: DocumentMessage = {
      id: `msg-${Date.now()}`,
      documentId: data.documentId,
      fromUserId: data.fromUserId,
      fromUserName: `${fromUser.firstName} ${fromUser.lastName}`,
      fromDepartment: fromUser.department,
      toUserId: data.toUserId,
      toUserName: `${toUser.firstName} ${toUser.lastName}`,
      toDepartment: toUser.department,
      message: data.message,
      status: 'sent',
      sentAt: new Date().toISOString(),
      isNew: true,
      documentDetails: data.documentDetails
    };

    this.messages.push(newMessage);
    this.addAuditLogEntry({
      documentId: data.documentId,
      userId: data.fromUserId,
      userName: newMessage.fromUserName,
      action: 'sent',
      details: `Document sent to ${newMessage.toUserName}`,
      fromRole: fromUser.role,
      toRole: toUser.role
    });

    return newMessage;
  }

  static getInboxMessages(userId: string): DocumentMessage[] {
    return this.messages.filter(msg => msg.toUserId === userId);
  }

  static getSentMessages(userId: string): DocumentMessage[] {
    return this.messages.filter(msg => msg.fromUserId === userId);
  }

  static markAsViewed(messageId: string, userId: string): void {
    const message = this.messages.find(msg => msg.id === messageId && msg.toUserId === userId);
    if (message && message.status === 'sent') {
      message.status = 'viewed';
      message.viewedAt = new Date().toISOString();
      message.isNew = false;

      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        this.addAuditLogEntry({
          documentId: message.documentId,
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          action: 'viewed',
          details: `Document viewed`,
          fromRole: user.role
        });
      }
    }
  }

  static acknowledgeDocument(messageId: string, userId: string): void {
    const message = this.messages.find(msg => msg.id === messageId && msg.toUserId === userId);
    if (message && ['sent', 'viewed'].includes(message.status)) {
      message.status = 'acknowledged';
      message.acknowledgedAt = new Date().toISOString();
      message.isNew = false;

      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        this.addAuditLogEntry({
          documentId: message.documentId,
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          action: 'acknowledged',
          details: `Document acknowledged`,
          fromRole: user.role
        });
      }
    }
  }

  static approveDocument(messageId: string, userId: string): void {
    const user = mockUsers.find(u => u.id === userId);
    if (!user || user.role !== UserRole.CMD) {
      throw new Error('Only CMD can approve documents');
    }

    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.status = 'approved';
      message.approvedAt = new Date().toISOString();

      this.addAuditLogEntry({
        documentId: message.documentId,
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        action: 'approved',
        details: `Document approved by CMD`,
        fromRole: user.role
      });
    }
  }

  static getAuditLog(): AuditLogEntry[] {
    return this.auditLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private static addAuditLogEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    this.auditLog.push({
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }

  private static generateAuditTrail() {
    // Generate audit entries for existing messages
    this.messages.forEach(msg => {
      this.addAuditLogEntry({
        documentId: msg.documentId,
        userId: msg.fromUserId,
        userName: msg.fromUserName,
        action: 'sent',
        details: `Document sent to ${msg.toUserName}`,
        fromRole: mockUsers.find(u => u.id === msg.fromUserId)?.role || UserRole.STAFF,
        toRole: mockUsers.find(u => u.id === msg.toUserId)?.role || UserRole.STAFF
      });

      if (msg.acknowledgedAt) {
        this.addAuditLogEntry({
          documentId: msg.documentId,
          userId: msg.toUserId,
          userName: msg.toUserName,
          action: 'acknowledged',
          details: `Document acknowledged`,
          fromRole: mockUsers.find(u => u.id === msg.toUserId)?.role || UserRole.STAFF
        });
      }
    });
  }
}

// Initialize mock data
DocumentCommunicationService.initializeMockData();

export { DocumentCommunicationService };
export type { DocumentMessage, AuditLogEntry };
