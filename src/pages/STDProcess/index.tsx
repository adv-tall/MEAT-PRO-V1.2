import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from 'lucide-react';
import Swal from 'sweetalert2';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { CsvUploadModal } from './components/CsvUploadModal';
import { ConfigModal } from './components/ConfigModal';

const IS_DEMO = false;
const INITIAL_CATEGORIES = ['Sausage', 'Meatball', 'Ham', 'Bologna', 'WIP-Emulsion'];

const MOCK_STANDARDS = [
    {
        id: 'STD-001', name: 'Standard Smoked Sausage', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '26/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Standard Pork', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Standard Pork', size: 'Jumbo', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '1kg', format: 'Bag', sfgSize: 'Jumbo', capacityKgHr: 1000 }],
        packVariants: []
    },
    {
        id: 'STD-002', name: 'Premium Meatball', category: 'Meatball', rawWeightPerBatch: 100, yieldPercent: 95, status: 'Active', updateDate: '25/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Premium Beef', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Premium Beef', size: 'M', type: 'Belt Former', casing: '', stuffed: false, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 4T', program: 'Steam_01', cycleTimeMin: 60, capacityBatch: 8 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 40, capacityBatch: 8 }],
        peelingStandards: [],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Flow Pack', packSize: '500g', format: 'Bag', sfgSize: 'M', capacityKgHr: 800 }],
        packVariants: []
    },
    {
        id: 'BAT-SMC-01', name: 'Batter ไส้กรอกรมควัน (Smoked)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Smoked Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-MTB-02', name: 'Batter ลูกชิ้นหมู (Pork Meatball)', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Pork Meatball Formula', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-BOL-04', name: 'Batter โบโลน่า (Bologna)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-001', name: 'Smoked Sausage SFG', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [], 
        formingStandards: [{ id: 1, batter: 'Smoked Batter', size: 'M', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [], packingStandards: [], packVariants: []
    }
];

const getCategoryStyle = (category: string) => {
    switch (category?.toUpperCase()) {
        case 'SAUSAGE': return 'bg-white text-[#C22D2E] border-[#C22D2E]/30';
        case 'MEATBALL': return 'bg-white text-[#55738D] border-[#55738D]/30';
        case 'BOLOGNA': return 'bg-white text-[#BB8588] border-[#BB8588]/30';
        case 'HAM': return 'bg-white text-[#B06821] border-[#D8A48F]/30';
        case 'WIP-EMULSION': return 'bg-white text-[#537E72] border-[#537E72]/30';
        default: return 'bg-white text-[#737597] border-[#E6E1DB]';
    }
};

const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-white text-[#3A7283] border-[#3A7283]/60';
        case 'INACTIVE': return 'bg-white text-[#94A3B8] border-[#94A3B8]/60';
        case 'DRAFT': return 'bg-white text-[#B06821] border-[#B06821]/60';
        default: return 'bg-white text-gray-400 border-gray-300';
    }
};

