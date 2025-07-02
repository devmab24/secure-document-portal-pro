
// Mock Database Export File
// This file provides easy access to all mock data for testing

import users from './users.json';
import departments from './departments.json';
import formTemplates from './formTemplates.json';
import formSubmissions from './formSubmissions.json';
import documents from './documents.json';
import digitalSignatures from './digitalSignatures.json';
import auditLogs from './auditLogs.json';

// Type definitions for better TypeScript support
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface MockDepartment {
  id: string;
  name: string;
  code: string;
  description: string;
  hodId: string;
  staffCount: number;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface MockFormTemplate {
  id: string;
  name: string;
  description: string;
  documentType: string;
  category: string;
  accessRoles: string[];
  accessDepartments: string[];
  fields: any[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface MockFormSubmission {
  id: string;
  templateId: string;
  templateName: string;
  submittedBy: string;
  submittedByName: string;
  submittedByRole: string;
  submittedByDepartment: string;
  submittedAt: string;
  status: string;
  formData: any;
  assignedTo?: string;
  currentApprover?: string;
  approvalChain: string[];
  priority: string;
  lastModified: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface MockDocument {
  id: string;
  name: string;
  type: string;
  department: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  modifiedAt: string;
  status: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  description?: string;
  tags?: string[];
  priority?: string;
  assignedTo?: string[];
  currentApprover?: string;
  approvalChain?: string[];
  version: number;
  isDigitalForm?: boolean;
  requiresSignature?: boolean;
  approvedAt?: string;
  approvedBy?: string;
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
  signatureType: string;
  comments?: string;
  isValid: boolean;
}

export interface MockAuditLog {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userRole: string;
  userDepartment: string;
  action: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Export all mock data
export const mockDatabase = {
  users: users as MockUser[],
  departments: departments as MockDepartment[],
  formTemplates: formTemplates as MockFormTemplate[],
  formSubmissions: formSubmissions as MockFormSubmission[],
  documents: documents as MockDocument[],
  digitalSignatures: digitalSignatures as MockDigitalSignature[],
  auditLogs: auditLogs as MockAuditLog[]
};

// Helper functions for common queries
export const getUserById = (id: string): MockUser | undefined => {
  return mockDatabase.users.find(user => user.id === id);
};

export const getUsersByRole = (role: string): MockUser[] => {
  return mockDatabase.users.filter(user => user.role === role);
};

export const getUsersByDepartment = (department: string): MockUser[] => {
  return mockDatabase.users.filter(user => user.department === department);
};

export const getDepartmentById = (id: string): MockDepartment | undefined => {
  return mockDatabase.departments.find(dept => dept.id === id);
};

export const getFormTemplatesByRole = (role: string): MockFormTemplate[] => {
  return mockDatabase.formTemplates.filter(template => 
    template.accessRoles.includes(role)
  );
};

export const getFormSubmissionsByUser = (userId: string): MockFormSubmission[] => {
  return mockDatabase.formSubmissions.filter(submission => 
    submission.submittedBy === userId
  );
};

export const getDocumentsByDepartment = (department: string): MockDocument[] => {
  return mockDatabase.documents.filter(doc => doc.department === department);
};

export const getAuditLogsByDocument = (documentId: string): MockAuditLog[] => {
  return mockDatabase.auditLogs.filter(log => log.documentId === documentId);
};

export const getAuditLogsByUser = (userId: string): MockAuditLog[] => {
  return mockDatabase.auditLogs.filter(log => log.userId === userId);
};

// Statistics helpers
export const getStats = () => {
  return {
    totalUsers: mockDatabase.users.length,
    activeUsers: mockDatabase.users.filter(user => user.isActive).length,
    totalDepartments: mockDatabase.departments.length,
    totalFormTemplates: mockDatabase.formTemplates.length,
    totalFormSubmissions: mockDatabase.formSubmissions.length,
    totalDocuments: mockDatabase.documents.length,
    pendingApprovals: mockDatabase.formSubmissions.filter(sub => 
      sub.status === 'submitted' || sub.status === 'under_review'
    ).length,
    totalSignatures: mockDatabase.digitalSignatures.length,
    totalAuditLogs: mockDatabase.auditLogs.length
  };
};

export default mockDatabase;
