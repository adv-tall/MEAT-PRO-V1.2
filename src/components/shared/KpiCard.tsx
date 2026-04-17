import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface KpiCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  trend?: string;
  trendColor?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  subLabel,
  icon: Icon,
  color = '#111f42',
  bg = 'bg-slate-50',
  trend,
  trendColor = 'text-emerald-500',
  className
}: KpiCardProps) {
  return (
    <div className={clsx(
      "bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow relative overflow-hidden",
      className
    )}>
      <div 
        className="absolute -right-4 -bottom-4 opacity-[0.08] pointer-events-none transform -rotate-[15deg]"
        style={{ color }}
      >
        <Icon size={110} strokeWidth={1.5} />
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <h3 className="text-[10px] font-black text-[#111f42] uppercase tracking-widest leading-tight w-24">
          {label}
        </h3>
        <div className={clsx("p-2.5 rounded-[14px]", bg)} style={{ color }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="relative z-10 mt-4">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-black text-[#111f42] font-mono tracking-tighter leading-none">
            {value}
          </div>
          {trend && (
            <span className={clsx("text-[10px] font-bold font-mono", trendColor)}>
              {trend}
            </span>
          )}
        </div>
        {subLabel && (
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
}
