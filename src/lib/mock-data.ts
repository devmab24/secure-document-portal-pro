import { Department, Document, DocumentStatus, DocumentType, User, UserRole } from "./types";

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
    email: "clinical-hod@hospital.org",
    firstName: "Sarah",
    lastName: "Johnson",
    role: UserRole.HOD,
    department: Department.CLINICAL,
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    email: "hr-hod@hospital.org",
    firstName: "Michael",
    lastName: "Chen",
    role: UserRole.HOD,
    department: Department.HR,
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-4",
    email: "clinical-staff@hospital.org",
    firstName: "Lisa",
    lastName: "Garcia",
    role: UserRole.STAFF,
    department: Department.CLINICAL,
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "user-5",
    email: "finance-staff@hospital.org",
    firstName: "Robert",
    lastName: "Taylor",
    role: UserRole.STAFF,
    department: Department.FINANCE,
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
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Monthly Clinical Report - May 2025",
    type: DocumentType.REPORT,
    department: Department.CLINICAL,
    uploadedBy: "user-4",
    uploadedAt: new Date(2025, 4, 15),
    modifiedAt: new Date(2025, 4, 15),
    status: DocumentStatus.UNDER_REVIEW,
    fileUrl: "/documents/clinical-report-may.pdf",
    fileSize: 2450000,
    fileType: "application/pdf",
    description: "Monthly report on clinical activities and outcomes",
    tags: ["report", "monthly", "clinical"],
    priority: "medium",
    assignedTo: ["user-2"],
    currentApprover: "user-2",
    approvalChain: ["user-2", "user-1"],
    version: 1,
    comments: []
  },
  {
    id: "doc-2",
    name: "Employee Handbook 2025",
    type: DocumentType.POLICY,
    department: Department.HR,
    uploadedBy: "user-3",
    uploadedAt: new Date(2025, 3, 10),
    modifiedAt: new Date(2025, 3, 15),
    status: DocumentStatus.APPROVED,
    fileUrl: "/documents/employee-handbook-2025.pdf",
    fileSize: 5230000,
    fileType: "application/pdf",
    description: "Updated employee handbook with new policies",
    tags: ["policy", "hr", "handbook"],
    priority: "high",
    assignedTo: [],
    approvalChain: ["user-3", "user-1"],
    version: 2,
    comments: []
  },
  {
    id: "doc-3",
    name: "Budget Forecast Q3 2025",
    type: DocumentType.REPORT,
    department: Department.FINANCE,
    uploadedBy: "user-5",
    uploadedAt: new Date(2025, 5, 1),
    modifiedAt: new Date(2025, 5, 1),
    status: DocumentStatus.SUBMITTED,
    fileUrl: "/documents/budget-forecast-q3.xlsx",
    fileSize: 1780000,
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    description: "Q3 budget forecast and analysis",
    tags: ["budget", "forecast", "finance", "quarterly"],
    priority: "high",
    assignedTo: ["user-1"],
    currentApprover: "user-1",
    approvalChain: ["user-1"],
    version: 1,
    comments: []
  },
  {
    id: "doc-4",
    name: "COVID-19 Safety Protocols",
    type: DocumentType.PROCEDURE,
    department: Department.CLINICAL,
    uploadedBy: "user-2",
    uploadedAt: new Date(2025, 2, 20),
    modifiedAt: new Date(2025, 2, 25),
    status: DocumentStatus.APPROVED,
    fileUrl: "/documents/covid-safety-protocols.pdf",
    fileSize: 3250000,
    fileType: "application/pdf",
    description: "Updated safety protocols for COVID-19 prevention",
    tags: ["covid", "safety", "protocols", "clinical"],
    priority: "urgent",
    assignedTo: [],
    approvalChain: ["user-1"],
    version: 3,
    comments: []
  },
  {
    id: "doc-5",
    name: "IT System Upgrade Plan",
    type: DocumentType.PROCEDURE,
    department: Department.IT,
    uploadedBy: "user-5",
    uploadedAt: new Date(2025, 5, 5),
    modifiedAt: new Date(2025, 5, 5),
    status: DocumentStatus.DRAFT,
    fileUrl: "/documents/it-upgrade-plan.docx",
    fileSize: 1540000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    description: "Plan for upgrading hospital IT infrastructure",
    tags: ["it", "upgrade", "infrastructure"],
    priority: "medium",
    version: 1,
    comments: []
  }
];

// Current logged in user (placeholder - will be replaced by authentication)
export const currentUser: User = mockUsers[3]; // Default to clinical staff
