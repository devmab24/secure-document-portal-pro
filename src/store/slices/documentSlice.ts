import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document, DocumentStatus, DocumentShare, ShareStatus, DocumentVersion, DigitalSignature } from '@/lib/types';
import { mockDocuments } from '@/lib/mock-data';

// Async thunks for document operations
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (filters?: { department?: string; status?: DocumentStatus; userId?: string }) => {
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredDocs = [...mockDocuments];
    
    if (filters?.department) {
      filteredDocs = filteredDocs.filter(doc => doc.department === filters.department);
    }
    
    if (filters?.status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
    }
    
    if (filters?.userId) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.uploadedBy === filters.userId || 
        doc.assignedTo?.includes(filters.userId) || 
        doc.currentApprover === filters.userId
      );
    }
    
    return filteredDocs;
  }
);

export const updateDocumentStatus = createAsyncThunk(
  'documents/updateStatus',
  async ({ documentId, status, comment }: { documentId: string; status: DocumentStatus; comment?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { documentId, status, comment, timestamp: new Date() };
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentData: Partial<Document>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: documentData.name || 'Untitled Document',
      type: documentData.type!,
      department: documentData.department!,
      uploadedBy: documentData.uploadedBy!,
      uploadedAt: new Date(),
      modifiedAt: new Date(),
      status: DocumentStatus.DRAFT,
      fileUrl: documentData.fileUrl || '',
      fileSize: documentData.fileSize || 0,
      fileType: documentData.fileType || 'application/pdf',
      description: documentData.description,
      tags: documentData.tags || [],
      priority: documentData.priority || 'medium',
      version: 1,
      shares: [],
      ...documentData
    };
    
    return newDocument;
  }
);

export const shareDocument = createAsyncThunk(
  'documents/share',
  async (shareData: Omit<DocumentShare, 'id' | 'sharedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newShare: DocumentShare = {
      ...shareData,
      id: Date.now().toString(),
      sharedAt: new Date()
    };
    
    return newShare;
  }
);

export const updateShareStatus = createAsyncThunk(
  'documents/updateShareStatus',
  async ({ shareId, status }: { shareId: string; status: ShareStatus }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamp = new Date();
    return { shareId, status, timestamp };
  }
);

