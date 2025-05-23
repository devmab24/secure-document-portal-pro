
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDashboardStats, setSelectedDepartment, clearError } from '@/store/slices/dashboardSlice';
import { Department } from '@/lib/types';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error, selectedDepartment } = useAppSelector(state => state.dashboard);

  const loadStats = (department?: Department) => {
    dispatch(fetchDashboardStats(department));
  };

  const selectDepartment = (department: Department | null) => {
    dispatch(setSelectedDepartment(department));
  };

  const clearErrors = () => {
    dispatch(clearError());
  };

  useEffect(() => {
    loadStats(selectedDepartment || undefined);
  }, [selectedDepartment]);

  return {
    stats,
    loading,
    error,
    selectedDepartment,
    loadStats,
    selectDepartment,
    clearErrors
  };
};
