import React from 'react';
import { AnalysisResult } from '../types';
import { BrainCircuit, MessageCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReasoningPanelProps {
  data: AnalysisResult;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      
      {/* Insights Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Deep Dive Analysis</h2>
        </div>
        
        <div className="p-6 grid gap-4">
           {data.insights.length > 0 ? (
             data.insights.map((insight, idx) => (
               <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-200">
                 <div className="flex items-start gap-3">
                   {insight.severity === 'alert' || insight.severity === 'warning' ? (
                     <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                   ) : (
                     <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                   )}
                   <div>
                     <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">{insight.title}</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{insight.description}</p>
                     {insight.relatedMetrics.length > 0 && (
                       <div className="flex flex-wrap gap-2">
                         {insight.relatedMetrics.map((m, i) => (
                           <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                             {m}
                           </span>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             ))
           ) : (
             <div className="text-center text-slate-400 dark:text-slate-500 py-8">
               <p>No critical correlations found. Your results look balanced based on the visible data.</p>
             </div>
           )}
        </div>
      </div>

      {/* Doctor Questions Section */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 dark:from-teal-900 dark:to-emerald-900 rounded-3xl shadow-lg shadow-teal-900/20 text-white p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <MessageCircle className="w-6 h-6 text-teal-200" />
          <h2 className="text-xl font-bold">Questions for your Doctor</h2>
        </div>
        
        <div className="grid gap-3 relative z-10">
          {data.doctorQuestions.map((question, idx) => (
            <div key={idx} className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors">
              <div className="flex gap-4">
                <span className="text-2xl font-black text-teal-200/30 flex-shrink-0">
                  0{idx + 1}
                </span>
                <p className="font-medium text-teal-50 text-sm leading-relaxed pt-1">
                  "{question}"
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-teal-200/70 mt-6 text-center">
          Tip: Screenshot this card for your next appointment.
        </p>
      </div>

    </div>
  );
};