export default function STDProcess() {
    const [searchTerm, setSearchQuery] = useState('');
    const [masterData, setMasterData] = useState<any[]>([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [categories] = useState(INITIAL_CATEGORIES);
    const [modalConfig, setModalConfig] = useState<{isOpen: boolean, mode: string, data: any}>({ isOpen: false, mode: 'view', data: null });
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock Data Loading
    useEffect(() => {
        const load = () => {
            setLoading(true);
            setTimeout(() => {
                setMasterData(MOCK_STANDARDS);
                setLoading(false);
            }, 600);
        };
        load();
    }, []);

    const filteredData = useMemo(() => {
        return masterData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, masterData, filterCategory]);

    const handleDelete = (id: string) => {
        Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' }).then((result) => { 
            if (result.isConfirmed) { 
                setMasterData(masterData.filter(item => item.id !== id)); 
                Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record deleted.', timer: 1500, showConfirmButton: false}); 
            } 
        });
    };

    const handleSave = (newItem: any) => {
        if (modalConfig.data) {
             setMasterData(masterData.map(i => i.id === newItem.id ? { ...newItem, updateDate: new Date().toLocaleDateString('en-GB') } : i));
        } else {
             const newId = `STD-${Date.now().toString().slice(-6)}`;
             setMasterData([{ ...newItem, id: newId, updateDate: new Date().toLocaleDateString('en-GB') }, ...masterData]);
        }
    };

    const handleCsvUpload = (newItems: any[]) => {
        const updated = [...masterData];
        newItems.forEach(ni => {
            const idx = updated.findIndex(u => u.id === ni.id);
            if (idx >= 0) updated[idx] = ni; else updated.unshift(ni);
        });
        setMasterData(updated);
    };

    // Pagination
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterCategory, itemsPerPage]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) return (
        <div className="flex flex-1 h-full w-full items-center justify-center bg-transparent min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading STD Data...</span>
            </div>
        </div>
    );

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
              .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}} />
            <div className="flex flex-col min-h-screen w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pb-10 pt-8" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="STD PROCESS GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <Icons.Settings2 size={16} className="text-[#55738D]"/> Overview
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>Purpose:</strong> กำหนดมาตรฐานกระบวนการผลิต (Routing) และ Parameters ของแต่ละขั้นตอนสำหรับสินค้านั้นๆ</li>
                            <li><strong>Process Steps:</strong> สามารถตั้งค่าได้ตั้งแต่ Mixing, Forming, Cooking, Cooling, ไปจนถึง Packing</li>
                            <li><strong>Capacity & Yield:</strong> ระบุ Batch Size, Cycle Time และ Yield เพื่อใช้ในการคำนวณแผนการผลิต</li>
                        </ul>
                    </section>
                </UserGuidePanel>

                <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} onUpload={handleCsvUpload} />
                <ConfigModal 
                    isOpen={modalConfig.isOpen} 
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false, data: null })} 
                    data={modalConfig.data} 
                    mode={modalConfig.mode}
                    onSave={handleSave} 
                    categories={categories}
                />

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.Settings2 size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">STD</span>
                                <span className="text-[#C22D2E]">PROCESS</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Configure Production Standards & Routing</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                        
                        {/* TOOLBAR */}
                        <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-[12px] font-black text-[#2E395F] uppercase tracking-widest">
                                    <Icons.List size={16} className="text-[#C22D2E]"/>
                                    <span>Process Standards</span>
                                </div>
                                <span className="text-[#E6E1DB]">|</span>
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-2 py-1 rounded-sm">{filteredData.length} Records</div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto items-center">
                                <div className="relative group">
                                    <Icons.Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#55738D] group-hover:text-[#C22D2E] transition-colors" />
                                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="pl-9 pr-8 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold bg-white focus:border-[#C22D2E] outline-none cursor-pointer transition-all text-[#2E395F] shadow-sm appearance-none h-10">
                                        <option value="All">All Categories</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <Icons.ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55738D] pointer-events-none" />
                                </div>
                                <div className="relative flex-1 md:w-64">
                                    <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                    <input type="text" placeholder="Search ID, Name..." value={searchTerm} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" />
                                </div>
                                <button onClick={() => setCsvModalOpen(true)} className="bg-white border border-[#E6E1DB] hover:border-[#B2CADE] text-[#55738D] px-4 py-2 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors hidden md:flex h-10"><Icons.Upload size={14} /> Import</button>
                                <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', data: null })} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                                    <Icons.Plus size={14} /> New Standard
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left min-w-[1000px] border-collapse">
                                    <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                                        <tr>
                                            <th className="py-4 px-6 pl-8 w-[15%] whitespace-nowrap">Standard ID</th>
                                            <th className="py-4 px-6 w-[25%] whitespace-nowrap">Standard Name</th>
                                            <th className="py-4 px-6 w-[15%] whitespace-nowrap">Category</th>
                                            <th className="py-4 px-6 w-[12%] text-right whitespace-nowrap">Batch Size</th>
                                            <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Yield</th>
                                            <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                            <th className="py-4 px-6 pr-8 text-right w-24 whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {currentItems.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group">
                                                
                                                {/* Col 1: ID */}
                                                <td className="py-2 px-6 pl-8 align-middle">
                                                    <span className="font-bold text-[#C22D2E] text-[12px] font-mono leading-tight bg-[#C22D2E]/10 px-2 py-0.5 rounded-md border border-[#C22D2E]/20 cursor-pointer hover:bg-[#C22D2E] hover:text-white transition-colors" onClick={() => setModalConfig({ isOpen: true, mode: 'view', data: item })}>
                                                        {item.id}
                                                    </span>
                                                </td>

                                                {/* Col 2: Name */}
                                                <td className="py-2 px-6 align-middle">
                                                    <div className="font-bold text-[#2E395F] text-[12px] leading-tight cursor-pointer hover:text-[#C22D2E] transition-colors" onClick={() => setModalConfig({ isOpen: true, mode: 'view', data: item })}>
                                                        {item.name}
                                                    </div>
                                                </td>

                                                {/* Col 3: Category */}
                                                <td className="py-2 px-6 align-middle">
                                                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-normal uppercase tracking-widest shadow-sm ${getCategoryStyle(item.category)}`}>
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* Col 4: Batch Size */}
                                                <td className="py-2 px-6 align-middle text-right">
                                                    <div className="flex items-baseline justify-end gap-1 whitespace-nowrap">
                                                        <span className="font-mono font-black text-[#2E395F] text-[12px]">
                                                            {item.rawWeightPerBatch}
                                                        </span>
                                                        <span className="text-[10px] text-[#737597] font-bold uppercase tracking-widest">
                                                            KG
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Col 5: Yield */}
                                                <td className="py-2 px-6 align-middle text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-16 h-1.5 bg-[#E6E1DB] rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#537E72] rounded-full" style={{ width: `${item.yieldPercent}%` }}></div>
                                                        </div>
                                                        <span className="font-mono font-black text-[#537E72] text-[11px] leading-none">{item.yieldPercent}%</span>
                                                    </div>
                                                </td>
                                                
                                                {/* Col 6: Status */}
                                                <td className="py-2 px-6 align-middle text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal uppercase tracking-widest shadow-sm border whitespace-nowrap ${getStatusStyle(item.status)}`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>

                                                {/* Col 7: Action */}
                                                <td className="py-2 px-6 pr-8 align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white">
                                                            <Icons.Pencil size={14} />
                                                        </button>
                                                        {!IS_DEMO && (
                                                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white">
                                                                <Icons.Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                        {currentItems.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-12 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                    No Records Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
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
}
