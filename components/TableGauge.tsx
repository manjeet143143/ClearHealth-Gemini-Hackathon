
import React from 'react';

interface TableGaugeProps {
  value: number;
  min: number;
  max: number;
  width?: number;
  className?: string;
}

export const TableGauge: React.FC<TableGaugeProps> = ({ value, min, max, width = 120, className = "" }) => {
  // SVG Dimensions
  const height = width / 2;
  const cx = width / 2;
  const cy = height;
  const radius = width / 2 - 10; // Padding for stroke
  const strokeWidth = 8;

  // Calculate dynamic range for the gauge
  // We want the Green Zone (min-max) to be central, with Red Zones on sides
  // Typical padding: 50% of the range on each side
  const range = max - min;
  const padding = range * 0.75;
  
  // Overall gauge boundaries
  const gaugeMin = Math.min(min - padding, value < min ? value - (range * 0.1) : min - padding);
  const gaugeMax = Math.max(max + padding, value > max ? value + (range * 0.1) : max + padding);
  const totalGaugeRange = gaugeMax - gaugeMin;

  // Helper to map value to angle (180 degrees to 360 degrees, where 180 is left, 360 is right)
  const mapValueToAngle = (val: number) => {
    const clampedVal = Math.max(gaugeMin, Math.min(val, gaugeMax));
    const percent = (clampedVal - gaugeMin) / totalGaugeRange;
    return 180 + (percent * 180);
  };

  // Helper to create arc path
  const describeArc = (startAngle: number, endAngle: number, color: string) => {
    // Convert angle to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate coordinates
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
      />
    );
  };

  // Angles for zones
  const startAngle = 180;
  const minAngle = mapValueToAngle(min);
  const maxAngle = mapValueToAngle(max);
  const endAngle = 360;
  const needleAngle = mapValueToAngle(value);

  // Colors
  const redColor = "#ef4444"; // red-500
  const greenColor = "#10b981"; // emerald-500
  const needleColor = "currentColor"; // Uses text color (slate-800/white)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height + 10} className="overflow-visible">
          {/* Low (Red) Zone */}
          {describeArc(startAngle, minAngle, redColor)}
          
          {/* Normal (Green) Zone */}
          {describeArc(minAngle, maxAngle, greenColor)}
          
          {/* High (Red) Zone */}
          {describeArc(maxAngle, endAngle, redColor)}

          {/* Needle */}
          <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`} className="transition-transform duration-500 ease-out">
            <line 
              x1={cx - radius - 5} 
              y1={cy} 
              x2={cx - radius + 15} 
              y2={cy} 
              stroke={needleColor} 
              strokeWidth="2" 
              className="text-slate-800 dark:text-white"
            />
            <polygon 
              points={`${cx - radius + 15},${cy} ${cx - radius + 5},${cy - 4} ${cx - radius + 5},${cy + 4}`} 
              fill={needleColor} 
              className="text-slate-800 dark:text-white"
            />
          </g>

          {/* Center Pivot */}
          <circle cx={cx} cy={cy} r="4" fill={needleColor} className="text-slate-800 dark:text-white" />
        </svg>
        
        {/* Min/Max Labels */}
        <div className="absolute -bottom-4 w-full flex justify-between px-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          <span style={{ left: '15%' }} className="relative">{min}</span>
          <span style={{ right: '15%' }} className="relative">{max}</span>
        </div>
      </div>
    </div>
  );
};
