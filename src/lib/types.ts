
// User Roles Enum
export enum UserRole {
  CMD = "CMD",         // Chief Medical Director
  CMAC = "CMAC",       // Chairman Medical Advisory Council
  HEAD_OF_NURSING = "HEAD_OF_NURSING", // Head of Nursing
  REGISTRY = "REGISTRY", // Registry Officer
  DIRECTOR_ADMIN = "DIRECTOR_ADMIN", // Director of Administration
  CHIEF_ACCOUNTANT = "CHIEF_ACCOUNTANT", // Chief Accountant
  CHIEF_PROCUREMENT_OFFICER = "CHIEF_PROCUREMENT_OFFICER", // Chief Procurement Officer
  MEDICAL_RECORDS_OFFICER = "MEDICAL_RECORDS_OFFICER", // Medical Records Officer / Health Information Manager
  HOD = "HOD",         // Head of Department
  HEAD_OF_UNIT = "HEAD_OF_UNIT", // Head of Unit (Administrative Units)
  STAFF = "STAFF",     // Regular Staff
  ADMIN = "ADMIN",     // System Administrator
  SUPER_ADMIN = "SUPER_ADMIN"  // Super Administrator
}

// Department Enum
export enum Department {
  RADIOLOGY = "Radiology",
  DENTAL = "Dental",
  EYE_CLINIC = "Eye Clinic",
  ANTENATAL = "Antenatal",
  A_AND_E = "Accident & Emergency",
  PHYSIOTHERAPY = "Physiotherapy",
  PHARMACY = "Pharmacy",
  HR = "Human Resources",
  FINANCE = "Finance",
  IT = "Information Technology",
  ADMIN = "Administration",
  REGISTRY = "Registry",
  DIRECTOR_OF_ADMIN = "Director of Administration",
}

// Document Status Enum
export enum DocumentStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  ARCHIVED = "Archived",
  ACTIVE = "Active",
  PENDING_DISPOSAL = "Pending Disposal",
  DISPOSED = "Disposed"
}

// Document Types
export enum DocumentType {
  REPORT = "Report",
  POLICY = "Policy",
  PROCEDURE = "Procedure",
  FORM = "Form",
  MEMO = "Memo",
  CONTRACT = "Contract",
  DIRECTIVE = "Directive",
  REQUEST = "Request",
  EVALUATION = "Evaluation",
  APPLICATION = "Application",
  PATIENT_RECORD = "Patient Record",
  DISCHARGE_SUMMARY = "Discharge Summary",
  REFERRAL_LETTER = "Referral Letter",
  INCOMING_CORRESPONDENCE = "Incoming Correspondence",
  BOARD_CORRESPONDENCE = "Board Correspondence",
  ADMIN_POLICY = "Administrative Policy",
  COMPLIANCE_RECORD = "Compliance Record",
  OTHER = "Other"
}

// Document Share Status Enum
export enum ShareStatus {
  SENT = "Sent",
  RECEIVED = "Received",
  SEEN = "Seen",
  ACKNOWLEDGED = "Acknowledged"
}

// Form Field Interface
export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'richtext' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

// Form Template Interface
export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  documentType: DocumentType;
  department?: Department;
  fields: FormField[];
  category: 'clinical' | 'administrative' | 'financial' | 'operational';
}

// Document Share Interface
export interface DocumentShare {
  id: string;
  documentId: string;
  fromUserId: string;
  toUserId?: string;
  toDepartment?: Department;
  status: ShareStatus;
  message?: string;
  sharedAt: Date;
  receivedAt?: Date;
  seenAt?: Date;
  acknowledgedAt?: Date;
}

// Document Version Interface
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  name: string;
  content: any; // JSON content for digital forms or file data for uploaded docs
  modifiedBy: string; // User ID
  modifiedAt: Date;
  changeDescription?: string;
  fileUrl?: string; // For uploaded documents
  fileSize?: number;
}

// Digital Signature Interface
export interface DigitalSignature {
  id: string;
  documentId: string;
  signerId: string; // User ID of the signer
  signerName: string;
  signerRole: UserRole;
  signatureData: string; // Base64 encoded signature image or hash
  signedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  signatureType: 'approval' | 'rejection' | 'acknowledgment';
  comments?: string;
  isValid: boolean; // For signature verification
}

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
}

// Document Interface
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  department: Department;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  modifiedAt: Date;
  status: DocumentStatus;
  fileUrl?: string; // Optional for digital forms
  fileSize?: number; // in bytes
  fileType?: string; // MIME type
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string[]; // User IDs for reviewers
  currentApprover?: string; // User ID of current approver
  approvalChain?: string[]; // Ordered list of user IDs in approval chain
  version: number;
  comments?: Comment[];
  shares?: DocumentShare[]; // Track document shares
  versions?: DocumentVersion[]; // Document version history
  isDigitalForm?: boolean; // Whether this is a digital form or uploaded file
  formData?: any; // JSON data for digital forms
  templateId?: string; // Reference to form template if created from template
  signatures?: DigitalSignature[]; // Digital signatures
  isLocked?: boolean; // Whether document is locked after signing
  requiresSignature?: boolean; // Whether document requires digital signature
  
  // Registry-specific fields
  registrationNumber?: string;
  patientName?: string;
  healthcareProfessional?: string;
  
  // Both departments
  referenceNumber?: string;
  intendedRecipient?: string;
  documentCategory?: string;
  retentionScheduleDate?: Date;
  disposalStatus?: string;
  
  // Director of Admin-specific fields
  confidentialityLevel?: 'standard' | 'confidential' | 'restricted' | 'board-only';
  boardRestricted?: boolean;
  approvalRequired?: boolean;
  policyVersion?: string;
}

// Comment Interface
export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

// Audit Log Interface
export interface AuditLog {
  id: string;
  documentId: string;
  userId: string;
  action: 'create' | 'view' | 'update' | 'delete' | 'download' | 'approve' | 'reject' | 'share';
  timestamp: Date;
  details?: string;
}

// Document Stats Interface
export interface DocumentStats {
  totalDocuments: number;
  byDepartment: Record<Department, number>;
  byStatus: Record<DocumentStatus, number>;
  recentUploads: number;
  pendingApprovals: number;
}
