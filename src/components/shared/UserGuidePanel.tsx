import React from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from './SharedUI';

export function UserGuidePanel({ isOpen, onClose, title, iconName, children }: { isOpen: boolean, onClose: () => void, title: string, iconName: string, children: React.ReactNode }) {
    if (typeof document === 'undefined') return null;
    return createPortal(
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-[#2E395F]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-[#E6E1DB] bg-[#F2F4F6] text-[#2E395F] shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm">
                        <LucideIcon name={iconName} size={18} className="text-[#55738D]"/> {title}
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-[#737597] hover:text-[#C22D2E] rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-[#737597] leading-relaxed text-[12px]">
                    {children}
                </div>
                <div className="p-6 bg-[#F2F4F6]/50 border-t border-[#E6E1DB] flex justify-end shadow-inner">
                    <button onClick={onClose} className="px-8 py-3 bg-[#55738D] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#2E395F] transition-all shadow-sm">ปิดคู่มือ</button>
                </div>
            </div>
        </>,
        document.body
    );
}
