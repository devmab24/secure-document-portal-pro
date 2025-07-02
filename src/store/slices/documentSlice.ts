
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document, DocumentStatus, DocumentShare, ShareStatus, DocumentVersion, DigitalSignature } from '@/lib/types';
import { MockDocument } from '../../../mock-db/index';
import { DocumentsAPI, apiCall } from '../../services/api';

// Update async thunks to use the API layer
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (filters?: { department?: string; status?: string; userId?: string }) => {
    return apiCall(
      DocumentsAPI.getDocuments(filters),
      'Failed to fetch documents'
    );
  }
);

export const fetchDocumentById = createAsyncThunk(
  'documents/fetchDocumentById',
  async (documentId: string) => {
    return apiCall(
      DocumentsAPI.getDocumentById(documentId),
      `Failed to fetch document ${documentId}`
    );
  }
);

export const updateDocumentStatus = createAsyncThunk(
  'documents/updateStatus',
  async ({ documentId, status, comment }: { documentId: string; status: string; comment?: string }) => {
    return apiCall(
      DocumentsAPI.updateDocumentStatus(documentId, status, comment),
      'Failed to update document status'
    );
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentData: Omit<MockDocument, 'id' | 'uploadedAt' | 'modifiedAt' | 'version'>) => {
    return apiCall(
      DocumentsAPI.createDocument(documentData),
      'Failed to upload document'
    );
  }
);

export const updateDocument = createAsyncThunk(
  'documents/update',
  async ({ id, updates }: { id: string; updates: Partial<MockDocument> }) => {
    return apiCall(
      DocumentsAPI.updateDocument(id, updates),
      'Failed to update document'
    );
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (documentId: string) => {
    await apiCall(
      DocumentsAPI.deleteDocument(documentId),
      'Failed to delete document'
    );
    return documentId;
  }
);

// Keep existing thunks for features not yet implemented in API
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
  documents: MockDocument[];
  shares: DocumentShare[];
  loading: boolean;
  error: string | null;
  selectedDocument: MockDocument | null;
  filters: {
    department?: string;
    status?: string;
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
    setSelectedDocument: (state, action: PayloadAction<MockDocument | null>) => {
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

    // Fetch document by ID
    builder
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedDocument = action.payload;
          // Update in documents array if exists
          const index = state.documents.findIndex(d => d.id === action.payload!.id);
          if (index !== -1) {
            state.documents[index] = action.payload;
          }
        }
      })
      
    // Update document status
    builder
      .addCase(updateDocumentStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const updatedDocument = action.payload;
        
        // Update in documents array
        const index = state.documents.findIndex(doc => doc.id === updatedDocument.id);
        if (index !== -1) {
          state.documents[index] = updatedDocument;
        }
        
        // Update selected document
        if (state.selectedDocument?.id === updatedDocument.id) {
          state.selectedDocument = updatedDocument;
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

    // Update document
    builder
      .addCase(updateDocument.fulfilled, (state, action) => {
        const updatedDocument = action.payload;
        const index = state.documents.findIndex(d => d.id === updatedDocument.id);
        if (index !== -1) {
          state.documents[index] = updatedDocument;
        }
        if (state.selectedDocument?.id === updatedDocument.id) {
          state.selectedDocument = updatedDocument;
        }
      })

    // Delete document
    builder
      .addCase(deleteDocument.fulfilled, (state, action) => {
        const documentId = action.payload;
        state.documents = state.documents.filter(d => d.id !== documentId);
        if (state.selectedDocument?.id === documentId) {
          state.selectedDocument = null;
        }
      })
      
    // Share document (keep existing implementation)
    builder
      .addCase(shareDocument.pending, (state) => {
        state.shareLoading = true;
        state.error = null;
      })
      .addCase(shareDocument.fulfilled, (state, action) => {
        state.shareLoading = false;
        state.shares.push(action.payload);
        
        // Add share to the document if it has shares property
        const document = state.documents.find(doc => doc.id === action.payload.documentId);
        if (document) {
          if (!document.shares) document.shares = [];
          document.shares.push({
            id: action.payload.id,
            documentId: action.payload.documentId,
            fromUserId: action.payload.fromUserId,
            toUserId: action.payload.toUserId,
            toDepartment: action.payload.toDepartment,
            status: action.payload.status,
            message: action.payload.message,
            sharedAt: action.payload.sharedAt.toISOString(),
            receivedAt: action.payload.receivedAt?.toISOString(),
            seenAt: action.payload.seenAt?.toISOString(),
            acknowledgedAt: action.payload.acknowledgedAt?.toISOString()
          });
        }
      })
      .addCase(shareDocument.rejected, (state, action) => {
        state.shareLoading = false;
        state.error = action.error.message || 'Failed to share document';
      });

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
          document.versions.push({
            id: version.id,
            documentId: version.documentId,
            version: version.version,
            name: version.name,
            content: version.content,
            modifiedBy: version.modifiedBy,
            modifiedAt: version.modifiedAt.toISOString(),
            changeDescription: version.changeDescription,
            fileUrl: version.fileUrl,
            fileSize: version.fileSize
          });
          document.version = version.version;
          document.modifiedAt = version.modifiedAt.toISOString();
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
            document.modifiedAt = new Date().toISOString();
            if (version.content && document.formData !== undefined) {
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
          document.signatures.push({
            id: signature.id,
            documentId: signature.documentId,
            signerId: signature.signerId,
            signerName: signature.signerName,
            signerRole: signature.signerRole,
            signatureData: signature.signatureData,
            signedAt: signature.signedAt.toISOString(),
            ipAddress: signature.ipAddress,
            userAgent: signature.userAgent,
            signatureType: signature.signatureType,
            comments: signature.comments,
            isValid: signature.isValid
          });
          
          // Update document status based on signature type
          if (signature.signatureType === 'approval') {
            document.status = DocumentStatus.APPROVED;
            if (document.isLocked !== undefined) {
              document.isLocked = true; // Lock document after approval
            }
          } else if (signature.signatureType === 'rejection') {
            document.status = DocumentStatus.REJECTED;
          }
          
          document.modifiedAt = new Date().toISOString();
        }
        
        if (state.selectedDocument?.id === documentId) {
          if (!state.selectedDocument.signatures) state.selectedDocument.signatures = [];
          state.selectedDocument.signatures.push({
            id: signature.id,
            documentId: signature.documentId,
            signerId: signature.signerId,
            signerName: signature.signerName,
            signerRole: signature.signerRole,
            signatureData: signature.signatureData,
            signedAt: signature.signedAt.toISOString(),
            ipAddress: signature.ipAddress,
            userAgent: signature.userAgent,
            signatureType: signature.signatureType,
            comments: signature.comments,
            isValid: signature.isValid
          });
          if (signature.signatureType === 'approval') {
            state.selectedDocument.status = DocumentStatus.APPROVED;
            if (state.selectedDocument.isLocked !== undefined) {
              state.selectedDocument.isLocked = true;
            }
          } else if (signature.signatureType === 'rejection') {
            state.selectedDocument.status = DocumentStatus.REJECTED;
          }
          state.selectedDocument.modifiedAt = new Date().toISOString();
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
