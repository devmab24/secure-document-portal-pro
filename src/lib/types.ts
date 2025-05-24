// User Roles Enum
export enum UserRole {
  CMD = "CMD",         // Chief Medical Director
  HOD = "HOD",         // Head of Department
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
  ADMIN = "Administration"
}

// Document Status Enum
export enum DocumentStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  ARCHIVED = "Archived"
}

// Document Types
export enum DocumentType {
  REPORT = "Report",
  POLICY = "Policy",
  PROCEDURE = "Procedure",
  FORM = "Form",
  MEMO = "Memo",
  CONTRACT = "Contract",
  OTHER = "Other"
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
  fileUrl: string;
  fileSize: number; // in bytes
  fileType: string; // MIME type
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string[]; // User IDs for reviewers
  currentApprover?: string; // User ID of current approver
  approvalChain?: string[]; // Ordered list of user IDs in approval chain
  version: number;
  comments?: Comment[];
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
  action: 'create' | 'view' | 'update' | 'delete' | 'download' | 'approve' | 'reject';
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
