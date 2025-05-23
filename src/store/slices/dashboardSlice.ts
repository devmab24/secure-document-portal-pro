
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Department, DocumentStatus } from '@/lib/types';
import { mockDocuments } from '@/lib/mock-data';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (department?: Department) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const docs = department 
      ? mockDocuments.filter(doc => doc.department === department)
      : mockDocuments;
    
    const stats = {
      totalDocuments: docs.length,
      pendingApprovals: docs.filter(doc => 
        doc.status === DocumentStatus.SUBMITTED || 
        doc.status === DocumentStatus.UNDER_REVIEW
      ).length,
      approved: docs.filter(doc => doc.status === DocumentStatus.APPROVED).length,
      rejected: docs.filter(doc => doc.status === DocumentStatus.REJECTED).length,
      byDepartment: Object.values(Department).reduce((acc, dept) => {
        acc[dept] = docs.filter(doc => doc.department === dept).length;
        return acc;
      }, {} as Record<Department, number>),
      byStatus: Object.values(DocumentStatus).reduce((acc, status) => {
        acc[status] = docs.filter(doc => doc.status === status).length;
        return acc;
      }, {} as Record<DocumentStatus, number>)
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
    byDepartment: Record<Department, number>;
    byStatus: Record<DocumentStatus, number>;
  } | null;
  loading: boolean;
  error: string | null;
  selectedDepartment: Department | null;
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
    setSelectedDepartment: (state, action: PayloadAction<Department | null>) => {
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
