
import { AuditLog } from "../types";

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
