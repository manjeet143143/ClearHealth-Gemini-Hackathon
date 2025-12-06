
import React from 'react';
import { TableGauge } from './TableGauge';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  name: string;
  unit: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ value, min, max, name, unit }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between h-full transition-colors duration-200">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center h-10 flex items-center justify-center line-clamp-2">
        {name}
      </h4>
      
      <div className="w-full flex justify-center py-2">
         {/* Reuse the custom TableGauge but slightly larger if needed, or scale it */}
         <div className="scale-125 transform origin-top">
           <TableGauge value={value} min={min} max={max} width={140} />
         </div>
      </div>

      <div className="mt-8 text-center">
         <span className={`text-2xl font-bold ${value < min || value > max ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400'}`}>
           {value}
         </span>
         <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">{unit}</span>
      </div>
      
      <div className="mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-500 dark:text-slate-400">
        Range: {min} - {max}
      </div>
    </div>
  );
};
