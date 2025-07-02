
import type { MockDocument } from "mock-db/index";
import type { Document } from "@/lib/types";

// Helper function to convert MockDocument to Document
export const convertMockDocumentToDocument = (mockDoc: MockDocument): Document => ({
  ...mockDoc,
  uploadedAt: new Date(mockDoc.uploadedAt),
  modifiedAt: new Date(mockDoc.modifiedAt),
  type: mockDoc.type as any, // Type assertion for enum
  department: mockDoc.department as any, // Type assertion for enum
  status: mockDoc.status as any, // Type assertion for enum
  comments: mockDoc.comments?.map(comment => ({
    ...comment,
    createdAt: new Date(comment.createdAt)
  })) || [],
  shares: mockDoc.shares?.map(share => ({
    ...share,
    sharedAt: new Date(share.sharedAt),
    receivedAt: share.receivedAt ? new Date(share.receivedAt) : undefined,
    seenAt: share.seenAt ? new Date(share.seenAt) : undefined,
    acknowledgedAt: share.acknowledgedAt ? new Date(share.acknowledgedAt) : undefined
  })) || [],
  versions: mockDoc.versions?.map(version => ({
    ...version,
    modifiedAt: new Date(version.modifiedAt)
  })) || [],
  signatures: mockDoc.signatures?.map(signature => ({
    ...signature,
    signedAt: new Date(signature.signedAt)
  })) || [],
  approvedAt: mockDoc.approvedAt ? new Date(mockDoc.approvedAt) : undefined
});
