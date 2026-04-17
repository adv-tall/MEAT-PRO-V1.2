import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';

const STEPS = ['Mixing', 'Forming', 'Cooking', 'Cooling', 'Peeling', 'Cutting', 'Packing'];

export function EquipmentModal({ isOpen, onClose, data, onSave }: any) {
    const [formData, setFormData] = useState({ id: '', name: '', step: 'Mixing', qty: 1, note: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData(data ? { ...data } : { id: '', name: '', step: 'Mixing', qty: 1, note: '' });
        }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.id || !formData.name) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'ID and Name are required.' });
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#141619]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-white/40 max-h-[90vh]">
                <div className="bg-[#2E395F] px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#E6E1DB] modal-handle cursor-move">
                    <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                            <LucideIcon name={data ? "edit-3" : "plus-circle"} size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{data ? 'Edit Equipment' : 'New Equipment'}</h3>
                            <p className="text-[10px] font-bold text-[#90B7BF] uppercase tracking-widest mt-1.5">{data ? formData.id : 'Add to registry'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F2F4F6]">
                    <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Equipment ID</label>
                            <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!data} className={`w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-mono font-bold focus:border-[#C22D2E] transition-all outline-none ${data ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`} placeholder="EQ-XXX-001" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Machine Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none" placeholder="e.g. Bowl Cutter 200L" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Process Step</label>
                            <select value={formData.step} onChange={e => setFormData({...formData, step: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer">
                                {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Quantity</label>
                            <input type="number" min="0" value={formData.qty} onChange={e => setFormData({...formData, qty: parseInt(e.target.value) || 0})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-mono font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Note</label>
                            <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none min-h-[80px]" placeholder="Additional details..." />
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><LucideIcon name="save" size={14}/> Save Equipment</button>
                </div>
            </StandardModalWrapper>
        </div>
    );
}
