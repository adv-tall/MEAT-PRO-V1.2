import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { CsvUpload } from '../../components/shared/CsvUpload';

// --- Global Styles (Synced with Theme) ---
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
`;

// --- Mocking External Dependencies ---
const Swal = typeof window !== 'undefined' ? ((window as any).Swal || null) : null;

// --- THEME COLORS FOR CHARTS ---
const THEME = {
    primary: '#C22D2E',   // Deep Red
    secondary: '#BB8588', // Old Rose
    warning: '#DCBC1B',   // Vivid Gold
    success: '#537E72',   // Deep Sea Green
    info: '#55738D',      // Slate Blue
    navy: '#2E395F',      // Navy
    muted: '#737597'      // Muted Gray
};

// --- MOCK DATA ---
const MOCK_EQUIPMENT = [
    { id: 'EQ-MIX-01', name: 'Vacuum Mixer 500L', type: 'Mixing', step: '1' },
    { id: 'EQ-MIX-02', name: 'Bowl Cutter 200L', type: 'Mixing', step: '1' },
    { id: 'EQ-FRM-01', name: 'Twist Linker A', type: 'Forming', step: '2' },
    { id: 'EQ-FRM-02', name: 'Clipper Direct B', type: 'Forming', step: '2' },
    { id: 'EQ-OVK-01', name: 'Smoke House 6T', type: 'Cooking', step: '3' },
    { id: 'EQ-OVK-02', name: 'Steam Oven 4T', type: 'Cooking', step: '3' },
    { id: 'EQ-PAC-01', name: 'Thermoformer X1', type: 'Packing', step: '7' },
];

const generateMockBreakdowns = () => {
    return [
        { id: 'BD-260401', date: '04/04/2026', machineId: 'EQ-MIX-01', machineName: 'Vacuum Mixer 500L', problem: 'Motor Overheating (Temp > 85c)', actionTaken: '', downtimeMinutes: 45, status: 'Open', reportedBy: 'Operator A' },
        { id: 'BD-260402', date: '03/04/2026', machineId: 'EQ-FRM-01', machineName: 'Twist Linker A', problem: 'Casing Jammed / Tearing', actionTaken: 'Replaced linking nozzle and recalibrated speed', downtimeMinutes: 20, status: 'Resolved', reportedBy: 'Tech Lead' },
        { id: 'BD-260403', date: '01/04/2026', machineId: 'EQ-OVK-01', machineName: 'Smoke House 6T', problem: 'Steam Valve Leak', actionTaken: 'Tightened valve and replaced gasket seal', downtimeMinutes: 120, status: 'Resolved', reportedBy: 'Maintenance' },
        { id: 'BD-260329', date: '29/03/2026', machineId: 'EQ-PAC-01', machineName: 'Thermoformer X1', problem: 'Vacuum Pump Failure', actionTaken: 'Swapped backup pump unit', downtimeMinutes: 90, status: 'Resolved', reportedBy: 'Maintenance' },
        { id: 'BD-260328', date: '28/03/2026', machineId: 'EQ-MIX-02', machineName: 'Bowl Cutter 200L', problem: 'Blade sensor error', actionTaken: '', downtimeMinutes: 15, status: 'Open', reportedBy: 'Operator B' },
    ];
};

// --- MAIN APPLICATION ---
export default function MachineBreakdown() {
    const [activeTab, setActiveTab] = useState('breakdown_list');
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formMachineId, setFormMachineId] = useState('');
    const [formProblem, setFormProblem] = useState('');
    const [formAction, setFormAction] = useState('');
    const [formDowntime, setFormDowntime] = useState(0);
    const [formStatus, setFormStatus] = useState('Open');

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            setTimeout(() => {
                setEquipment(MOCK_EQUIPMENT);
                setBreakdowns(generateMockBreakdowns());
                setLoading(false);
            }, 600);
        };
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        return breakdowns.filter(item => {
            const matchSearch = item.machineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchSearch;
        });
    }, [searchTerm, breakdowns]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleOpenModal = (item: any = null) => {
        if (item && item.id) {
            setEditingItem(item);
            setFormMachineId(item.machineId);
            setFormProblem(item.problem);
            setFormAction(item.actionTaken);
            setFormDowntime(item.downtimeMinutes);
            setFormStatus(item.status);
        } else {
            setEditingItem(null);
            setFormMachineId('');
            setFormProblem('');
            setFormAction('');
            setFormDowntime(0);
            setFormStatus('Open');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formMachineId || !formProblem) {
            if (Swal) Swal.fire('Warning', 'Please select a Machine and describe the Problem', 'warning');
            else alert('Please select a Machine and describe the Problem');
            return;
        }

        const selectedMachine = equipment.find(e => e.id === formMachineId);
        const machineName = selectedMachine ? selectedMachine.name : formMachineId;

        const newItem = {
            id: editingItem ? editingItem.id : `BD-${Date.now().toString().slice(-6)}`,
            date: editingItem ? editingItem.date : new Date().toLocaleDateString('en-GB'),
            machineId: formMachineId,
            machineName,
            problem: formProblem,
            actionTaken: formAction,
            downtimeMinutes: formDowntime,
            status: formStatus,
            reportedBy: editingItem ? editingItem.reportedBy : 'Current User'
        };

        let updatedBreakdowns;
        if (editingItem) {
            updatedBreakdowns = breakdowns.map(b => b.id === newItem.id ? newItem : b);
        } else {
            updatedBreakdowns = [newItem, ...breakdowns];
        }

        setBreakdowns(updatedBreakdowns);
        setIsModalOpen(false);
        if(Swal) Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const handleDelete = (id: string) => {
        if(Swal) {
            Swal.fire({ title: 'Are you sure?', text: `Delete record ${id}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' }).then((result: any) => { 
                if (result.isConfirmed) { 
                    setBreakdowns(breakdowns.filter(item => item.id !== id)); 
                    Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record deleted.', timer: 1500, showConfirmButton: false}); 
                } 
            });
        } else {
            if(window.confirm('Are you sure you want to delete this record?')) {
                setBreakdowns(breakdowns.filter(item => item.id !== id));
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading Equipment Data...</span>
            </div>
        </div>
    );

    const totalDowntime = breakdowns.reduce((sum, b) => sum + b.downtimeMinutes, 0);
    const openIssues = breakdowns.filter(b => b.status === 'Open').length;
    const resolvedIssues = breakdowns.filter(b => b.status === 'Resolved').length;

    // Calculate Mock OEE
    const totalAvailableTime = equipment.length * 8 * 60; // Assuming 8 hours per machine
    const availability = totalAvailableTime > 0 ? ((totalAvailableTime - totalDowntime) / totalAvailableTime) * 100 : 100;

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: globalStyles}} />
            <div className="flex flex-col h-full w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="REGISTRY GUIDE" iconName="wrench">
                        <section>
                            <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                                <Icons.Wrench size={16} className="text-[#55738D]"/> Overview
                            </h4>
                            <ul className="list-disc list-outside ml-4 space-y-2">
                                <li><strong>Breakdown Log:</strong> ใช้สำหรับบันทึกประวัติการเสียหรือซ่อมบำรุงเครื่องจักร</li>
                                <li><strong>OEE Dashboard:</strong> ระบบวิเคราะห์ประสิทธิภาพเครื่องจักรโดยรวม (Availability, Performance, Quality)</li>
                                <li><strong>Top Issues:</strong> ดูสถิติเครื่องจักรที่มีปัญหาบ่อยที่สุด เพื่อวางแผน PM ล่วงหน้า</li>
                            </ul>
                        </section>
                </UserGuidePanel>

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-0">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.Wrench size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">MACHINE</span>
                                <span className="text-[#C22D2E]">BREAKDOWN</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Maintenance & Breakdown Tracking</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                        <button onClick={() => setActiveTab('breakdown_list')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'breakdown_list' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.List size={14} /> Breakdown List
                        </button>
                        <button onClick={() => setActiveTab('oee')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'oee' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.Activity size={14} /> OEE Metrics
                        </button>
                        <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.PieChart size={14} /> Dashboard
                        </button>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col gap-6 relative z-10 custom-scrollbar animate-fadeIn min-h-0 mt-4">
                    
                    {/* KPI Row (Only show in breakdown list to save space) */}
                    {activeTab === 'breakdown_list' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                            <KPICard title="Total Downtime" val={totalDowntime} unit="Min" color={THEME.primary} icon="clock" desc="Across all machines" trend="down" />
                            <KPICard title="Open Issues" val={openIssues} color={THEME.warning} icon="alert-triangle" desc="Require attention" trend="up" />
                            <KPICard title="Resolved" val={resolvedIssues} color={THEME.success} icon="check-circle" desc="Fixed issues" />
                            <KPICard title="Avg Availability" val={availability.toFixed(1)} unit="%" color={THEME.info} icon="activity" desc="Estimated OEE Availability" trend="up" />
                        </div>
                    )}

                    {/* MAIN CONTENT AREA */}
                    {activeTab === 'breakdown_list' && (
                        <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                            {/* TOOLBAR */}
                            <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-[12px] font-black text-[#2E395F] uppercase tracking-widest">
                                        <Icons.List size={16} className="text-[#C22D2E]"/>
                                        <span>Breakdown Records</span>
                                    </div>
                                    <span className="text-[#E6E1DB]">|</span>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-2 py-1 rounded-sm">{filteredData.length} Records</div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
                                    <div className="relative flex-1 md:w-48 shrink-0">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                        <input type="text" placeholder="Search Machine, Issue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" />
                                    </div>
                                    <button onClick={() => setIsCsvModalOpen(true)} className="bg-[#2E395F] hover:bg-[#1A2341] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                                        <Icons.UploadCloud size={14} /> Import CSV
                                    </button>
                                    <button onClick={() => handleOpenModal()} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                                        <Icons.AlertTriangle size={14} /> Report Issue
                                    </button>
                                </div>
                            </div>

                            {/* TABLE (Lean & Clean Padding) */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left min-w-[900px] border-collapse">
                                        <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                                            <tr>
                                                <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Date</th>
                                                <th className="py-4 px-6 w-[20%] whitespace-nowrap">Machine</th>
                                                <th className="py-4 px-6 w-[25%] whitespace-nowrap">Problem</th>
                                                <th className="py-4 px-6 w-[20%] whitespace-nowrap">Action Taken</th>
                                                <th className="py-4 px-6 w-[10%] text-right whitespace-nowrap">Downtime</th>
                                                <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                                <th className="py-4 px-6 pr-8 text-right w-20 whitespace-nowrap">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {paginatedData.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group">
                                                    
                                                    {/* Col 1: Date & ID */}
                                                    <td className="py-2 px-6 pl-8 align-middle">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className="font-bold text-[#2E395F] text-[12px] font-mono">{item.date}</span>
                                                            <span className="text-[#737597] text-[10px] font-mono font-bold">{item.id}</span>
                                                        </div>
                                                    </td>

                                                    {/* Col 2: Machine */}
                                                    <td className="py-2 px-6 align-middle font-bold text-[#2E395F] text-[12px]">
                                                        {item.machineName}
                                                    </td>

                                                    {/* Col 3: Problem */}
                                                    <td className="py-2 px-6 align-middle">
                                                        <div className="text-[12px] text-[#C22D2E] font-bold truncate max-w-[200px]" title={item.problem}>
                                                            {item.problem}
                                                        </div>
                                                    </td>

                                                    {/* Col 4: Action */}
                                                    <td className="py-2 px-6 align-middle">
                                                        <div className="text-[11px] text-[#55738D] font-normal truncate max-w-[200px]" title={item.actionTaken || 'Pending action'}>
                                                            {item.actionTaken || <span className="italic text-[#B2CADE]">-</span>}
                                                        </div>
                                                    </td>

                                                    {/* Col 5: Downtime */}
                                                    <td className="py-2 px-6 align-middle text-right">
                                                        <div className="flex items-baseline justify-end gap-1 whitespace-nowrap">
                                                            <span className="font-mono font-black text-[#C22D2E] text-[12px]">
                                                                {item.downtimeMinutes}
                                                            </span>
                                                            <span className="text-[10px] text-[#737597] font-bold uppercase tracking-widest">
                                                                Min
                                                            </span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Col 6: Status */}
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-normal uppercase tracking-widest shadow-sm border whitespace-nowrap ${item.status === 'Resolved' ? 'bg-white text-[#537E72] border-[#537E72]/40' : 'bg-white text-[#B06821] border-[#DCBC1B]/40'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    {/* Col 7: Action */}
                                                    <td className="py-2 px-6 pr-8 align-middle">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white">
                                                                <Icons.Pencil size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white">
                                                                <Icons.Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))}
                                            {paginatedData.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
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
                    )}

                    {activeTab === 'oee' && (
                        <div className="flex flex-col gap-6 animate-fadeIn h-full">
                            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-8 text-sm"><LucideIcon name="activity" size={18} className="text-[#C22D2E]" /> Overall Equipment Effectiveness (OEE)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Overall OEE */}
                                    <div className="flex flex-col items-center justify-center p-8 bg-[#F2F4F6]/50 rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Overall OEE</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.primary} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 78) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">78<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-[#E6E1DB]">Target: 85%</p>
                                    </div>

                                    {/* Availability */}
                                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Availability</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.info} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * availability) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">{availability.toFixed(1)}<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest">Operating / Planned</p>
                                    </div>

                                    {/* Quality */}
                                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Quality</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.success} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 98.5) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">98.5<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest">Good / Total Count</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex-1">
                                <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="trending-up" size={18} className="text-[#C22D2E]" /> OEE Trend (Last 7 Days)</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={[
                                            { name: 'Mon', oee: 75, target: 85 }, { name: 'Tue', oee: 78, target: 85 },
                                            { name: 'Wed', oee: 82, target: 85 }, { name: 'Thu', oee: 76, target: 85 },
                                            { name: 'Fri', oee: 79, target: 85 }, { name: 'Sat', oee: 84, target: 85 },
                                            { name: 'Sun', oee: 78, target: 85 }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E1DB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} domain={[60, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px', fontWeight: 'bold', color: '#2E395F' }} />
                                            <Line type="monotone" dataKey="oee" name="Actual OEE %" stroke={THEME.primary} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6, fill: THEME.primary, stroke: 'white' }} />
                                            <Line type="monotone" dataKey="target" name="Target (85%)" stroke="#B2CADE" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="flex flex-col gap-6 animate-fadeIn h-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Downtime by Machine */}
                                <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="bar-chart-2" size={18} className="text-[#C22D2E]" /> Downtime by Machine</h3>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={
                                                Object.values(breakdowns.reduce((acc: any, curr) => {
                                                    if (!acc[curr.machineName]) acc[curr.machineName] = { name: curr.machineName, downtime: 0 };
                                                    acc[curr.machineName].downtime += curr.downtimeMinutes;
                                                    return acc;
                                                }, {})).sort((a: any, b: any) => b.downtime - a.downtime).slice(0, 5) as any[]
                                            } layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6E1DB" />
                                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#2E395F', fontWeight: 'bold' }} width={120} />
                                                <Tooltip cursor={{ fill: '#F2F4F6' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                                <Bar dataKey="downtime" name="Downtime (Min)" fill={THEME.primary} radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Problem Types */}
                                <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="pie-chart" size={18} className="text-[#C22D2E]" /> Top Issues</h3>
                                    <div className="h-72 w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        Object.values(breakdowns.reduce((acc: any, curr) => {
                                                            const prob = curr.problem.substring(0, 20) + (curr.problem.length > 20 ? '...' : '');
                                                            if (!acc[prob]) acc[prob] = { name: prob, value: 0 };
                                                            acc[prob].value += 1;
                                                            return acc;
                                                        }, {})).sort((a: any, b: any) => b.value - a.value).slice(0, 4) as any[]
                                                    }
                                                    cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                                                >
                                                    {
                                                        [THEME.primary, THEME.warning, THEME.info, THEME.secondary].map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                                        ))
                                                    }
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#2E395F' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* Modal for Add/Edit (Synced with STDProcess Modal Layout) */}
                <DraggableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Breakdown Record' : 'Report Machine Issue'} className="font-sans flex flex-col p-0" width="max-w-2xl">
                             {/* Content */}
                             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F2F4F6]">
                                 <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm grid grid-cols-2 gap-6">
                                     
                                     <div className="col-span-2">
                                         <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Machine</label>
                                         <select 
                                             value={formMachineId} 
                                             onChange={(e) => setFormMachineId(e.target.value)}
                                             className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer"
                                         >
                                             <option value="">-- Select Machine --</option>
                                             {equipment.map(eq => (
                                                 <option key={eq.id} value={eq.id}>{eq.name} ({eq.type})</option>
                                             ))}
                                         </select>
                                     </div>

                                     <div className="col-span-2">
                                         <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Problem Description</label>
                                         <textarea 
                                             value={formProblem} 
                                             onChange={(e) => setFormProblem(e.target.value)}
                                             className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none min-h-[80px]"
                                             placeholder="Describe the issue..."
                                         />
                                     </div>

                                     <div className="col-span-2">
                                         <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Action Taken</label>
                                         <textarea 
                                             value={formAction} 
                                             onChange={(e) => setFormAction(e.target.value)}
                                             className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none min-h-[80px]"
                                             placeholder="What was done to fix it? (Optional if still open)"
                                         />
                                     </div>

                                     <div>
                                         <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Downtime (Minutes)</label>
                                         <div className="relative">
                                             <input 
                                                 type="number" 
                                                 min="0"
                                                 value={formDowntime} 
                                                 onChange={(e) => setFormDowntime(Number(e.target.value))}
                                                 className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-mono font-black text-[#C22D2E] text-right pr-12 focus:border-[#C22D2E] transition-all outline-none"
                                             />
                                             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#737597]">MIN</span>
                                         </div>
                                     </div>

                                     <div>
                                         <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Status</label>
                                         <select 
                                             value={formStatus} 
                                             onChange={(e) => setFormStatus(e.target.value)}
                                             className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer"
                                         >
                                             <option value="Open">Open</option>
                                             <option value="Resolved">Resolved</option>
                                         </select>
                                     </div>

                                 </div>
                             </div>

                             {/* Modal Footer */}
                             <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0 rounded-b-xl">
                                 <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                                 <button onClick={handleSave} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><Icons.Save size={14}/> Save Record</button>
                             </div>
                </DraggableModal>
                <DraggableModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} title="Import Breakdown Details (CSV)" className="font-sans">
                    <div className="p-6 overflow-y-auto max-h-[70vh]">
                        <CsvUpload
                            onUpload={(data) => {
                                const newRecords = data.map((row: any) => ({
                                    id: row.id || `BD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`,
                                    date: row.date || new Date().toLocaleDateString('en-GB'),
                                    machineId: row.machineId || '',
                                    machineName: row.machineName || 'Unknown Machine',
                                    problem: row.problem || '',
                                    actionTaken: row.actionTaken || '',
                                    downtimeMinutes: Number(row.downtimeMinutes) || 0,
                                    status: row.status || 'Open',
                                    reportedBy: row.reportedBy || 'CSV Import'
                                }));
                                setBreakdowns([...newRecords, ...breakdowns]);
                                setIsCsvModalOpen(false);
                                if(Swal) Swal.fire({ icon: 'success', title: `Imported ${newRecords.length} records!`, showConfirmButton: false, timer: 1500 });
                            }}
                            requiredHeaders={["machineId", "machineName", "problem", "downtimeMinutes", "status"]}
                            templateName="breakdown_import_template.csv"
                            instructions={["Each row represents a single breakdown incident.", "DowntimeMinutes must be a number.", "Status should be 'Open' or 'Resolved'."]}
                        />
                    </div>
                </DraggableModal>
            </div>
        </>
    );
}
