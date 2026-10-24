import React, { useState, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import {
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  FileText,
} from 'lucide-react';

interface ProofUploaderProps {
  onSubmit: (data: { beforeFiles: File[]; afterFiles: File[]; remarks: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export const ProofUploader: React.FC<ProofUploaderProps> = ({ onSubmit, isSubmitting = false }) => {
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const handleFilesSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const f of files) {
      if (!allowedTypes.includes(f.type)) {
        setError(`File '${f.name}' has invalid format. Only JPEG, PNG, and WebP are supported.`);
        return;
      }
      if (f.size > maxSizeBytes) {
        setError(`File '${f.name}' exceeds the 5MB size limit.`);
        return;
      }
    }

    if (type === 'before') {
      if (beforeFiles.length + files.length > 4) {
        setError('A maximum of 4 before-repair photos can be uploaded.');
        return;
      }
      setBeforeFiles((prev) => [...prev, ...files]);
    } else {
      if (afterFiles.length + files.length > 4) {
        setError('A maximum of 4 after-repair photos can be uploaded.');
        return;
      }
      setAfterFiles((prev) => [...prev, ...files]);
    }

    e.target.value = '';
  };

  const removeFile = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAfterFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (afterFiles.length === 0) {
      setError('At least one after-repair proof photo is required to mark this task as Resolved.');
      return;
    }

    if (!remarks.trim() || remarks.trim().length < 10) {
      setError('Please provide at least 10 characters explaining the completed repair work.');
      return;
    }

    try {
      await onSubmit({
        beforeFiles,
        afterFiles,
        remarks: remarks.trim(),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit resolution proof.');
    }
  };

  return (
    <Card className="border border-border/80 bg-card rounded-card shadow-card p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-base text-ink">Submit Resolution Proof</h3>
          <p className="text-xs text-secondaryText">
            Upload photographic evidence of completed repair work for citizen inspection and administration sign-off
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 my-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Dual Upload Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Photos (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <span>Before Photos</span>
                <span className="text-[11px] font-normal text-secondaryText">(Optional, max 4)</span>
              </label>
              <span className="text-xs font-mono text-secondaryText">{beforeFiles.length} / 4</span>
            </div>

            {beforeFiles.length < 4 && (
              <div
                onClick={() => beforeInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-canvas rounded-xl p-4 text-center cursor-pointer transition-all group"
              >
                <UploadCloud className="w-6 h-6 text-secondaryText group-hover:text-primary mx-auto mb-1 transition-colors" />
                <p className="text-xs font-semibold text-ink">Add Before Repair Photo</p>
                <p className="text-[11px] text-secondaryText mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                <input
                  ref={beforeInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e, 'before')}
                />
              </div>
            )}

            {beforeFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {beforeFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-canvas">
                      <img src={url} alt={`Before ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx, 'before')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate font-mono">
                        {file.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* After Photos (Required) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <span>After Photos</span>
                <span className="text-[11px] font-semibold text-rose-600">* Required (1 to 4)</span>
              </label>
              <span className="text-xs font-mono text-secondaryText">{afterFiles.length} / 4</span>
            </div>

            {afterFiles.length < 4 && (
              <div
                onClick={() => afterInputRef.current?.click()}
                className="border-2 border-dashed border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 rounded-xl p-4 text-center cursor-pointer transition-all group"
              >
                <UploadCloud className="w-6 h-6 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-semibold text-primary">Upload After Repair Photo</p>
                <p className="text-[11px] text-secondaryText mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                <input
                  ref={afterInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e, 'after')}
                />
              </div>
            )}

            {afterFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {afterFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-emerald-50">
                      <img src={url} alt={`After ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx, 'after')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate font-mono">
                        {file.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Completion Remarks */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Completion Remarks & Details</span>
              <span className="text-rose-600">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                remarks.length < 10 ? 'text-amber-600' : 'text-secondaryText'
              }`}
            >
              {remarks.length} / 2000 chars {remarks.length < 10 && '(min 10 chars)'}
            </span>
          </div>

          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Describe the physical work conducted, materials applied, safety checks completed, and any instructions for the citizen..."
            className="w-full p-3 text-xs border border-border rounded-xl bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all leading-relaxed"
            required
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || afterFiles.length === 0 || remarks.trim().length < 10}
            className="gap-2 text-xs font-semibold px-6 py-2.5 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Proof & Completing Task...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Resolution Proof & Mark Resolved</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProofUploader;
