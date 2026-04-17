import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';
import { getMockHistory } from '../utils/data';

export function ItemModal({ isOpen, onClose, data, onSave, categories, brands, activeMainTab }: any) {
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        sku: '', name: '', cat: '', type: 'FG', brand: '', w: 0, pieces: 0, status: 'Active'
    });
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab('info');
            if (data) {
                setFormData({ ...data });
                setHistory(getMockHistory());
            } else {
                setFormData({ sku: '', name: '', type: activeMainTab, cat: categories[1], brand: brands[0], w: 0, pieces: 0, status: 'Active' });
                setHistory([]);
            }
        }
    }, [isOpen, data, activeMainTab]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.sku || !formData.name) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'SKU and Name are required.' });
            return;
        }
        onSave(formData);
        onClose();
    };

    const isFinishedGood = formData.type === 'FG';

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#141619]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden relative border border-white/40 h-[85vh] md:h-[600px]">
                <div className="bg-[#2E395F] px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#E6E1DB] modal-handle cursor-move">
                    <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                            <LucideIcon name={data ? "edit-3" : "plus-circle"} size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{data ? 'Edit Master Item' : 'New Master Item'}</h3>
                            <p className="text-[10px] font-bold text-[#90B7BF] uppercase tracking-widest mt-1.5">{data ? formData.sku : `Create new ${activeMainTab} record`}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-[#F2F4F6] border-r border-[#E6E1DB] p-5 flex flex-col gap-3 shrink-0">
                        <button onClick={()=>setActiveTab('info')} className={`w-full p-4 rounded-xl text-left transition-all ${activeTab==='info'?'bg-[#2E395F] text-[#EFEBCE] shadow-md':'text-[#737597] hover:bg-white hover:shadow-sm'}`}>
                            <div className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2"><LucideIcon name="info" size={14}/> General Info</div>
                        </button>
                        {data && (
                            <button onClick={()=>setActiveTab('history')} className={`w-full p-4 rounded-xl text-left transition-all ${activeTab==='history'?'bg-[#2E395F] text-[#EFEBCE] shadow-md':'text-[#737597] hover:bg-white hover:shadow-sm'}`}>
                                <div className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2"><LucideIcon name="history" size={14}/> History Log</div>
                            </button>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                        {activeTab === 'info' ? (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">SKU Code</label>
                                    <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} disabled={!!data} className={`w-full border border-[#B2CADE] rounded-xl p-2.5 text-[12px] font-mono font-bold focus:border-[#C22D2E] transition-all outline-none ${data ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`} placeholder="Ex. FG-1001" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Item Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none" placeholder="Enter product name..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Category / Sub-Cat</label>
                                    <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer">
                                        {categories.filter((c: string) => c !== 'All').map((c: string) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                
                                {isFinishedGood && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Brand</label>
                                            <div className="relative">
                                                <input type="text" list="brandsList" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none" placeholder="Select or Type..." />
                                                <datalist id="brandsList">
                                                    {brands.map((b: string) => <option key={b} value={b} />)}
                                                </datalist>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Weight (g)</label>
                                            <input type="number" step="0.1" value={formData.w} onChange={e => setFormData({...formData, w: parseFloat(e.target.value)})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none font-mono" placeholder="e.g. 500, 1000" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Pieces / Pack</label>
                                            <input type="number" value={formData.pieces} onChange={e => setFormData({...formData, pieces: parseInt(e.target.value)})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-2.5 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none font-mono" placeholder="e.g. 10, 50" />
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4 border-b border-[#E6E1DB] pb-2">
                                    <h4 className="text-[12px] font-black text-[#2E395F] uppercase tracking-widest">Change Log</h4>
                                    <span className="text-[10px] font-black bg-[#F2F4F6] text-[#737597] px-2 py-0.5 rounded-md uppercase tracking-widest">{history.length} records</span>
                                </div>
                                <div className="relative border-l-2 border-[#E6E1DB] ml-3 space-y-6">
                                    {history.map((log, idx) => (
                                        <div key={idx} className="ml-5 relative">
                                            <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#B2CADE] border-2 border-white shadow-sm"></div>
                                            <div className="bg-[#F2F4F6]/50 p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`font-black text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-md ${log.action === 'Create' ? 'bg-[#537E72]/10 text-[#537E72]' : 'bg-[#DCBC1B]/10 text-[#B06821]'}`}>{log.action}</span>
                                                    <span className="text-[10px] text-[#737597] font-mono font-bold">{log.date}</span>
                                                </div>
                                                <p className="text-[#2E395F] text-[12px] mb-2 font-bold">{log.detail}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-[#55738D] font-bold uppercase tracking-widest border-t border-[#E6E1DB] pt-2">
                                                    <LucideIcon name="user" size={12} /> <span>{log.user}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><LucideIcon name="save" size={14}/> Save Item</button>
                </div>
            </StandardModalWrapper>
        </div>
    );
}
