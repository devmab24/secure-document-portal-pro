import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export class StorageService {
  private static DOCUMENTS_BUCKET = 'documents';
  private static AVATARS_BUCKET = 'avatars';

  /**
   * Upload a document to the documents bucket
   * Files are organized by user ID for RLS policies
   */
  static async uploadDocument(
    file: File,
    userId: string,
    category?: string
  ): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const folder = category ? `${userId}/${category}` : userId;
      const path = `${folder}/${timestamp}_${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error: any) {
      console.error('Upload exception:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload an avatar image
   */
  static async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `${userId}/avatar.${extension}`;

      const { data, error } = await supabase.storage
        .from(this.AVATARS_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting existing avatar
        });

      if (error) {
        console.error('Avatar upload error:', error);
        return { success: false, error: error.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.AVATARS_BUCKET)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error: any) {
      console.error('Avatar upload exception:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a signed URL for private document access
   */
  static async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error('Signed URL error:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Signed URL exception:', error);
      return null;
    }
  }

  /**
   * Download a document
   */
  static async downloadDocument(path: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .download(path);

      if (error) {
        console.error('Download error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Download exception:', error);
      return null;
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete exception:', error);
      return false;
    }
  }

  /**
   * List documents for a user
   */
  static async listUserDocuments(userId: string, folder?: string): Promise<any[]> {
    try {
      const path = folder ? `${userId}/${folder}` : userId;
      
      const { data, error } = await supabase.storage
        .from(this.DOCUMENTS_BUCKET)
        .list(path, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('List error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('List exception:', error);
      return [];
    }
  }

  /**
   * Get file metadata from the documents table
   */
  static async getDocumentMetadata(documentId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      console.error('Metadata fetch error:', error);
      return null;
    }

    return data;
  }

  /**
   * Create a document record in the database after upload
   */
  static async createDocumentRecord(
    name: string,
    fileUrl: string,
    fileType: string,
    fileSize: number,
    userId: string,
    options?: {
      description?: string;
      documentType?: string;
      documentCategory?: string;
      priority?: string;
      confidentialityLevel?: string;
      tags?: string[];
    }
  ) {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
        created_by: userId,
        description: options?.description,
        document_type: options?.documentType,
        document_category: options?.documentCategory,
        priority: options?.priority || 'normal',
        confidentiality_level: options?.confidentialityLevel || 'internal',
        tags: options?.tags,
        status: 'draft',
        version: 1
      })
      .select()
      .single();

    if (error) {
      console.error('Document record creation error:', error);
      return null;
    }

    return data;
  }
}
