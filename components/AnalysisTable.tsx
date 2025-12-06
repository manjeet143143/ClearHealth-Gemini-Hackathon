
import React from 'react';
import { AnalysisResult, TestStatus, ExtractedMetric } from '../types';
import { AlertCircle, Check } from 'lucide-react';
import { TableGauge } from './TableGauge';

interface AnalysisTableProps {
  data: AnalysisResult;
}

export const AnalysisTable: React.FC<AnalysisTableProps> = ({ data }) => {
  // Group by category
  const groupedData = data.metrics.reduce((acc, metric) => {
    const category = metric.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, ExtractedMetric[]>);

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case TestStatus.NORMAL: 
        return 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800';
      case TestStatus.LOW: 
      case TestStatus.HIGH: 
        return 'text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-300 dark:bg-amber-900/20 dark:border-amber-800';
      case TestStatus.CRITICAL_LOW:
      case TestStatus.CRITICAL_HIGH: 
        return 'text-red-700 bg-red-50 border-red-100 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800';
      default: 
        return 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: TestStatus) => {
    if (status === TestStatus.NORMAL) return <Check className="w-3.5 h-3.5 mr-1.5" />;
    return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedData).map(([category, metrics]: [string, ExtractedMetric[]]) => (
        <div key={category} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{category}</h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
              {metrics.length} tests
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 w-1/3">Test Name</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Reference Range</th>
                  <th className="px-6 py-4 text-center w-40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 align-middle">
                      {metric.testName}
                      {/* Mobile-only range display */}
                      <div className="sm:hidden text-xs text-slate-400 mt-1 font-mono">
                         Range: {metric.rangeMin && metric.rangeMax ? `${metric.rangeMin}-${metric.rangeMax}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-baseline">
                        <span className={`font-bold text-base ${metric.status !== TestStatus.NORMAL ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {metric.value}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{metric.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell font-mono text-xs align-middle">
                      {metric.rangeMin !== undefined && metric.rangeMax !== undefined 
                        ? `${metric.rangeMin} - ${metric.rangeMax}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 align-middle flex justify-center">
                      {/* 
                         Logic: If we have ranges, show the Gauge.
                         If not, show the Badge.
                         This ensures "Out of Range" gets the visual treatment as requested, 
                         and Normal values also get it for consistency if data exists.
                      */}
                      {metric.rangeMin !== undefined && metric.rangeMax !== undefined && metric.rangeMin !== null && metric.rangeMax !== null ? (
                        <div className="py-2">
                           <TableGauge 
                             value={metric.value} 
                             min={metric.rangeMin} 
                             max={metric.rangeMax} 
                             width={120}
                           />
                           {metric.status !== TestStatus.NORMAL && (
                             <p className="text-[10px] text-center font-bold text-red-500 dark:text-red-400 mt-1 uppercase tracking-wide">
                               {metric.status}
                             </p>
                           )}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(metric.status)}`}>
                          {getStatusIcon(metric.status)}
                          {metric.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
