
import { Department, Document, DocumentStatus, DocumentType, User, UserRole, AuditLog } from "./types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "cmd@hospital.org",
    firstName: "James",
    lastName: "Wilson",
    role: UserRole.CMD,
    department: Department.ADMIN,
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user-2",
    email: "radiology-hod@hospital.org",
    firstName: "Sarah",
    lastName: "Johnson",
    role: UserRole.HOD,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    email: "dental-hod@hospital.org",
    firstName: "Michael",
    lastName: "Chen",
    role: UserRole.HOD,
    department: Department.DENTAL,
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-4",
    email: "radiology-staff@hospital.org",
    firstName: "Lisa",
    lastName: "Garcia",
    role: UserRole.STAFF,
    department: Department.RADIOLOGY,
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "user-5",
    email: "antenatal-staff@hospital.org",
    firstName: "Robert",
    lastName: "Taylor",
    role: UserRole.STAFF,
    department: Department.ANTENATAL,
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "user-6",
    email: "admin@hospital.org",
    firstName: "Alex",
    lastName: "Morgan",
    role: UserRole.ADMIN,
    department: Department.IT,
    avatarUrl: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "user-7",
    email: "eyeclinic-hod@hospital.org",
    firstName: "Emily",
    lastName: "Patel",
    role: UserRole.HOD,
    department: Department.EYE_CLINIC,
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "user-8",
    email: "physio-staff@hospital.org",
    firstName: "David",
    lastName: "Okafor",
    role: UserRole.STAFF,
    department: Department.PHYSIOTHERAPY,
    avatarUrl: "https://i.pravatar.cc/150?img=10"
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Monthly Radiology Report - May 2025",
    type: DocumentType.REPORT,
    department: Department.RADIOLOGY,
    uploadedBy: "user-4",
    uploadedAt: new Date(2025, 4, 15),
    modifiedAt: new Date(2025, 4, 15),
    status: DocumentStatus.UNDER_REVIEW,
    fileUrl: "/documents/radiology-report-may.pdf",
    fileSize: 2450000,
    fileType: "application/pdf",
    description: "Monthly report on radiology activities and outcomes",
    tags: ["report", "monthly", "radiology"],
    priority: "medium",
    assignedTo: ["user-2"],
    currentApprover: "user-2",
    approvalChain: ["user-2", "user-1"],
    version: 1,
    comments: []
  },
  {
    id: "doc-2",
    name: "Dental Procedures Manual 2025",
    type: DocumentType.PROCEDURE,
    department: Department.DENTAL,
    uploadedBy: "user-3",
    uploadedAt: new Date(2025, 3, 10),
    modifiedAt: new Date(2025, 3, 15),
    status: DocumentStatus.APPROVED,
    fileUrl: "/documents/dental-procedures-manual.pdf",
    fileSize: 5230000,
    fileType: "application/pdf",
    description: "Updated dental procedures and protocols",
    tags: ["dental", "procedures", "manual"],
    priority: "high",
    assignedTo: [],
    approvalChain: ["user-3", "user-1"],
    version: 2,
    comments: []
  },
  {
    id: "doc-3",
    name: "Antenatal Care Guidelines Q3 2025",
    type: DocumentType.POLICY,
    department: Department.ANTENATAL,
    uploadedBy: "user-5",
    uploadedAt: new Date(2025, 5, 1),
    modifiedAt: new Date(2025, 5, 1),
    status: DocumentStatus.SUBMITTED,
    fileUrl: "/documents/antenatal-guidelines-q3.pdf",
    fileSize: 1780000,
    fileType: "application/pdf",
    description: "Q3 antenatal care guidelines and best practices",
    tags: ["antenatal", "guidelines", "care"],
    priority: "high",
    assignedTo: ["user-1"],
    currentApprover: "user-1",
    approvalChain: ["user-1"],
    version: 1,
    comments: []
  },
  {
    id: "doc-4",
    name: "Eye Clinic Patient Protocols",
    type: DocumentType.PROCEDURE,
    department: Department.EYE_CLINIC,
    uploadedBy: "user-7",
    uploadedAt: new Date(2025, 2, 20),
    modifiedAt: new Date(2025, 2, 25),
    status: DocumentStatus.APPROVED,
    fileUrl: "/documents/eye-clinic-protocols.pdf",
    fileSize: 3250000,
    fileType: "application/pdf",
    description: "Standard protocols for eye clinic patient care",
    tags: ["eye clinic", "protocols", "patient care"],
    priority: "medium",
    assignedTo: [],
    approvalChain: ["user-7", "user-1"],
    version: 1,
    comments: []
  },
  {
    id: "doc-5",
    name: "Physiotherapy Equipment Manual",
    type: DocumentType.PROCEDURE,
    department: Department.PHYSIOTHERAPY,
    uploadedBy: "user-8",
    uploadedAt: new Date(2025, 5, 5),
    modifiedAt: new Date(2025, 5, 5),
    status: DocumentStatus.DRAFT,
    fileUrl: "/documents/physio-equipment-manual.pdf",
    fileSize: 1540000,
    fileType: "application/pdf",
    description: "Manual for physiotherapy equipment usage and maintenance",
    tags: ["physiotherapy", "equipment", "manual"],
    priority: "medium",
    version: 1,
    comments: []
  },
  {
    id: "doc-6",
    name: "A&E Emergency Response Protocol",
    type: DocumentType.PROCEDURE,
    department: Department.A_AND_E,
    uploadedBy: "user-1",
    uploadedAt: new Date(2025, 4, 28),
    modifiedAt: new Date(2025, 4, 30),
    status: DocumentStatus.APPROVED,
    fileUrl: "/documents/emergency-response-protocol.pdf",
    fileSize: 2890000,
    fileType: "application/pdf",
    description: "Protocol for emergency response in A&E department",
    tags: ["emergency", "protocol", "A&E"],
    priority: "urgent",
    assignedTo: [],
    approvalChain: ["user-1"],
    version: 2,
    comments: []
  }
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    documentId: "doc-1",
    userId: "user-4",
    action: "create",
    timestamp: new Date(2025, 4, 15, 9, 30),
    details: "Document created and submitted for review"
  },
  {
    id: "audit-2",
    documentId: "doc-1",
    userId: "user-2",
    action: "view",
    timestamp: new Date(2025, 4, 15, 11, 15),
    details: "Document viewed by HOD"
  },
  {
    id: "audit-3",
    documentId: "doc-2",
    userId: "user-3",
    action: "create",
    timestamp: new Date(2025, 3, 10, 14, 45),
    details: "Document created"
  },
  {
    id: "audit-4",
    documentId: "doc-2",
    userId: "user-3",
    action: "update",
    timestamp: new Date(2025, 3, 12, 10, 20),
    details: "Document updated with new procedures"
  },
  {
    id: "audit-5",
    documentId: "doc-2",
    userId: "user-1",
    action: "approve",
    timestamp: new Date(2025, 3, 15, 16, 0),
    details: "Document approved by CMD"
  },
  {
    id: "audit-6",
    documentId: "doc-3",
    userId: "user-5",
    action: "create",
    timestamp: new Date(2025, 5, 1, 9, 0),
    details: "Document created and submitted for review"
  },
  {
    id: "audit-7",
    documentId: "doc-4",
    userId: "user-7",
    action: "create",
    timestamp: new Date(2025, 2, 20, 11, 30),
    details: "Document created"
  },
  {
    id: "audit-8",
    documentId: "doc-4",
    userId: "user-1",
    action: "approve",
    timestamp: new Date(2025, 2, 25, 14, 15),
    details: "Document approved by CMD"
  },
  {
    id: "audit-9",
    documentId: "doc-5",
    userId: "user-8",
    action: "create",
    timestamp: new Date(2025, 5, 5, 10, 45),
    details: "Document draft created"
  },
  {
    id: "audit-10",
    documentId: "doc-6",
    userId: "user-1",
    action: "create",
    timestamp: new Date(2025, 4, 28, 8, 30),
    details: "Document created"
  },
  {
    id: "audit-11",
    documentId: "doc-6",
    userId: "user-1",
    action: "update",
    timestamp: new Date(2025, 4, 30, 9, 15),
    details: "Document updated with revised protocols"
  },
  {
    id: "audit-12",
    documentId: "doc-6",
    userId: "user-1",
    action: "approve",
    timestamp: new Date(2025, 4, 30, 10, 0),
    details: "Document approved"
  }
];
