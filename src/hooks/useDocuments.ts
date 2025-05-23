import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
// Note: These actions would need to be implemented in the document slice

export const useDocuments = () => {
  const dispatch = useAppDispatch();
  const { documents, loading } = useAppSelector(state => state.documents);

  const loadDocuments = useCallback((filterOptions?: any) => {
    // Placeholder - would dispatch actual action
    console.log("Loading documents with filters:", filterOptions);
  }, [dispatch]);

  return {
    documents: documents || [],
    loading,
    loadDocuments
  };
};
