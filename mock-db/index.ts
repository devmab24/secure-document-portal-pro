
// Mock Database Type Definitions
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MockDepartment {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MockDocumentShare {
  id: string;
  documentId: string;
  fromUserId: string;
  toUserId?: string;
  toDepartment?: string;
  status: string;
  message?: string;
  sharedAt: string;
  receivedAt?: string;
  seenAt?: string;
  acknowledgedAt?: string;
}

export interface MockDocumentVersion {
  id: string;
  documentId: string;
  version: number;
  name: string;
  content: any;
  modifiedBy: string;
  modifiedAt: string;
  changeDescription?: string;
  fileUrl?: string;
  fileSize?: number;
}

export interface MockDigitalSignature {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signerRole: string;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
  userAgent?: string;
  signatureType: 'approval' | 'rejection' | 'acknowledgment';
  comments?: string;
  isValid: boolean;
}

export interface MockComment {
  id: string;
  documentId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface MockDocument {
  id: string;
  name: string;
  type: string; // This will be mapped to DocumentType enum
  department: string; // This will be mapped to Department enum  
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: string; // ISO date string
  modifiedAt: string; // ISO date string
  status: string; // This will be mapped to DocumentStatus enum
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string[];
  currentApprover?: string;
  approvalChain?: string[];
  version: number;
  comments?: MockComment[];
  shares?: MockDocumentShare[];
  versions?: MockDocumentVersion[];
  isDigitalForm?: boolean;
  formData?: any;
  templateId?: string;
  signatures?: MockDigitalSignature[];
  isLocked?: boolean;
  requiresSignature?: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

export interface MockFormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'richtext' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

export interface MockFormTemplate {
  id: string;
  name: string;
  description: string;
  documentType: string;
  department?: string;
  fields: MockFormField[];
  category: 'clinical' | 'administrative' | 'financial' | 'operational';
  accessRoles: string[];
  accessDepartments?: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface MockFormSubmission {
  id: string;
  templateId: string;
  submittedBy: string;
  submittedByName: string;
  assignedTo?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  formData: any;
  submittedAt: string;
  lastModified: string;
  approvedAt?: string;
  feedback?: string;
}

export interface MockAuditLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  action: 'create' | 'view' | 'update' | 'delete' | 'download' | 'approve' | 'reject' | 'share';
  timestamp: string;
  details?: string;
  ipAddress?: string;
}
