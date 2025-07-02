import { MockDocument } from '../../../mock-db/index';

const BASE_URL = '/mock-db';

export class DocumentsAPI {
  static async getDocuments(filters?: {
    department?: string;
    status?: string;
    userId?: string;
  }): Promise<MockDocument[]> {
    const response = await fetch(`${BASE_URL}/documents.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    
    let documents: MockDocument[] = await response.json();
    
    // Apply filters
    if (filters?.department) {
      documents = documents.filter(doc => doc.department === filters.department);
    }
    
    if (filters?.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }
    
    if (filters?.userId) {
      documents = documents.filter(doc => 
        doc.uploadedBy === filters.userId || 
        doc.assignedTo?.includes(filters.userId) || 
        doc.currentApprover === filters.userId
      );
    }
    
    return documents;
  }

  static async getDocumentById(id: string): Promise<MockDocument | null> {
    const documents = await this.getDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  static async createDocument(docData: Omit<MockDocument, 'id' | 'uploadedAt' | 'modifiedAt' | 'version'>): Promise<MockDocument> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDocument: MockDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      version: 1
    };
    
    console.log('Creating document:', newDocument);
    return newDocument;
  }

  static async updateDocument(id: string, updates: Partial<MockDocument>): Promise<MockDocument> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const documents = await this.getDocuments();
    const document = documents.find(doc => doc.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const updatedDocument = {
      ...document,
      ...updates,
      modifiedAt: new Date().toISOString()
    };
    
    console.log('Updating document:', updatedDocument);
    return updatedDocument;
  }

  static async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting document:', id);
  }

  static async updateDocumentStatus(id: string, status: string, comment?: string): Promise<MockDocument> {
    return this.updateDocument(id, { 
      status, 
      modifiedAt: new Date().toISOString() 
    });
  }
}
