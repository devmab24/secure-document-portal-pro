import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  AttachmentProgress,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_SIZE_BYTES,
  validateAttachments,
} from '@/lib/uploadAttachments';
import { useToast } from '@/hooks/use-toast';

interface AttachmentsFieldProps {
  id: string;
  files: File[];
  onChange: (files: File[]) => void;
  progress: AttachmentProgress[];
  disabled?: boolean;
}

const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const AttachmentsField: React.FC<AttachmentsFieldProps> = ({
  id, files, onChange, progress, disabled,
}) => {
  const { toast } = useToast();
  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const totalPct = Math.min(100, (totalSize / MAX_TOTAL_SIZE_BYTES) * 100);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    const merged = [...files, ...incoming];
    const error = validateAttachments(merged);
    if (error) {
      toast({ title: 'Cannot add files', description: error, variant: 'destructive' });
      e.target.value = '';
      return;
    }
    onChange(merged);
    e.target.value = '';
  };

  const remove = (index: number) => onChange(files.filter((_, i) => i !== index));

  const totalActive = progress.length;
  const totalDone = progress.filter(p => p.status === 'done').length;
  const overallPct = totalActive ? Math.round((totalDone / totalActive) * 100) : 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Attach Files (Optional)</Label>
      <p className="text-xs text-muted-foreground">
        Up to {MAX_FILE_COUNT} files, max {(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB each,
        {(MAX_TOTAL_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB total.
      </p>
      <input
        id={id}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => window.document.getElementById(id)?.click()}
        className="w-full"
        disabled={disabled || files.length >= MAX_FILE_COUNT}
      >
        <Upload className="h-4 w-4 mr-2" /> Choose Files
      </Button>

      {files.length > 0 && (
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{files.length} file{files.length === 1 ? '' : 's'}</span>
          <span>{fmtSize(totalSize)} / {(MAX_TOTAL_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB</span>
        </div>
      )}
      {files.length > 0 && <Progress value={totalPct} className="h-1" />}

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => {
            const p = progress.find(pp => pp.index === index);
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {p?.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                  {p?.status === 'done' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                  {p?.status === 'error' && <AlertCircle className="h-3 w-3 text-destructive" />}
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{fmtSize(file.size)}</span>
                </div>
                {!disabled && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {disabled && totalActive > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Uploading… {totalDone}/{totalActive}</span>
            <span>{overallPct}%</span>
          </div>
          <Progress value={overallPct} />
        </div>
      )}
    </div>
  );
};