export const createDocumentVersion = createAsyncThunk(
  'documents/createVersion',
  async ({ 
    documentId, 
    content, 
    changeDescription, 
    userId 
  }: { 
    documentId: string; 
    content: any; 
    changeDescription?: string; 
    userId: string;
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVersion: DocumentVersion = {
      id: Date.now().toString(),
      documentId,
      version: Date.now(), // In real app, this would be incremented properly
      name: `Version ${Date.now()}`,
      content,
      modifiedBy: userId,
      modifiedAt: new Date(),
      changeDescription
    };
    
    return newVersion;
  }
);

export const restoreDocumentVersion = createAsyncThunk(
  'documents/restoreVersion',
  async ({ 
    documentId, 
    versionId, 
    userId 
  }: { 
    documentId: string; 
    versionId: string; 
    userId: string;
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { documentId, versionId, userId, timestamp: new Date() };
  }
);

export const addDigitalSignature = createAsyncThunk(
  'documents/addDigitalSignature',
  async ({ 
    documentId, 
    signatureData 
  }: { 
    documentId: string; 
    signatureData: Omit<DigitalSignature, 'id' | 'signedAt'>;
  }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSignature: DigitalSignature = {
      ...signatureData,
      id: Date.now().toString(),
      signedAt: new Date()
    };
    
    return { documentId, signature: newSignature };
  }
);

export const verifySignature = createAsyncThunk(
  'documents/verifySignature',
  async ({ signatureId }: { signatureId: string }) => {
    // Simulate API call for signature verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { signatureId, isValid: true };
  }
);

interface DocumentState {
  documents: Document[];
  shares: DocumentShare[];
  loading: boolean;
  error: string | null;
  selectedDocument: Document | null;
  filters: {
    department?: string;
    status?: DocumentStatus;
    searchTerm: string;
  };
  uploadProgress: number;
  statusUpdateLoading: boolean;
  shareLoading: boolean;
  signatureLoading: boolean;
}

const initialState: DocumentState = {
  documents: [],
  shares: [],
  loading: false,
  error: null,
  selectedDocument: null,
  filters: {
    searchTerm: ''
  },
  uploadProgress: 0,
  statusUpdateLoading: false,
  shareLoading: false,
  signatureLoading: false
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    // Fetch documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      })
      
    // Update document status
    builder
      .addCase(updateDocumentStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const { documentId, status } = action.payload;
        const document = state.documents.find(doc => doc.id === documentId);
        if (document) {
          document.status = status;
          document.modifiedAt = new Date();
        }
        if (state.selectedDocument?.id === documentId) {
          state.selectedDocument.status = status;
          state.selectedDocument.modifiedAt = new Date();
        }
      })
      .addCase(updateDocumentStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.error = action.error.message || 'Failed to update document status';
      })
      
    // Upload document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload document';
        state.uploadProgress = 0;
      })
      
    // Share document
    builder
      .addCase(shareDocument.pending, (state) => {
        state.shareLoading = true;
        state.error = null;
      })
      .addCase(shareDocument.fulfilled, (state, action) => {
        state.shareLoading = false;
        state.shares.push(action.payload);
        
        // Add share to the document
        const document = state.documents.find(doc => doc.id === action.payload.documentId);
        if (document) {
          if (!document.shares) document.shares = [];
          document.shares.push(action.payload);
        }
      })
      .addCase(shareDocument.rejected, (state, action) => {
        state.shareLoading = false;
        state.error = action.error.message || 'Failed to share document';
      })
      
    // Update share status
    builder
      .addCase(updateShareStatus.fulfilled, (state, action) => {
        const { shareId, status, timestamp } = action.payload;
        const share = state.shares.find(s => s.id === shareId);
        if (share) {
          share.status = status;
          if (status === ShareStatus.SEEN) {
            share.seenAt = timestamp;
          } else if (status === ShareStatus.ACKNOWLEDGED) {
            share.acknowledgedAt = timestamp;
          }
        }
      })
      
    // Create document version
    builder
      .addCase(createDocumentVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocumentVersion.fulfilled, (state, action) => {
        state.loading = false;
        const version = action.payload;
        const document = state.documents.find(doc => doc.id === version.documentId);
        if (document) {
          if (!document.versions) document.versions = [];
          document.versions.push(version);
          document.version = version.version;
          document.modifiedAt = version.modifiedAt;
        }
      })
      .addCase(createDocumentVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create document version';
      })
      
    // Restore document version
    builder
      .addCase(restoreDocumentVersion.fulfilled, (state, action) => {
        const { documentId, versionId } = action.payload;
        const document = state.documents.find(doc => doc.id === documentId);
        if (document && document.versions) {
          const version = document.versions.find(v => v.id === versionId);
          if (version) {
            // Restore document to this version
            document.version = version.version;
            document.modifiedAt = new Date();
            if (version.content) {
              document.formData = version.content;
            }
          }
        }
      })
      
    // Add digital signature
    builder
      .addCase(addDigitalSignature.pending, (state) => {
        state.signatureLoading = true;
        state.error = null;
      })
      .addCase(addDigitalSignature.fulfilled, (state, action) => {
        state.signatureLoading = false;
        const { documentId, signature } = action.payload;
        const document = state.documents.find(doc => doc.id === documentId);
        if (document) {
          if (!document.signatures) document.signatures = [];
          document.signatures.push(signature);
          
          // Update document status based on signature type
          if (signature.signatureType === 'approval') {
            document.status = DocumentStatus.APPROVED;
            document.isLocked = true; // Lock document after approval
          } else if (signature.signatureType === 'rejection') {
            document.status = DocumentStatus.REJECTED;
          }
          
          document.modifiedAt = new Date();
        }
        
        if (state.selectedDocument?.id === documentId) {
          if (!state.selectedDocument.signatures) state.selectedDocument.signatures = [];
          state.selectedDocument.signatures.push(signature);
          if (signature.signatureType === 'approval') {
            state.selectedDocument.status = DocumentStatus.APPROVED;
            state.selectedDocument.isLocked = true;
          } else if (signature.signatureType === 'rejection') {
            state.selectedDocument.status = DocumentStatus.REJECTED;
          }
          state.selectedDocument.modifiedAt = new Date();
        }
      })
      .addCase(addDigitalSignature.rejected, (state, action) => {
        state.signatureLoading = false;
        state.error = action.error.message || 'Failed to add digital signature';
      })
      
    // Verify signature
    builder
      .addCase(verifySignature.fulfilled, (state, action) => {
        const { signatureId, isValid } = action.payload;
        // Update signature validity in all documents
        state.documents.forEach(doc => {
          if (doc.signatures) {
            const signature = doc.signatures.find(sig => sig.id === signatureId);
            if (signature) {
              signature.isValid = isValid;
            }
          }
        });
      });
  }
});

export const { 
  setSelectedDocument, 
  setFilters, 
  clearError, 
  setUploadProgress, 
  resetUploadProgress 
} = documentSlice.actions;

export default documentSlice.reducer;
