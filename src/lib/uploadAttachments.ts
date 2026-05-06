import { StorageService } from '@/services/storageService';

export interface PersistedAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;   // Storage path (use getSignedUrl to fetch)
  path: string;
}

/**
 * Upload a list of File objects to Supabase Storage under the user's folder.
 * Returns metadata referencing the persisted storage path (NOT a blob URL).
 */
export async function uploadAttachments(
  files: File[],
  userId: string,
  category = 'shared'
): Promise<PersistedAttachment[]> {
  const out: PersistedAttachment[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await StorageService.uploadDocument(file, userId, category);
    if (!result.success || !result.path) {
      throw new Error(result.error || `Failed to upload ${file.name}`);
    }
    out.push({
      id: `${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: result.path,
      path: result.path,
    });
  }
  return out;
}
