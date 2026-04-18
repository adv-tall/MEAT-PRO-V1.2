import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import Swal from 'sweetalert2';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { CsvUploadModal } from './components/CsvUploadModal';
import { MatrixConfigModal } from './components/MatrixConfigModal';

// --- Comprehensive Mock Data (22 Items) ---
const MOCK_STANDARDS = [
    {id: 'BT-CK-STD', name: 'เนื้อไส้กรอกไก่ (Standard)'},
    {id: 'BT-MB-CK-A', name: 'เนื้อลูกชิ้นไก่เกรด A'},
    {id: 'BT-MB-FH', name: 'เนื้อลูกชิ้นปลาเยาวราช'},
    {id: 'BT-BL-CH', name: 'เนื้อโบโลน่าผสมพริก'},
    {id: 'BT-HM-CK', name: 'เนื้อแฮมไก่'},
    {id: 'BT-KY', name: 'เนื้อไก๋ยอ'},
    {id: 'BT-BL-PK', name: 'เนื้อโบโลน่าหมู'},
    {id: 'BT-PK-STD', name: 'เนื้อไส้กรอกหมู (Standard)'},
    {id: 'BT-MB-PK-A', name: 'เนื้อลูกชิ้นหมูเกรด A'},
    {id: 'BT-MB-BF', name: 'เนื้อลูกชิ้นวัว'},
    {id: 'BT-MB-BF-T', name: 'เนื้อลูกชิ้นเอ็นวัว'},
    {id: 'BT-CK-GR', name: 'เนื้อไส้กรอกไก่กระเทียม'},
    {id: 'BT-CK-VN', name: 'เนื้อไส้กรอกไก่วุ้นเส้น'},
    {id: 'BT-HM-YK', name: 'เนื้อยอร์คแฮม'},
    {id: 'BT-BC-SM', name: 'เนื้อเบคอนรมควัน'},
    {id: 'BT-MY-BP', name: 'เนื้อหมูยอพริกไทยดำ'},
    {id: 'BT-MB-SQ', name: 'เนื้อลูกชิ้นปลาหมึก'},
    {id: 'FL-CHZ', name: 'ไส้ชีส (Cheese Filling)'},
    {id: 'FL-KTC', name: 'ซอสมะเขือเทศ (Ketchup Filling)'},
    {id: 'LY-CK-GRN', name: 'เนื้อไก่บดผสมผักโขม (Green Layer)'},
    {id: 'LY-CK-WHT', name: 'เนื้อไก่บดสีขาว (White Layer)'},
    {id: 'LY-CK-RED', name: 'เนื้อไก่บดผสมปาปริก้า (Red Layer)'},
];

const MOCK_MATRIX = [
    { 
        id: 'SFG-001', name: 'ไส้กรอกไก่รมควัน 6 นิ้ว (จัมโบ้)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 100}], 
        fgs: [{sku: 'FG-1001', name: 'SMC ไส้กรอกไก่ ARO 1kg', weight: 1, pieces: 20}, {sku: 'FG-1002', name: 'SMC ไส้กรอกไก่ 500g', weight: 0.5, pieces: 10}, {sku: 'FG-1003', name: 'SMC ไส้กรอกไก่ 5kg', weight: 5, pieces: 100}] 
    },
    { 
        id: 'SFG-002', name: 'ไส้กรอกไก่คอกเทล 4 นิ้ว', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 100}], 
        fgs: [{sku: 'FG-2001', name: 'CP Frank Cocktail 1kg', weight: 1, pieces: 80}, {sku: 'FG-2002', name: 'CP Frank Cocktail 0.5kg', weight: 0.5, pieces: 40}, {sku: 'FG-2003', name: 'CP Frank 1kg', weight: 1, pieces: 80}, {sku: 'FG-2004', name: 'CP Frank 0.5kg', weight: 0.5, pieces: 40}, {sku: 'FG-2005', name: 'CP Frank 0.2kg', weight: 0.2, pieces: 15}, {sku: 'FG-2006', name: 'CP Frank 5kg', weight: 5, pieces: 400}] 
    },
    { 
        id: 'SFG-003', name: 'ลูกชิ้นไก่ (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-CK-A', ratio: 100}], 
        fgs: [{sku: 'FG-3001', name: 'ลูกชิ้นไก่เกรด A 1kg', weight: 1, pieces: 100}, {sku: 'FG-3002', name: 'ลูกชิ้นไก่เกรด A 0.5kg', weight: 0.5, pieces: 50}] 
    },
    { 
        id: 'SFG-004', name: 'ลูกชิ้นปลา (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-FH', ratio: 100}], 
        fgs: [{sku: 'FG-3005', name: 'ลูกชิ้นปลาเยาวราช', weight: 0.5, pieces: 45}] 
    },
    { 
        id: 'SFG-005', name: 'ลูกชิ้นไก่ (ย่างเสียบไม้)', 
        batterConfig: [{id: 'BT-MB-CK-A', ratio: 100}], 
        fgs: [{sku: 'FG-3010', name: 'ลูกชิ้นไก่ย่าง', weight: 0.8, pieces: 10}] 
    },
    { 
        id: 'SFG-006', name: 'โบโลน่าไก่พริก (แท่งยาวรอสไลซ์)', 
        batterConfig: [{id: 'BT-BL-CH', ratio: 100}], 
        fgs: [{sku: 'FG-4001', name: 'BKP Chili Bologna 1kg', weight: 1, pieces: 50}, {sku: 'FG-4002', name: 'BKP Chili Bologna 0.2kg', weight: 0.2, pieces: 10}] 
    },
    { 
        id: 'SFG-007', name: 'แฮมไก่ (Block สี่เหลี่ยมรอสไลซ์)', 
        batterConfig: [{id: 'BT-HM-CK', ratio: 100}], 
        fgs: [{sku: 'FG-4005', name: 'Chicken Ham Block', weight: 0.5, pieces: 25}] 
    },
    { 
        id: 'SFG-008', name: 'ไก่ยอแผ่น (นึ่งสายพาน)', 
        batterConfig: [{id: 'BT-KY', ratio: 100}], 
        fgs: [{sku: 'FG-5001', name: 'ไก่ยอแผ่นเล็ก', weight: 0.5, pieces: 5}, {sku: 'FG-5002', name: 'ไก่ยอแผ่นใหญ่', weight: 1, pieces: 10}] 
    },
    { 
        id: 'SFG-009', name: 'ไส้กรอกไก่สอดไส้ชีส (Cheese-Stuffed)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 80}, {id: 'FL-CHZ', ratio: 20}], 
        fgs: [{sku: 'FG-8001', name: 'Cheese Sausage 0.5kg', weight: 0.5, pieces: 30}] 
    },
    { 
        id: 'SFG-010', name: 'ไส้กรอกไก่สอดไส้ซอสมะเขือเทศ (Ketchup-Stuffed)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 85}, {id: 'FL-KTC', ratio: 15}], 
        fgs: [{sku: 'FG-8002', name: 'Ketchup Sausage 1kg', weight: 1, pieces: 60}] 
    }
];

