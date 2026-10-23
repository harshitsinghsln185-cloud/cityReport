import React, { useState } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import invoiceService from '../services/invoice.service';
import Button from './ui/Button';

interface InvoiceButtonProps {
  invoiceId: string;
  invoiceNumber?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const InvoiceButton: React.FC<InvoiceButtonProps> = ({
  invoiceId,
  invoiceNumber,
  variant = 'outline',
  size = 'sm',
  className = '',
  label,
}) => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloading(true);
      setError(null);
      await invoiceService.downloadPdf(invoiceId, invoiceNumber);
    } catch (err: any) {
      setError('Failed to download invoice PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start">
      <Button
        variant={variant}
        size={size}
        className={`${className} font-medium`}
        onClick={handleDownload}
        disabled={downloading}
        leftIcon={
          downloading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : size === 'sm' ? (
            <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
          ) : (
            <Download className="w-4 h-4 text-[#7C3AED]" />
          )
        }
      >
        {downloading ? 'Downloading...' : label || (invoiceNumber ? `Invoice ${invoiceNumber}` : 'Download Invoice PDF')}
      </Button>
      {error && <span className="text-[10px] text-rose-600 mt-1">{error}</span>}
    </div>
  );
};

export default InvoiceButton;
