import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DocumentSubmission, DocumentSharingService } from '@/services/documentSharingService';

export interface DocumentSharingState {
  submissions: DocumentSubmission[];
  pendingSubmissions: DocumentSubmission[];
  userSubmissions: DocumentSubmission[];
  loading: boolean;
  error: string | null;
  statusUpdateLoading: boolean;
}

const initialState: DocumentSharingState = {
  submissions: [],
  pendingSubmissions: [],
  userSubmissions: [],
  loading: false,
  error: null,
  statusUpdateLoading: false
};

// Async thunks for document sharing operations
export const loadSubmissions = createAsyncThunk(
  'documentSharing/loadSubmissions',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    return DocumentSharingService.getSubmissions();
  }
);

export const loadUserSubmissions = createAsyncThunk(
  'documentSharing/loadUserSubmissions',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DocumentSharingService.getSubmissionsByUser(userId);
  }
);

export const loadPendingSubmissions = createAsyncThunk(
  'documentSharing/loadPendingSubmissions',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DocumentSharingService.getPendingSubmissions();
  }
);

export const submitDocument = createAsyncThunk(
  'documentSharing/submitDocument',
  async (submission: Omit<DocumentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return DocumentSharingService.submitDocument(submission);
  }
);

export const loadSubmissionsToUser = createAsyncThunk(
  'documentSharing/loadSubmissionsToUser',
  async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DocumentSharingService.getSubmissionsToUser(userId);
  }
);

export const updateSubmissionStatus = createAsyncThunk(
  'documentSharing/updateStatus',
  async ({ 
    submissionId, 
    status, 
    feedback, 
    digitalSignature 
  }: { 
    submissionId: string; 
    status: DocumentSubmission['status']; 
    feedback?: string;
    digitalSignature?: DocumentSubmission['digitalSignature'];
  }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return DocumentSharingService.updateSubmissionStatus(submissionId, status, feedback, digitalSignature);
  }
);

const documentSharingSlice = createSlice({
  name: 'documentSharing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Load submissions
    builder
      .addCase(loadSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(loadSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load submissions';
      })

    // Load user submissions
    builder
      .addCase(loadUserSubmissions.fulfilled, (state, action) => {
        state.userSubmissions = action.payload;
      })

    // Load pending submissions
    builder
      .addCase(loadPendingSubmissions.fulfilled, (state, action) => {
        state.pendingSubmissions = action.payload;
      })

    // Load submissions to user
    builder
      .addCase(loadSubmissionsToUser.fulfilled, (state, action) => {
        state.userSubmissions = action.payload;
      })

    // Submit document
    builder
      .addCase(submitDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions.unshift(action.payload);
        state.userSubmissions.unshift(action.payload);
      })
      .addCase(submitDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit document';
      })

    // Update submission status
    builder
      .addCase(updateSubmissionStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        if (action.payload) {
          const updatedSubmission = action.payload;
          
          // Update in all relevant arrays
          const updateInArray = (array: DocumentSubmission[]) => {
            const index = array.findIndex(s => s.id === updatedSubmission.id);
            if (index !== -1) {
              array[index] = updatedSubmission;
            }
          };
          
          updateInArray(state.submissions);
          updateInArray(state.userSubmissions);
          updateInArray(state.pendingSubmissions);
        }
      })
      .addCase(updateSubmissionStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.error = action.error.message || 'Failed to update submission status';
      });
  }
});

export const { clearError, resetState } = documentSharingSlice.actions;
export default documentSharingSlice.reducer;
