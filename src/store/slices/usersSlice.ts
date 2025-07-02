
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MockUser } from '../../../mock-db/index';
import { UsersAPI, apiCall } from '../../services/api';

// Async thunks using the API layer
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (filters?: { role?: string; department?: string }) => {
    if (filters?.role) {
      return apiCall(
        UsersAPI.getUsersByRole(filters.role),
        'Failed to fetch users by role'
      );
    }
    if (filters?.department) {
      return apiCall(
        UsersAPI.getUsersByDepartment(filters.department),
        'Failed to fetch users by department'
      );
    }
    return apiCall(UsersAPI.getUsers(), 'Failed to fetch users');
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string) => {
    return apiCall(
      UsersAPI.getUserById(userId),
      `Failed to fetch user ${userId}`
    );
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<MockUser, 'id' | 'createdAt'>) => {
    return apiCall(
      UsersAPI.createUser(userData),
      'Failed to create user'
    );
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, updates }: { id: string; updates: Partial<MockUser> }) => {
    return apiCall(
      UsersAPI.updateUser(id, updates),
      'Failed to update user'
    );
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string) => {
    await apiCall(
      UsersAPI.deleteUser(userId),
      'Failed to delete user'
    );
    return userId;
  }
);

interface UsersState {
  users: MockUser[];
  selectedUser: MockUser | null;
  loading: boolean;
  error: string | null;
  filters: {
    role?: string;
    department?: string;
    searchTerm: string;
  };
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  filters: {
    searchTerm: ''
  }
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<MockUser | null>) => {
      state.selectedUser = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })

    // Fetch user by ID
    builder
      .addCase(fetchUserById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedUser = action.payload;
          // Update in users array if exists
          const index = state.users.findIndex(u => u.id === action.payload!.id);
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      })

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create user';
      })

    // Update user
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.selectedUser?.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
      })

    // Delete user
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.users = state.users.filter(u => u.id !== userId);
        if (state.selectedUser?.id === userId) {
          state.selectedUser = null;
        }
      });
  }
});

export const { setSelectedUser, setFilters, clearError } = usersSlice.actions;
export default usersSlice.reducer;
