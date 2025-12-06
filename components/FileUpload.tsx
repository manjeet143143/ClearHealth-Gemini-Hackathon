import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-16 animate-fade-in-up">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 text-center
          ${isDragging 
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/10 scale-[1.02]' 
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'shadow-xl shadow-slate-200/50 dark:shadow-black/20'}
        `}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isAnalyzing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-5">
          {isAnalyzing ? (
            <div className="bg-teal-50 dark:bg-teal-900/30 p-5 rounded-full animate-pulse">
              <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin" />
            </div>
          ) : (
            <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-slate-700'}`}>
              <UploadCloud className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400'}`} />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {isAnalyzing ? 'Analyzing Document...' : 'Upload your medical report'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Drag & drop or click to browse. We support high-res JPG, PNG, and PDF files.
            </p>
          </div>

          {!isAnalyzing && (
            <div className="flex gap-6 text-xs font-medium text-slate-400 dark:text-slate-500 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 w-full justify-center">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Images
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> PDF Documents
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};