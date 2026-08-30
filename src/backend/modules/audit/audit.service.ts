import { supabase } from '@/integrations/supabase/client';

/**
 * Centralised security audit logging. All writes go through the
 * `log_audit_event` SECURITY DEFINER RPC so the user_id is server-enforced
 * to auth.uid() and cannot be spoofed.
 *
 * Action namespace conventions:
 *   storage.upload        — file uploaded to Supabase Storage
 *   storage.download      — signed URL issued / file fetched
 *   storage.view          — preview opened
 *   storage.denied        — signed URL request rejected by RLS
 *   policy.denied         — generic RLS denial caught in the SPA
 *   share.created         — new document_shares row inserted
 *   abnormal.activity     — client-side burst / rate anomaly detected
 */
export type AuditAction =
  | 'storage.upload'
  | 'storage.download'
  | 'storage.view'
  | 'storage.denied'
  | 'policy.denied'
  | 'share.created'
  | 'abnormal.activity'
  | (string & {});

export interface AuditEvent {
  action: AuditAction;
  targetType?: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}

/** Best-effort audit write — never throws, never blocks UX. */
export async function logAuditEvent(evt: AuditEvent): Promise<void> {
  try {
    await supabase.rpc('log_audit_event', {
      p_action: evt.action,
      p_target_type: evt.targetType ?? null,
      p_target_id: evt.targetId ?? null,
      p_metadata: (evt.metadata ?? {}) as never,
    });
  } catch (err) {
    // Last-resort console log so devs see the failure
    console.warn('[audit] failed to log event', evt.action, err);
  }
}

/** Convenience: storage event */
export const logStorageEvent = (
  kind: 'upload' | 'download' | 'view' | 'denied',
  path: string,
  extra?: Record<string, unknown>,
) =>
  logAuditEvent({
    action: `storage.${kind}` as AuditAction,
    targetType: 'storage_object',
    metadata: { path, ...extra },
  });

/** Convenience: caught RLS denial */
export const logPolicyDenial = (
  resource: string,
  operation: string,
  error: unknown,
) =>
  logAuditEvent({
    action: 'policy.denied',
    targetType: resource,
    metadata: {
      operation,
      error: error instanceof Error ? error.message : String(error),
    },
  });

// ---- Client-side abnormal-burst detection ----
// Tracks attachment downloads per session in a sliding 5-min window.
// If the user crosses BURST_THRESHOLD it raises an `abnormal.activity` event.
const BURST_WINDOW_MS = 5 * 60 * 1000;
const BURST_THRESHOLD = 15;
const recentDownloads: number[] = [];

export function trackDownloadForBurst(path: string): void {
  const now = Date.now();
  recentDownloads.push(now);
  while (recentDownloads.length && now - recentDownloads[0] > BURST_WINDOW_MS) {
    recentDownloads.shift();
  }
  if (recentDownloads.length === BURST_THRESHOLD) {
    logAuditEvent({
      action: 'abnormal.activity',
      targetType: 'storage_object',
      metadata: {
        reason: 'download_burst',
        count: recentDownloads.length,
        windowMinutes: BURST_WINDOW_MS / 60000,
        lastPath: path,
      },
    });
  }
}
