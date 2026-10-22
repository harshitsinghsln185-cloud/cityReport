import React, { useState, useRef } from 'react';
import { UploadCloud, Check, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

export interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onUpload: (file: File) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  maxSizeMB?: number;
  accept?: string[];
  isLoading?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl = null,
  onUpload,
  onRemove,
  maxSizeMB = 5,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  isLoading = false,
  className = '',
}) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndStageFile = (file: File) => {
    setErrorMessage(null);

    // Size validation
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File exceeds the maximum allowable limit of ${maxSizeMB}MB.`);
      return;
    }

    // Type validation
    if (!accept.includes(file.type)) {
      setErrorMessage('Only JPEG, PNG, and WebP images are supported.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndStageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndStageFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to upload image.');
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeDisplayUrl = previewUrl || currentImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error notification */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Dropzone / Preview Box */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#7C3AED] bg-[#EDE9FE]/40'
            : 'border-[#E2E8F0] bg-[#F8F7FC] hover:bg-[#EDE9FE]/20 hover:border-[#A78BFA]'
        } ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        {activeDisplayUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative group w-32 h-32 rounded-xl overflow-hidden shadow-md border-2 border-[#7C3AED]/30">
              <img
                src={activeDisplayUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#171A3B]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                Click to Change
              </div>
            </div>

            {selectedFile && (
              <div className="mt-3 text-xs text-[#475569]">
                <span className="font-semibold text-[#1E293B]">{selectedFile.name}</span> (
                {(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#1E293B]">
              Drag and drop your image here, or{' '}
              <span className="text-[#7C3AED] underline">browse</span>
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Supported: JPEG, PNG, WebP • Up to {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          {currentImageUrl && !selectedFile && onRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              isLoading={isLoading}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Remove Photo
            </Button>
          )}
        </div>

        {selectedFile && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelSelection}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirmUpload}
              isLoading={isLoading}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Upload Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
