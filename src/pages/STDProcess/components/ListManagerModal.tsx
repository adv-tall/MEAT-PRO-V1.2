import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';

export const ListManagerModal = ({ title, items, onAdd, onRemove, onClose }: { title: string, items: string[], onAdd: (val: string) => void, onRemove: (val: string) => void, onClose: () => void }) => {
    const [newItem, setNewItem] = useState('');
    
    const handleAdd = () => {
        if (!newItem.trim()) return;
        if (items.includes(newItem.trim())) {
            Swal.fire({ icon: 'warning', title: 'Duplicate', text: 'This item already exists.', timer: 1500, showConfirmButton: false });
            return;
        }
        onAdd(newItem.trim());
        setNewItem('');
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#141619]/40 backdrop-blur-sm p-4 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl border border-white/40 w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
                <div className="bg-[#2E395F] px-5 py-4 flex justify-between items-center text-white shrink-0 modal-handle cursor-move">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 pointer-events-none"><LucideIcon name="settings-2" size={16} className="text-[#DCBC1B]"/> {title}</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><LucideIcon name="x" size={18}/></button>
                </div>
                <div className="p-6 bg-[#F2F4F6] flex-1 overflow-hidden flex flex-col">
                    <div className="flex gap-2 mb-5 shrink-0">
                        <input 
                            type="text" 
                            value={newItem} 
                            onChange={(e) => setNewItem(e.target.value)} 
                            className="flex-1 border border-[#B2CADE] rounded-xl px-4 py-2.5 text-[12px] font-bold focus:outline-none focus:border-[#C22D2E] focus:bg-white shadow-sm" 
                            placeholder="Add new option..."
                            onKeyDown={(e) => { if(e.key === 'Enter') handleAdd(); }}
                        />
                        <button onClick={handleAdd} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-4 py-2.5 rounded-xl transition-colors shadow-md flex-shrink-0">
                            <LucideIcon name="plus" size={16}/>
                        </button>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar space-y-2 pr-2 flex-1">
                        {items.length === 0 ? (
                            <div className="text-center py-8 text-[#737597] text-[10px] font-bold uppercase tracking-widest opacity-50">No items configured.</div>
                        ) : (
                            items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white border border-[#E6E1DB] p-3 rounded-xl shadow-sm group hover:border-[#C22D2E]/30 transition-colors">
                                    <span className="text-[12px] font-bold text-[#2E395F]">{item}</span>
                                    <button onClick={() => onRemove(item)} className="text-[#737597] hover:text-[#C22D2E] transition-colors p-1 bg-gray-50 rounded-md border border-transparent hover:border-red-100 flex-shrink-0"><LucideIcon name="trash-2" size={14}/></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </StandardModalWrapper>
        </div>,
        document.body
    );
};
