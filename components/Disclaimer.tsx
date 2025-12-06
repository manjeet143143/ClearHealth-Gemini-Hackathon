import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 dark:bg-black/90 backdrop-blur-sm text-slate-400 py-3 px-4 z-50 text-xs sm:text-sm border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-center">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-teal-500" />
        <p>
          AI analysis for informational purposes only. Results may contain errors. <span className="text-slate-200 font-medium">Always consult a physician for medical advice.</span>
        </p>
      </div>
    </div>
  );
};