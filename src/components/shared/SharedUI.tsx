import React from 'react';
import * as Icons from 'lucide-react';

export const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

export const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp || Icons.Activity;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
};

export const GuideTrigger = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-[#55738D] text-white py-4 px-2 rounded-l-xl shadow-[-4px_0_15px_rgba(0,0,0,0.15)] hover:bg-[#C22D2E] transition-colors duration-300 z-[100] flex flex-col items-center gap-3 group border border-r-0 border-white/20"
  >
    <LucideIcon name="help-circle" size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-xs">
      USER GUIDE
    </span>
  </button>
);
