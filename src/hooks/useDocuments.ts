
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchDocuments, 
  updateDocumentStatus, 
  uploadDocument,
  setSelectedDocument,
  setFilters,
  clearError
} from '@/store/slices/documentSlice';
import { DocumentStatus, Document } from '@/lib/types';

export const useDocuments = () => {
  const dispatch = useAppDispatch();
  const {
    documents,
    loading,
    error,
    selectedDocument,
    filters,
    uploadProgress,
    statusUpdateLoading
  } = useAppSelector(state => state.documents);

  const loadDocuments = (filterOptions?: { department?: string; status?: DocumentStatus; userId?: string }) => {
    dispatch(fetchDocuments(filterOptions));
  };

  const updateStatus = async (documentId: string, status: DocumentStatus, comment?: string) => {
    return dispatch(updateDocumentStatus({ documentId, status, comment }));
  };

  const upload = async (documentData: Partial<Document>) => {
    return dispatch(uploadDocument(documentData));
  };

  const selectDocument = (document: Document | null) => {
    dispatch(setSelectedDocument(document));
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const clearErrors = () => {
    dispatch(clearError());
  };

  return {
    documents,
    loading,
    error,
    selectedDocument,
    filters,
    uploadProgress,
    statusUpdateLoading,
    loadDocuments,
    updateStatus,
    upload,
    selectDocument,
    updateFilters,
    clearErrors
  };
};
