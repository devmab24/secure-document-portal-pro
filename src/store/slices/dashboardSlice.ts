
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DocumentsAPI, apiCall } from '../../services/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (department?: string) => {
    const documents = await apiCall(
      DocumentsAPI.getDocuments(department ? { department } : undefined),
      'Failed to fetch dashboard statistics'
    );
    
    const stats = {
      totalDocuments: documents.length,
      pendingApprovals: documents.filter(doc => 
        doc.status === 'SUBMITTED' || doc.status === 'UNDER_REVIEW'
      ).length,
      approved: documents.filter(doc => doc.status === 'APPROVED').length,
      rejected: documents.filter(doc => doc.status === 'REJECTED').length,
      byDepartment: documents.reduce((acc, doc) => {
        acc[doc.department] = (acc[doc.department] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }
);

interface DashboardState {
  stats: {
    totalDocuments: number;
    pendingApprovals: number;
    approved: number;
    rejected: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
  } | null;
  loading: boolean;
  error: string | null;
  selectedDepartment: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  selectedDepartment: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      });
  }
});

export const { setSelectedDepartment, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
