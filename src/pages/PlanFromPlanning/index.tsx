import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';

// --- Global Styles (Synced with Production Theme) ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  * { 
    font-family: var(--font-mixed) !important; 
    box-sizing: border-box;
  }

  html, body { 
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }

  @keyframes pulseColor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  .animate-pulseColor { animation: pulseColor 2s infinite; }
`;

// --- Mocking External Logic ---
const Swal = typeof window !== 'undefined' ? ((window as any).Swal || null) : null;

// --- THEME ---
// --- THEME ---
const THEME = { 
    primary: '#C22D2E', 
    warning: '#DCBC1B', 
    success: '#537E72', 
    info: '#55738D',
    navy: '#2E395F' 
};

// --- MOCK DATA ---
const BRAND_GROUPS = ['ALL', 'AFM', 'PPSS', 'BKP', 'SAV', 'GEN'];

const generateMockSalesOrders = () => {
    const orders = [];
    let idCounter = 1;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0].replace(/-/g, '').slice(2);
    
    // Top 3 Priority Items
    orders.push({ id: `SO-${tomorrowStr}-001`, sku: 'FG-AFM-001', name: 'ไส้กรอกแดงจัมโบ้ AFM 1kg', reqQty: 50000, reqKg: 50000, deadline: 'Morning (12:00)', brand: 'AFM', status: 'CRITICAL', diffKg: -10000 });
    orders.push({ id: `SO-${tomorrowStr}-002`, sku: 'FG-PPSS-005', name: 'โบโลน่าพริก PPSS 500g', reqQty: 40000, reqKg: 20000, deadline: 'Afternoon (16:00)', brand: 'PPSS', status: 'SHORTAGE', diffKg: -5000 });
    orders.push({ id: `SO-${tomorrowStr}-003`, sku: 'FG-SAV-012', name: 'ลูกชิ้นหมู SAV 1kg', reqQty: 30000, reqKg: 30000, deadline: 'Night (23:59)', brand: 'SAV', status: 'ON TRACK', diffKg: 5000 });

    const brands = ['AFM', 'PPSS', 'BKP', 'SAV', 'GEN'];
    const deadlines = ['Morning (12:00)', 'Afternoon (16:00)', 'Night (23:59)'];
    
    for(let i=0; i<85; i++) {
        const brand = brands[Math.floor(Math.random()*brands.length)];
        const reqKg = Math.floor(Math.random() * 5000) + 500;
        const diffKg = Math.floor(Math.random() * 10000) - 5000; 
        const status = diffKg < -2000 ? 'CRITICAL' : (diffKg < 0 ? 'SHORTAGE' : 'ON TRACK');
        orders.push({
            id: `SO-${tomorrowStr}-${String(idCounter++).padStart(3, '0')}`,
            sku: `FG-${brand}-${String(i+10).padStart(3,'0')}`,
            name: `${brand} สินค้าทดสอบ ${i}`,
            reqQty: Math.ceil(reqKg / 0.5),
            reqKg,
            deadline: deadlines[Math.floor(Math.random()*deadlines.length)],
            brand,
            status,
            diffKg
        });
    }
    return orders;
};

const MOCK_SALES_ORDERS = generateMockSalesOrders();

// --- HELPER COMPONENTS ---

// --- MAIN APPLICATION ---

export default function PlanFromPlanning() {
    const [orders, setOrders] = useState(MOCK_SALES_ORDERS);
    const [loading, setLoading] = useState(true);
    const [activeBrand, setActiveBrand] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const [selectedDate, setSelectedDate] = useState(() => {
        const t = new Date(); t.setDate(t.getDate()+1);
        return t.toISOString().split('T')[0];
    });

    useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchBrand = activeBrand === 'ALL' || o.brand === activeBrand;
            const matchSearch = o.sku.toLowerCase().includes(searchTerm.toLowerCase()) || o.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchBrand && matchSearch;
        }).sort((a, b) => {
            if (a.status === 'CRITICAL' && b.status !== 'CRITICAL') return -1;
            if (a.status !== 'CRITICAL' && b.status === 'CRITICAL') return 1;
            return a.diffKg - b.diffKg;
        });
    }, [orders, activeBrand, searchTerm]);

    const kpiData = useMemo(() => {
        const total = filteredOrders.reduce((sum, o) => sum + o.reqKg, 0);
        const critical = filteredOrders.filter(o => o.status === 'CRITICAL').length;
        const totalShortage = filteredOrders.filter(o => o.diffKg < 0).reduce((sum, o) => sum + Math.abs(o.diffKg), 0);
        const skuCount = filteredOrders.length;
        return { total, critical, totalShortage, skuCount };
    }, [filteredOrders]);

    const paginatedData = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [activeBrand, searchTerm]);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'CRITICAL': return 'bg-[#C22D2E]/10 text-[#C22D2E] border-[#C22D2E]/30 animate-pulseColor';
            case 'SHORTAGE': return 'bg-[#DCBC1B]/10 text-[#B06821] border-[#DCBC1B]/40';
            default: return 'bg-[#537E72]/10 text-[#537E72] border-[#537E72]/30';
        }
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <Icons.Loader2 size={48} className="animate-spin text-[#2E395F]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-[12px] animate-pulse">Syncing ERP Plans...</span>
            </div>
        </div>
    );

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: globalStyles}} />
            <div className="flex flex-col min-h-screen w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="PLANNING GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <Icons.ClipboardList size={16} className="text-[#C22D2E]"/> Overview
                        </h4>
                        <p>ดึงแผนใบสั่งขาย (Sales Order) จากฝ่ายวางแผน เพื่อนำมาคำนวณกำลังผลิตและจ่ายแผนไปยังฝ่ายผลิตในแต่ละวัน</p>
                    </section>
                </UserGuidePanel>

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.ClipboardList size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">PLAN FR</span>
                                <span className="text-[#55738D]">PLANNING</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Sales Order Integration & Demand Analysis</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/40 p-2 rounded-xl inline-flex items-center shadow-inner gap-2 border border-white/40 backdrop-blur-sm shadow-sm">
                        <Icons.Calendar size={18} className="text-[#55738D] ml-2" />
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-[12px] font-black font-mono text-[#2E395F] outline-none cursor-pointer pr-4"
                        />
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-6 relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <KPICard title="Total Demand" val={kpiData.total} unit="Kg" color={THEME.navy} icon="trending-up" desc="Target Weight" />
                        <KPICard title="Critical Items" val={kpiData.critical} unit="SKUs" color={THEME.primary} icon="alert-octagon" desc="Immediate Action Required" />
                        <KPICard title="Total Shortage" val={kpiData.totalShortage} unit="Kg" color={THEME.warning} icon="arrow-down-circle" desc="FG Deficit vs Demand" />
                        <KPICard title="Unique SKUs" val={kpiData.skuCount} unit="Items" color={THEME.info} icon="layers" desc="Production Lines Needed" />
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white/80 backdrop-blur-md rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden min-h-0">
                        {/* TOOLBAR */}
                        <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                            
                            <div className="flex items-center gap-1.5 bg-white border border-[#E6E1DB] p-1 rounded-xl shadow-sm">
                                {BRAND_GROUPS.map(brand => (
                                    <button 
                                        key={brand} 
                                        onClick={() => setActiveBrand(brand)} 
                                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            activeBrand === brand ? 'bg-[#2E395F] text-white shadow-md' : 'text-[#737597] hover:bg-gray-50'
                                        }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3 w-full md:w-auto items-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-3 py-1.5 rounded-md hidden lg:block">
                                    {filteredOrders.length} Plans Extracted
                                </div>
                                <div className="relative flex-1 md:w-64">
                                    <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                    <input 
                                        type="text" 
                                        placeholder="Search SKU or Product Name..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" 
                                    />
                                </div>
                                <button className="bg-[#2E395F] hover:bg-[#141619] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 h-10">
                                    <Icons.Send size={14} className="rotate-45 -mt-1 ml-1"/> Push to Production
                                </button>
                            </div>
                        </div>

                        {/* DATA TABLE */}
                        <div className="flex-1 overflow-hidden flex flex-col relative">
                            <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-20 text-white font-mono uppercase tracking-wider text-[11px] font-black shadow-md">
                                        <tr>
                                            <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Plan ID</th>
                                            <th className="py-4 px-6 w-auto whitespace-nowrap">Product SKU & Name</th>
                                            <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Required (Kg)</th>
                                            <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Stock Diff (Kg)</th>
                                            <th className="py-4 px-6 text-center w-[15%] whitespace-nowrap">Delivery Deadline</th>
                                            <th className="py-4 px-6 pr-8 text-center w-[12%] whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {paginatedData.map(o => (
                                            <tr key={o.id} className="hover:bg-[#F2F4F6]/50 transition-colors group border-b border-[#E6E1DB]">
                                                <td className="py-2 px-6 pl-8 align-middle">
                                                    <span className="font-black text-[#2E395F] text-[12px] font-mono whitespace-nowrap">{o.id}</span>
                                                </td>
                                                <td className="py-2 px-6 align-middle">
                                                    <div className="font-bold text-[#2E395F] text-[12px] leading-tight flex items-center gap-2">{o.name} <span className="text-[8px] bg-gray-100 text-gray-500 px-1 border border-gray-200 rounded uppercase">{o.brand}</span></div>
                                                    <div className="text-[10px] text-[#737597] font-mono mt-0.5 font-bold uppercase tracking-wide">{o.sku}</div>
                                                </td>
                                                <td className="py-2 px-6 align-middle text-center">
                                                    <div className="font-mono font-black text-[#2E395F] text-[13px]">{o.reqKg.toLocaleString()}</div>
                                                    <div className="text-[9px] text-[#737597] font-bold uppercase tracking-widest">{o.reqQty.toLocaleString()} Pk</div>
                                                </td>
                                                <td className="py-2 px-6 align-middle text-center">
                                                    <div className={`font-mono font-black text-[13px] ${o.diffKg < 0 ? 'text-[#C22D2E]' : 'text-[#537E72]'}`}>
                                                        {o.diffKg > 0 ? '+' : ''}{o.diffKg.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-6 align-middle text-center">
                                                    <span className="font-bold text-[#737597] text-[11px] uppercase tracking-wider">{o.deadline}</span>
                                                </td>
                                                <td className="py-2 px-6 pr-8 align-middle text-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-dashed whitespace-nowrap ${getStatusStyle(o.status)}`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                    No demand found for selected criteria
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
                                            {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">TOTAL {filteredOrders.length} ITEMS</div>
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
