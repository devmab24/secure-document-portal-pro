import { StorageService } from '@/backend/modules/storage/storage.service';
import { supabase } from '@/integrations/supabase/client';
import { logStorageEvent, trackDownloadForBurst } from '@/backend/modules/audit/audit.service';

export interface PersistedAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;   // Storage path
  path: string;
}

export interface AttachmentProgress {
  index: number;
  name: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

// Per-file: 25 MB. Total per submission: 100 MB. Max files: 10.
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_FILE_COUNT = 10;

export function validateAttachments(files: File[]): string | null {
  if (files.length > MAX_FILE_COUNT) {
    return `Maximum ${MAX_FILE_COUNT} files per submission.`;
  }
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE_BYTES) {
      return `"${f.name}" is larger than ${(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB.`;
    }
  }
  const total = files.reduce((s, f) => s + f.size, 0);
  if (total > MAX_TOTAL_SIZE_BYTES) {
    return `Total attachment size exceeds ${(MAX_TOTAL_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB.`;
  }
  return null;
}

export async function uploadAttachments(
  files: File[],
  userId: string,
  category = 'shared',
  onProgress?: (p: AttachmentProgress) => void,
): Promise<PersistedAttachment[]> {
  const out: PersistedAttachment[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ index: i, name: file.name, status: 'uploading' });
    const result = await StorageService.uploadDocument(file, userId, category);
    if (!result.success || !result.path) {
      onProgress?.({ index: i, name: file.name, status: 'error', error: result.error });
      logStorageEvent('denied', `${userId}/${category}/${file.name}`, {
        operation: 'upload',
        size: file.size,
        error: result.error,
      });
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
    logStorageEvent('upload', result.path, { size: file.size, type: file.type, category });
    onProgress?.({ index: i, name: file.name, status: 'done' });
  }
  return out;
}

/**
 * Best-effort audit log for attachment downloads. Writes to both
 * `document_access_log` (legacy) and `audit_logs` (security review).
 * Also feeds the client-side burst detector. Never throws.
 */
export async function logAttachmentAccess(
  path: string,
  accessType: 'view' | 'download' = 'download',
) {
  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;
    await supabase.from('document_access_log').insert({
      user_id: userId,
      access_type: `attachment_${accessType}`,
      notes: path,
    });
    logStorageEvent(accessType, path);
    if (accessType === 'download') trackDownloadForBurst(path);
  } catch {
    // swallow
  }
}
