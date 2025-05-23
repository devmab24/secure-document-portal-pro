
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDocuments, setFilters } from '@/store/slices/documentSlice';

export const useDocuments = () => {
  const dispatch = useAppDispatch();
  const { documents, loading, filters } = useAppSelector(state => state.documents);

  const loadDocuments = useCallback((filterOptions?: any) => {
    dispatch(fetchDocuments(filterOptions));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: any) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  return {
    documents: documents || [],
    loading,
    filters,
    loadDocuments,
    updateFilters
  };
};