const MOCK_MASTER = MOCK_MATRIX.flatMap(sfg => sfg.fgs);

export default function ProductMatrix() {
    const [searchTerm, setSearchQuery] = useState('');
    const [matrixData, setMatrixData] = useState<any[]>([]);
    const [masterItems, setMasterItems] = useState<any[]>([]);
    const [batters, setBatters] = useState<any[]>([]);
    const [modal, setModal] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock Data Loading for Standalone Environment
    useEffect(() => {
        const load = () => {
            setLoading(true);
            setTimeout(() => {
                setMasterItems(MOCK_MASTER);
                setBatters(MOCK_STANDARDS);
                setMatrixData(MOCK_MATRIX);
                setLoading(false);
            }, 600); // Simulate network delay
        };
        load();
    }, []);

    const filteredData = useMemo(() => matrixData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, matrixData]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSave = (item: any) => { 
        const newData = modal.data ? matrixData.map(i => i.id === item.id ? item : i) : [...matrixData, item]; 
        setMatrixData(newData); 
        Swal.fire({ icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
    };
    
    const handleDelete = (id: string) => { 
        Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E' }).then((r) => { 
            if(r.isConfirmed) { setMatrixData(matrixData.filter(i => i.id !== id)); } 
        }); 
    };

    if(loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading Matrix Data...</span>
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
            <div className="flex flex-col h-full w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="MATRIX GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="git-merge" size={16} className="text-[#55738D]"/> Product Structure
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>SFG Definition:</strong> กำหนดสินค้ากึ่งสำเร็จรูปที่เป็นแกนหลักในการผลิต</li>
                            <li><strong>Batter Config:</strong> กำหนดสูตร Batter หรือส่วนผสมที่ใช้ (รองรับหลาย Layer/Filling) โดยต้องระบุสัดส่วนรวมกันให้ได้ 100%</li>
                            <li><strong>FG Mapping:</strong> จับคู่สินค้าขาย (SKU) ที่เกิดจาก SFG ตัวนี้ เพื่อให้ระบบสามารถคำนวณการผลิตย้อนกลับได้ถูกต้อง</li>
                        </ul>
                    </section>
                </UserGuidePanel>
                
                <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} onUpload={(d) => { setMatrixData([...matrixData, ...d]); }} />
                <MatrixConfigModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, data: null })} sfgData={modal.data} onSave={handleSave} batters={batters} fgDatabase={masterItems} />

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-0">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.GitMerge size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">PRODUCT</span>
                                <span className="text-[#C22D2E]">MATRIX</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">กำหนดโครงสร้างความสัมพันธ์ Batter &rarr; SFG &rarr; FG</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0 mt-4">
                    <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                        
                        {/* TOOLBAR */}
                        <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-[12px] font-black text-[#2E395F] uppercase tracking-widest">
                                    <LucideIcon name="list" size={16} className="text-[#C22D2E]"/>
                                    <span>SFG Master List</span>
                                </div>
                                <span className="text-[#E6E1DB]">|</span>
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-2 py-1 rounded-sm">{filteredData.length} Records</div>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <LucideIcon name="search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                    <input type="text" placeholder="Search SFG..." value={searchTerm} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] w-56 bg-white shadow-sm text-[#2E395F] h-10" />
                                </div>
                                <button onClick={() => setCsvModalOpen(true)} className="bg-white border border-[#E6E1DB] hover:border-[#B2CADE] text-[#55738D] px-4 py-2 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors"><LucideIcon name="upload" size={14} /> Import</button>
                                <button onClick={() => setModal({ isOpen: true, data: null })} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-all active:scale-95"><LucideIcon name="plus" size={14} /> New SFG</button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left min-w-[1000px] border-collapse">
                                    <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                                        <tr>
                                            <th className="py-4 px-6 pl-8 w-[25%]">SFG Code & Name</th>
                                            <th className="py-4 px-6 w-[25%]">Source Batter(s) & Formula</th>
                                            <th className="py-4 px-6 w-[40%] min-w-[400px]">Mapped FGs</th>
                                            <th className="py-4 px-6 pr-8 text-right w-24">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {currentItems.map(item => (
                                            <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group">
                                                
                                                {/* Col 1: SFG Code & Name */}
                                                <td className="py-2.5 px-6 pl-8 align-middle">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="font-bold text-[#2E395F] text-[12px] leading-tight">{item.name}</span>
                                                        <span className="bg-[#F2F4F6] text-[#737597] border border-[#E6E1DB] px-2 py-0.5 rounded-md text-[11px] font-mono">{item.id}</span>
                                                    </div>
                                                </td>

                                                {/* Col 2: Batter Config */}
                                                <td className="py-2.5 px-6 align-middle">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.batterConfig?.map((b: any, i: number) => {
                                                            const std = batters.find(x => x.id === b.id);
                                                            const isFilling = b.id.startsWith('FL-');
                                                            const isLayer = b.id.startsWith('LY-');
                                                            const bgClass = isFilling ? 'bg-[#FFF8EB] border-[#F2E3C6]' : 'bg-[#F2F4F6] border-[#E6E1DB]';
                                                            const textClass = isFilling ? 'text-[#B06821]' : 'text-[#55738D]';
                                                            let icon = 'database';
                                                            if (isFilling) icon = 'droplet';
                                                            if (isLayer) icon = 'layers';
                                                            
                                                            return (
                                                                <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded-md border w-fit shadow-sm ${bgClass}`}>
                                                                    <span className={`font-mono text-[11px] w-[24px] text-right shrink-0 ${textClass}`}>{b.ratio}%</span>
                                                                    <LucideIcon name={icon} size={14} className={`${textClass} shrink-0`} />
                                                                    <span className={`text-[11px] whitespace-nowrap ${textClass}`}>{std?.name || b.id}</span>
                                                                </div>
                                                            )
                                                        })}
                                                        {(!item.batterConfig?.length) && <span className="text-[#737597] italic text-[11px]">No Configuration</span>}
                                                    </div>
                                                </td>

                                                {/* Col 3: Mapped FGs */}
                                                <td className="py-2.5 px-6 align-middle">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.fgs?.map((f: any, i: number) => (
                                                            <div key={i} className="flex items-center gap-1.5 bg-white border border-[#E6E1DB] rounded-md px-1.5 py-1 shadow-sm shrink-0 w-fit">
                                                                <span className="bg-[#F2F4F6] text-[#737597] font-mono text-[11px] px-1.5 py-0.5 rounded-md">{f.sku}</span>
                                                                <span className="text-[#55738D] font-mono text-[11px]">{f.weight}kg</span>
                                                                <span className="bg-red-50 text-[#C22D2E] border border-red-100 font-mono text-[11px] px-1.5 py-0.5 rounded-md">{f.pieces}pcs</span>
                                                            </div>
                                                        ))}
                                                        {(!item.fgs?.length) && <span className="text-[#737597] italic text-[11px]">No FG Mapped</span>}
                                                    </div>
                                                </td>

                                                {/* Col 4: Action */}
                                                <td className="py-2.5 px-6 pr-8 align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setModal({ isOpen: true, data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white"><LucideIcon name="pencil" size={14} /></button>
                                                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white"><LucideIcon name="trash-2" size={14} /></button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                        {currentItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
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
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><LucideIcon name="chevron-left" size={16}/></button>
                                    <div className="bg-white border border-[#B2CADE]/30 px-5 py-1.5 rounded-lg shadow-sm text-[#2E395F] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><LucideIcon name="chevron-right" size={16}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
