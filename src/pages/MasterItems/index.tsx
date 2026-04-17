import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Swal from 'sweetalert2';
import { CATEGORIES, BRANDS, generateFullMasterItems, getCategoryStyle, getStatusStyle } from './utils/data';
import { GuideTrigger } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { CsvUploadModal } from './components/CsvUploadModal';
import { ItemModal } from './components/ItemModal';

export default function MasterItems() {
    const [items, setItems] = useState(generateFullMasterItems());
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMainTab, setActiveMainTab] = useState('FG');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showGuide, setShowGuide] = useState(false);
    
    // Modal states
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [itemModal, setItemModal] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchSearch = (item.sku + item.name + item.brand).toLowerCase().includes(searchTerm.toLowerCase());
            return matchSearch && item.type === activeMainTab;
        });
    }, [items, searchTerm, activeMainTab]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeMainTab]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDelete = (sku: string) => {
        Swal.fire({
            title: 'Are you sure?', text: `Delete item ${sku}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setItems(prev => prev.filter(item => item.sku !== sku));
                Swal.fire({icon: 'success', title: 'Deleted!', text: 'Item has been deleted.', timer: 1500, showConfirmButton: false});
            }
        });
    };

    const handleSaveItem = (newItem: any) => {
        if (itemModal.data) {
            setItems(items.map(item => item.sku === newItem.sku ? { ...newItem, updated: new Date().toLocaleDateString('en-GB') } : item));
        } else {
            setItems([{ ...newItem, id: `item-${Date.now()}`, updated: new Date().toLocaleDateString('en-GB') }, ...items]);
        }
        Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const handleCsvUpload = (newItems: any[]) => {
        const updatedItems = [...items];
        newItems.forEach(newItem => {
            const idx = updatedItems.findIndex(i => i.sku === newItem.sku);
            if (idx >= 0) { updatedItems[idx] = newItem; } 
            else { updatedItems.push(newItem); }
        });
        setItems(updatedItems);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
              @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
              
              .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
              
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}} />
            <div className="flex flex-col min-h-screen w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>

            
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="MASTER ITEM GUIDE" iconName="book-open">
                <section>
                    <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                        <Icons.Database size={16} className="text-[#55738D]"/> Overview
                    </h4>
                    <ul className="list-disc list-outside ml-4 space-y-2">
                        <li><strong>Centralized Hub:</strong> จัดการฐานข้อมูลรายการวัตถุดิบและสินค้าทั้งหมดที่ใช้ในระบบ</li>
                        <li><strong>Batter:</strong> สูตรส่วนผสมที่ใช้เตรียมก่อนการขึ้นรูป</li>
                        <li><strong>SFG:</strong> สินค้ากึ่งสำเร็จรูปที่เป็นแกนกลางในการจับคู่กับสินค้าขาย</li>
                        <li><strong>FG:</strong> สินค้าสำเร็จรูปพร้อมขายตาม SKU แยกตามแบรนด์</li>
                    </ul>
                </section>
                <section>
                    <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                        <Icons.UploadCloud size={16} className="text-[#55738D]"/> Importing Data
                    </h4>
                    <p className="mb-2">สามารถนำเข้าข้อมูลจำนวนมากผ่านไฟล์ CSV ได้ โดยต้องมี Header ดังนี้:</p>
                    <code className="block bg-[#F2F4F6] p-2 rounded-md border border-[#E6E1DB] text-[10px] font-mono text-[#55738D] overflow-x-auto">
                        SKU, Name, Category, Brand, Weight, Pieces, Status
                    </code>
                </section>
            </UserGuidePanel>
            <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} onUpload={handleCsvUpload} />
            <ItemModal 
                isOpen={itemModal.isOpen} 
                onClose={() => setItemModal({ isOpen: false, data: null })} 
                data={itemModal.data} 
                onSave={handleSaveItem} 
                categories={CATEGORIES}
                brands={BRANDS}
                activeMainTab={activeMainTab}
            />

            {/* Header Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                        <Icons.Database size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                            <span className="text-[#2E395F]">MASTER ITEM</span>
                            <span className="text-[#C22D2E]">DATABASE</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Centralized Material & Product Hub</p>
                    </div>
                </div>
                
                <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                    {['Batter', 'SFG', 'FG'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setActiveMainTab(t)} 
                            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                                activeMainTab === t ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'
                            }`}
                        >
                            {t === 'Batter' && <Icons.Beaker size={14} />}
                            {t === 'SFG' && <Icons.Layers size={14} />}
                            {t === 'FG' && <Icons.Package size={14} />}
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 w-full px-8 pb-10 flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[12px] font-black text-[#2E395F] uppercase tracking-widest">
                                <Icons.List size={16} className="text-[#C22D2E]"/>
                                <span>{activeMainTab} Item List</span>
                            </div>
                            <span className="text-[#E6E1DB]">|</span>
                            <div className="text-[12px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-2 py-1 rounded-sm">{filteredData.length} Records</div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                <input type="text" placeholder={`Search ${activeMainTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" />
                            </div>
                            <button onClick={() => setCsvModalOpen(true)} className="bg-white border border-[#E6E1DB] hover:border-[#B2CADE] text-[#55738D] px-4 py-2 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors hidden md:flex"><Icons.Upload size={14} /> Import</button>
                            <button onClick={() => setItemModal({ isOpen: true, data: null })} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0">
                                <Icons.Plus size={14} /> New {activeMainTab}
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left min-w-[1050px] border-collapse">
                                <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 w-[14%] whitespace-nowrap">SKU / Code</th>
                                        <th className="py-4 px-6 w-[30%] whitespace-nowrap">Item Name</th>
                                        <th className="py-4 px-6 w-[12%] whitespace-nowrap">Category</th>
                                        <th className="py-4 px-6 w-[10%] whitespace-nowrap">Brand</th>
                                        <th className="py-4 px-6 w-[12%] text-right whitespace-nowrap">Size</th>
                                        <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 w-[12%] text-center whitespace-nowrap">Last Update</th>
                                        <th className="py-4 px-6 pr-8 text-right w-20 whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {paginatedData.map(item => (
                                        <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group h-16">
                                            
                                            {/* Col 1: SKU */}
                                            <td className="py-2.5 px-6 pl-8 align-middle">
                                                <span className="font-normal text-[#C22D2E] text-[11px] font-mono leading-tight bg-[#C22D2E]/10 px-2 py-0.5 rounded-md border border-[#C22D2E]/30">{item.sku}</span>
                                            </td>

                                            {/* Col 2: Name */}
                                            <td className="py-2.5 px-6 align-middle font-bold text-[#2E395F] text-[12px] leading-tight">
                                                {item.name}
                                            </td>

                                            {/* Col 3: Category (Stacked) */}
                                            <td className="py-2.5 px-6 align-middle">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-normal uppercase tracking-widest shadow-sm ${getCategoryStyle(item.cat)}`}>
                                                        {item.cat}
                                                    </span>
                                                    <span className="text-[12px] text-[#55738D] font-normal uppercase tracking-widest pl-1">
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Col 4: Brand */}
                                            <td className="py-2.5 px-6 align-middle">
                                                {item.type === 'FG' ? (
                                                    <span className={`text-[11px] font-bold px-2 py-1 rounded-lg border uppercase tracking-widest flex items-center justify-center ${
                                                        item.brand === 'AFM' ? 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white border-transparent shadow-sm' : 
                                                        item.brand === 'No Brand' ? 'bg-[#F2F4F6] text-[#737597] border-[#E6E1DB] whitespace-pre-wrap w-14 leading-tight' :
                                                        'bg-white text-[#737597] border-[#E6E1DB] whitespace-nowrap w-fit'
                                                    }`}>
                                                        {item.brand.replace('No Brand', 'NO\nBRAND')}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#737597] italic">-</span>
                                                )}
                                            </td>

                                            {/* Col 5: Size (Stacked) */}
                                            <td className="py-2.5 px-6 align-middle text-right">
                                                {item.type === 'FG' ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="font-mono font-bold text-[#2E395F] text-[12px] leading-none whitespace-nowrap">
                                                            {item.w >= 1000 ? `${(item.w / 1000).toLocaleString()} kg` : `${item.w.toLocaleString()} g`}
                                                        </span>
                                                        <span className="text-[11px] text-[#737597] font-normal uppercase tracking-widest leading-tight whitespace-nowrap">
                                                            {item.pieces} PCS./PACK
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#737597] italic text-right w-full block">-</span>
                                                )}
                                            </td>
                                            
                                            {/* Col 6: Status */}
                                            <td className="py-2.5 px-6 align-middle text-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-widest shadow-sm border ${getStatusStyle(item.status)}`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            
                                            {/* Col 7: Last Update */}
                                            <td className="py-2.5 px-6 align-middle text-center">
                                                <span className="font-mono font-bold text-[#737597] text-[12px] whitespace-nowrap">{item.updated}</span>
                                            </td>

                                            {/* Col 8: Action */}
                                            <td className="py-2.5 px-6 pr-8 align-middle">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setItemModal({ isOpen: true, data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white">
                                                        <Icons.Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.sku)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white">
                                                        <Icons.Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                No Records Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (Synced) */}
                        <div className="p-4 bg-white/60 backdrop-blur-md border-t border-[#E6E1DB] flex justify-between items-center font-bold text-[#55738D] uppercase tracking-widest shrink-0 font-mono text-[10px]">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>SHOW:</span>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                        className="bg-white border border-[#B2CADE]/50 rounded-md px-2 py-1 outline-none focus:border-[#2E395F] text-[#2E395F] cursor-pointer"
                                    >
                                        {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>TOTAL {filteredData.length} ITEMS</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><Icons.ChevronLeft size={16}/></button>
                                <div className="bg-white border border-[#B2CADE]/30 px-5 py-1.5 rounded-lg shadow-sm text-[#2E395F] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><Icons.ChevronRight size={16}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
};
