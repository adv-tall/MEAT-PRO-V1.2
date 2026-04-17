import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DraggableModal } from '../../components/shared/DraggableModal';

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

  .sticky-col {
    position: sticky;
    left: 0;
    z-index: 20;
    background-color: white;
  }
`;

// --- DATA & CONSTANTS ---
const SYSTEM_MODULES = [
    { id: 'home', label: 'HOME', icon: 'home' },
    { id: 'planning', label: 'PLANNING', icon: 'calendar-clock', 
      subItems: [ { id: 'plan_fr_planning', label: 'PLAN FR PLANNING' }, { id: 'plan_by_prod', label: 'PLAN BY PRODUCTION' } ] },
    { id: 'daily_board', label: 'DAILY BOARD', icon: 'clipboard-list',
        subItems: [ { id: 'prod_tracking', label: 'PRODUCTION TRACKING' }, { id: 'mixing_plan', label: 'MIXING PLAN' }, { id: 'packing_plan', label: 'PACKING PLAN' } ] },
    { id: 'daily_problem', label: 'DAILY PROBLEM', icon: 'alert-triangle',
        subItems: [ { id: 'unplanned_jobs', label: 'UNPLANNED JOBS' }, { id: 'machine_breakdown', label: 'MACHINE BREAKDOWN' } ] },
    { id: 'process', label: 'PROCESS', icon: 'factory',
        subItems: [ { id: 'premix', label: 'PREMIX' }, { id: 'mixing', label: 'MIXING' }, { id: 'forming', label: 'FORMING' }, { id: 'cooking', label: 'COOKING' }, { id: 'cooling', label: 'COOLING' }, { id: 'cut_peel', label: 'CUT & PEEL' }, { id: 'packing', label: 'PACKING' } ] },
    { id: 'prod_config', label: 'PROD CONFIG', icon: 'settings-2',
        subItems: [ { id: 'meat_formula', label: 'MEAT FORMULAR' }, { id: 'config', label: 'CONFIG' } ] },
    { id: 'setting', label: 'SETTING', icon: 'user-cog',
        subItems: [ { id: 'user_setting', label: 'USER SETTING' } ] }
];

const PERMISSION_LEVELS = [
  { level: 0, label: 'No Access', icon: 'ban', color: '#737597', bg: '#F2F4F6' },
  { level: 1, label: 'Viewer', icon: 'eye', color: '#2E395F', bg: '#E6E1DB' },
  { level: 2, label: 'Editor', icon: 'edit', color: '#DCBC1B', bg: '#FFFCF0' },
  { level: 3, label: 'Verifier', icon: 'check-square', color: '#55738D', bg: '#F8FAFC' },
  { level: 4, label: 'Approver', icon: 'award', color: '#537E72', bg: '#EAF3EF' },
];

// --- HELPER COMPONENTS ---
// --- MAIN APPLICATION ---

export default function UserPermission() {
  const [activeTab, setActiveTab] = useState('registry'); 
  const [viewMode, setViewMode] = useState('list'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<any>({});
  const [confidentialityMap, setConfidentialityMap] = useState<any>({});

  const [users] = useState([
    { id: 1, name: 'SOMCHAI JAIDEE', position: 'PLANT MANAGER', email: 'somchai@tallintel.com', avatar: 'https://i.pravatar.cc/150?img=11', isDev: false, permissions: { home: [1, 2, 3, 4], daily_board: [1, 2, 4] } },
    { id: 2, name: 'SUDA RAKDEE', position: 'QA MANAGER / QMR', email: 'suda@tallintel.com', avatar: 'https://i.pravatar.cc/150?img=5', isDev: false, permissions: { home: [1], prod_config: [1, 2, 3, 4] } },
    { id: 3, name: 'DCC TEAM ADMIN', position: 'SYSTEM ADMIN', email: 'dcc@tallintel.com', avatar: 'https://i.pravatar.cc/150?img=12', isDev: true, permissions: { '*': [1, 2, 3, 4] } },
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.position.toLowerCase().includes(search.toLowerCase()));
  }, [users, search]);

  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedModules((prev: any) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      <div className="flex flex-col min-h-screen w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
        
        <GuideTrigger onClick={() => setIsGuideOpen(true)} />
        <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="PERMISSION GUIDE" iconName="shield-check">
            <section>
                <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                    <Icons.ShieldCheck size={16} className="text-[#C22D2E]"/> 1. Matrix Control
                </h4>
                <p>หน้าจอ Summary Matrix ใช้ตรวจสอบการกระจายสิทธิ์ (Matrix Audit) เพื่อให้มั่นใจว่าพนักงานแต่ละท่านมีสิทธิ์การทำงานที่ถูกต้องตามระบบงาน</p>
            </section>
            <section>
                <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                    <Icons.LayoutGrid size={16} className="text-[#C22D2E]"/> 2. Expandable Rows
                </h4>
                <p>สามารถคลี่ดูรายละเอียดรายเมนูย่อยได้โดยคลิกที่ปุ่มลูกศรหน้าชื่อเมนูหลัก</p>
            </section>
        </UserGuidePanel>

        {/* Header Bar Synced with Theme */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
              <Icons.Shield size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                <span className="text-[#2E395F]">USER</span>
                <span className="text-[#C22D2E]">PERMISSIONS</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Security Control & Access Authorization</p>
            </div>
          </div>
          
          <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
            <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'registry' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
              <Icons.Database size={14} /> Module Registry
            </button>
            <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'staff' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
              <Icons.Users size={14} /> Staff Access
            </button>
          </div>
        </header>

        <main className="flex-1 w-full px-8 pb-10 flex flex-col gap-6 min-h-0 animate-fadeIn">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
            <KPICard title="Active Users" val={users.length} icon="users" color="#2E395F" desc="Total Staffs" />
            <KPICard title="System Modules" val={SYSTEM_MODULES.length} icon="layout-grid" color="#C22D2E" desc="Tracked Nodes" />
            <KPICard title="Restricted Zones" val={Object.values(confidentialityMap).filter(v=>v).length} icon="lock" color="#DCBC1B" desc="Locked Config" />
            <KPICard title="Security Status" val="VERIFIED" icon="shield-check" color="#537E72" desc="Audited" />
          </div>

          {activeTab === 'registry' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-4 space-y-6 flex flex-col">
                 <div className="bg-white/80 backdrop-blur-md p-6 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col gap-5 shrink-0">
                    <h3 className="text-sm font-black text-[#2E395F] uppercase tracking-widest flex items-center gap-2"><Icons.Lock size={16} className="text-[#C22D2E]" /> CONFIDENTIALITY REGISTRY</h3>
                    <div className="p-4 bg-[#537E72]/10 border border-[#537E72]/20 rounded-xl">
                       <div className="flex items-center gap-2 text-[#537E72] font-black text-[10px] uppercase tracking-widest mb-1.5"><Icons.Eye size={14}/> Public Access</div>
                       <p className="text-[12px] text-[#55738D] font-bold">เมนูทั่วไป: พนักงานทุกคนจะได้รับสิทธิ์ "Viewer" ทันทีที่เข้าสู่ระบบ</p>
                    </div>
                    <div className="p-4 bg-[#C22D2E]/10 border border-[#C22D2E]/20 rounded-xl">
                       <div className="flex items-center gap-2 text-[#C22D2E] font-black text-[10px] uppercase tracking-widest mb-1.5"><Icons.Lock size={14}/> Confidential Area</div>
                       <p className="text-[12px] text-[#55738D] font-bold">พื้นที่จำกัด: จะถูกปิดกั้นสิทธิ์ "Viewer" พื้นฐาน ต้องระบุสิทธิ์เป็นรายบุคคลเท่านั้น</p>
                    </div>
                 </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-8 bg-white/80 backdrop-blur-md rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col flex-1 min-h-0">
                <div className="px-6 py-4 border-b border-[#E6E1DB] bg-[#F2F4F6]/50 shrink-0">
                    <h4 className="text-[12px] font-black uppercase text-[#2E395F] tracking-widest flex items-center gap-2"><Icons.List size={16} className="text-[#C22D2E]"/> MASTER MODULE REGISTRY</h4>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                   {SYSTEM_MODULES.map(mod => (
                     <div key={mod.id} className="space-y-2">
                        <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${confidentialityMap[mod.id] ? 'bg-[#C22D2E]/5 border-[#C22D2E]/30' : 'bg-white border-[#E6E1DB] shadow-sm'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${confidentialityMap[mod.id] ? 'bg-[#C22D2E]/10 text-[#C22D2E]' : 'bg-[#F2F4F6] text-[#55738D]'}`}><LucideIcon name={mod.icon} size={18}/></div>
                              <div>
                                 <div className="font-black text-[#2E395F] text-[12px] uppercase tracking-tight flex items-center gap-2 leading-none">
                                    {mod.label} 
                                    {confidentialityMap[mod.id] && <Icons.Lock size={12} className="text-[#C22D2E]"/>}
                                    {mod.subItems && (
                                       <button onClick={() => toggleExpand(mod.id)} className="p-1 hover:bg-[#F2F4F6] rounded-md transition-transform text-[#55738D]">
                                          <Icons.ChevronDown size={14} className={expandedModules[mod.id] ? 'rotate-180' : ''} />
                                       </button>
                                    )}
                                 </div>
                                 <div className="text-[10px] text-[#737597] font-bold uppercase tracking-widest mt-1">{confidentialityMap[mod.id] ? 'Restricted Access' : 'Public Access'}</div>
                              </div>
                           </div>
                           <button onClick={()=>toggleConfidentiality(mod.id)} className={`p-2.5 rounded-lg transition-all shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#C22D2E] text-white border-transparent' : 'bg-white text-[#737597] border border-[#E6E1DB] hover:text-[#55738D]'}`}>
                              {confidentialityMap[mod.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                           </button>
                        </div>

                        {/* RENDER SUB-ITEMS IF EXPANDED (List View) */}
                        {expandedModules[mod.id] && mod.subItems && (
                           <div className="pl-14 pr-4 pb-2 space-y-2 mt-1 animate-fadeIn">
                              {mod.subItems.map(sub => (
                                 <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-white/60 border-[#E6E1DB] shadow-sm">
                                     <div className="flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 rounded-full bg-[#55738D]"></div>
                                         <span className="text-[11px] font-bold text-[#55738D] uppercase tracking-wider">{sub.label}</span>
                                     </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                   ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col flex-1 min-h-0 animate-fadeIn">
              
              {/* TOOLBAR */}
              <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                <div className="flex bg-white border border-[#E6E1DB] p-1 rounded-lg shadow-sm">
                  <button onClick={()=>setViewMode('list')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode==='list'?'bg-[#2E395F] text-white shadow-sm':'text-[#737597] hover:bg-[#F2F4F6]'}`}>List View</button>
                  <button onClick={()=>setViewMode('matrix')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode==='matrix'?'bg-[#2E395F] text-white shadow-sm':'text-[#737597] hover:bg-[#F2F4F6]'}`}>Summary Matrix</button>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 shrink-0">
                       <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]" />
                       <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search personnel..." className="w-full pl-10 pr-4 py-2 text-[12px] border border-[#B2CADE]/50 rounded-xl font-bold outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" />
                    </div>
                    <button onClick={() => setIsCsvModalOpen(true)} className="bg-[#2E395F] hover:bg-[#1A2341] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                        <Icons.UploadCloud size={14} /> Import CSV
                    </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-transparent">
                 {viewMode === 'list' ? (
                   <table className="w-full text-left font-sans min-w-[1000px] border-collapse">
                      <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                        <tr>
                          <th className="py-4 px-6 pl-8 whitespace-nowrap w-[25%]">Personnel Identity</th>
                          <th className="py-4 px-6 whitespace-nowrap w-[25%]">Position / Dept</th>
                          <th className="py-4 px-6 whitespace-nowrap w-[25%]">Email ID</th>
                          <th className="py-4 px-6 text-center whitespace-nowrap w-[15%]">Type</th>
                          <th className="py-4 px-6 text-center whitespace-nowrap w-[10%] pr-8">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {currentData.map(user => (
                          <tr key={user.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group">
                            <td className="py-2 px-6 pl-8 align-middle">
                               <div className="flex items-center gap-3 py-1">
                                 <img src={user.avatar} className="w-9 h-9 rounded-full border border-[#E6E1DB] object-cover shadow-sm" />
                                 <span className="font-black text-[#2E395F] text-[12px] uppercase">{user.name}</span>
                               </div>
                            </td>
                            <td className="py-2 px-6 align-middle font-bold text-[#55738D] text-[12px] uppercase">{user.position}</td>
                            <td className="py-2 px-6 align-middle font-mono font-bold text-[#737597] text-[12px]">{user.email}</td>
                            <td className="py-2 px-6 align-middle text-center">
                               <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${user.isDev ? 'bg-[#DCBC1B]/10 text-[#B06821] border-[#DCBC1B]/30' : 'bg-[#F2F4F6] text-[#737597] border-[#E6E1DB]'}`}>
                                 {user.isDev ? 'DEVELOPER' : 'GENERAL'}
                               </span>
                            </td>
                            <td className="py-2 px-6 pr-8 align-middle text-center">
                               <button onClick={()=>{setSelectedUser(user); setModalStep(1); setIsEditModalOpen(true);}} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#DCBC1B] hover:text-white hover:bg-[#DCBC1B] transition-colors shadow-sm bg-white mx-auto"><Icons.UserCog size={14}/></button>
                            </td>
                          </tr>
                        ))}
                        {currentData.length === 0 && (
                          <tr><td colSpan={5} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">No users found</td></tr>
                        )}
                      </tbody>
                   </table>
                 ) : (
                   /* 🌟 SUMMARY MATRIX VIEW 🌟 */
                   <table className="w-full text-left font-sans min-w-[1200px] border-collapse">
                      <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-40 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                         <tr>
                            <th className="py-4 px-6 sticky left-0 z-50 border-r border-[#2E395F]/30 min-w-[280px] bg-[#C22D2E] whitespace-nowrap">Module / Sub-Module</th>
                            {users.map(u => (
                               <th key={u.id} className="py-2 px-4 text-center border-l border-white/20 whitespace-nowrap">
                                  <div className="flex flex-col items-center gap-1.5 justify-center">
                                     <img src={u.avatar} className="w-8 h-8 rounded-lg border-2 border-white/20 object-cover shadow-sm" />
                                     <span className="font-black leading-none text-[10px] text-white tracking-widest">{u.name.split(' ')[0]}</span>
                                  </div>
                               </th>
                            ))}
                         </tr>
                      </thead>
                      <tbody className="bg-white text-[12px]">
                         {SYSTEM_MODULES.map(mod => {
                            const isExpanded = expandedModules[`matrix_${mod.id}`];
                            return (
                               <React.Fragment key={mod.id}>
                                  <tr className="hover:bg-[#F2F4F6] transition-colors border-b border-[#E6E1DB]">
                                     <td className="py-2 px-6 font-black text-[#2E395F] uppercase tracking-tight flex items-center gap-2 sticky left-0 z-20 border-r border-[#E6E1DB] bg-[#F2F4F6]/80 backdrop-blur-sm shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                        {mod.subItems && (
                                           <button onClick={() => toggleExpand(`matrix_${mod.id}`)} className="p-1 hover:bg-[#E6E1DB] rounded-md transition-all text-[#55738D]">
                                              <Icons.ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                           </button>
                                        )}
                                        <LucideIcon name={mod.icon} size={16} className="text-[#C22D2E]"/> {mod.label}
                                        {confidentialityMap[mod.id] && <Icons.Lock size={12} className="text-[#55738D]"/>}
                                     </td>
                                     {users.map(u => {
                                        const uPerms = (u.permissions as any)?.[mod.id] || [];
                                        const hasAccess = u.isDev || uPerms.length > 0 || (u.permissions as any)?.['*'];
                                        return (
                                           <td key={u.id} className="py-2 px-4 text-center border-l border-[#E6E1DB] align-middle">
                                              <div className="flex justify-center gap-1">
                                                 {u.isDev || (u.permissions as any)?.['*'] ? (
                                                    [1,2,3,4].map(lvl => <div key={lvl} className="w-5 h-5 rounded flex items-center justify-center shadow-sm" style={{backgroundColor: PERMISSION_LEVELS[lvl].bg}}><Icons.Check size={10} style={{color: PERMISSION_LEVELS[lvl].color}}/></div>)
                                                 ) : hasAccess ? (
                                                    uPerms.map((lvl: number) => {
                                                       const p = PERMISSION_LEVELS.find(pl => pl.level === lvl);
                                                       if (!p) return null;
                                                       return <div key={lvl} className="w-5 h-5 rounded flex items-center justify-center shadow-sm" style={{backgroundColor: p.bg}} title={p.label}><LucideIcon name={p.icon} size={10} style={{color: p.color}}/></div>;
                                                    })
                                                 ) : <span className="text-[#B2CADE] font-mono">-</span>}
                                              </div>
                                           </td>
                                        )
                                     })}
                                  </tr>
                                  {mod.subItems && isExpanded && (
                                     mod.subItems.map(sub => (
                                        <tr key={sub.id} className="hover:bg-[#F2F4F6]/50 transition-all border-b border-[#E6E1DB]">
                                           <td className="py-2 px-6 pl-14 font-bold text-[#55738D] uppercase text-[11px] sticky left-0 z-20 border-r border-[#E6E1DB] bg-white shadow-[2px_0_5px_rgba(0,0,0,0.02)] align-middle">
                                              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#B2CADE]"></div> {sub.label}</div>
                                           </td>
                                           {users.map(u => {
                                              const subPerms = (u.permissions as any)?.[sub.id] || (u.permissions as any)?.[mod.id] || [];
                                              const hasAccess = u.isDev || subPerms.length > 0 || (u.permissions as any)?.['*'];
                                              return (
                                                 <td key={u.id} className="py-2 px-4 text-center border-l border-[#E6E1DB] align-middle">
                                                    {hasAccess ? <div className="w-4 h-4 rounded bg-[#537E72]/10 flex items-center justify-center mx-auto shadow-sm border border-[#537E72]/20"><Icons.Check size={10} className="text-[#537E72]"/></div> : <span className="text-[#E6E1DB] font-mono">-</span>}
                                                 </td>
                                              )
                                           })}
                                        </tr>
                                     ))
                                  )}
                               </React.Fragment>
                            );
                         })}
                      </tbody>
                   </table>
                 )}
              </div>
              
              {/* Pagination */}
              {viewMode === 'list' && (
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
                        <div>TOTAL {filteredUsers.length} ITEMS</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><Icons.ChevronLeft size={16}/></button>
                        <div className="bg-white border border-[#B2CADE]/30 px-5 py-1.5 rounded-lg shadow-sm text-[#2E395F] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><Icons.ChevronRight size={16}/></button>
                    </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* --- Edit Modal (Synced with STDProcess Modal Layout) --- */}
        <DraggableModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Permissions: ${selectedUser?.name}`} width="max-w-4xl" className="font-sans flex flex-col p-0">
               {/* Modal Layout */}
               <div className="flex-1 flex overflow-hidden bg-[#F2F4F6]">
                  {/* Sidebar Tabs */}
                  <div className="w-64 bg-white border-r border-[#E6E1DB] flex flex-col shrink-0 overflow-y-auto">
                      <div className="px-5 py-4 text-[10px] font-black text-[#55738D] uppercase tracking-widest border-b border-[#E6E1DB] bg-[#F2F4F6]">Configuration Steps</div>
                      <button onClick={()=>setModalStep(1)} className={`flex items-center gap-3 px-5 py-4 text-left transition-all border-l-4 w-full group ${modalStep===1?'border-[#C22D2E] bg-white text-[#C22D2E] shadow-sm':'border-transparent text-[#737597] hover:bg-[#E6E1DB]/30 hover:text-[#2E395F]'}`}>
                          <div className={`p-2 rounded-xl shrink-0 transition-colors ${modalStep===1?'bg-[#C22D2E]/10':'bg-white border border-[#E6E1DB] group-hover:border-[#B2CADE]'}`}><Icons.ShieldCheck size={16} /></div>
                          <span className={`text-[11px] uppercase tracking-widest ${modalStep===1?'font-black':'font-bold'}`}>1. Area Visibility</span>
                      </button>
                      <button onClick={()=>setModalStep(2)} className={`flex items-center gap-3 px-5 py-4 text-left transition-all border-l-4 w-full group ${modalStep===2?'border-[#C22D2E] bg-white text-[#C22D2E] shadow-sm':'border-transparent text-[#737597] hover:bg-[#E6E1DB]/30 hover:text-[#2E395F]'}`}>
                          <div className={`p-2 rounded-xl shrink-0 transition-colors ${modalStep===2?'bg-[#C22D2E]/10':'bg-white border border-[#E6E1DB] group-hover:border-[#B2CADE]'}`}><Icons.Settings2 size={16} /></div>
                          <span className={`text-[11px] uppercase tracking-widest ${modalStep===2?'font-black':'font-bold'}`}>2. Functional Rights</span>
                      </button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm flex flex-col h-full animate-fadeIn">
                         <h4 className="text-[12px] font-black text-[#2E395F] uppercase tracking-widest mb-6 border-b border-[#E6E1DB] pb-3">
                             {modalStep===1 ? 'Step 1: Module Access Rules' : 'Step 2: Specific Permissions'}
                         </h4>
                         <div className="grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pr-2">
                            {SYSTEM_MODULES.map(mod => (
                              <div key={mod.id} className="p-4 bg-[#F2F4F6]/50 rounded-2xl border border-[#E6E1DB] flex items-center justify-between hover:bg-white hover:shadow-sm transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#E6E1DB] text-[#2E395F] shadow-sm"><LucideIcon name={mod.icon} size={18}/></div>
                                    <span className="font-bold text-[#2E395F] uppercase text-[12px] tracking-widest">{mod.label}</span>
                                 </div>
                                 <div className="flex gap-1.5 bg-white p-1.5 rounded-xl shadow-sm border border-[#E6E1DB]">
                                    {PERMISSION_LEVELS.filter(p => modalStep === 1 ? p.level <= 1 : p.level === 0 || p.level >= 2).map(p => (
                                      <button key={p.level} className="w-8 h-8 rounded-lg border border-transparent flex items-center justify-center hover:bg-[#F2F4F6] hover:border-[#E6E1DB] transition-all" title={p.label}>
                                        <LucideIcon name={p.icon} size={14} style={{color: p.color}}/>
                                      </button>
                                    ))}
                                 </div>
                              </div>
                            ))}
                         </div>
                    </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0 rounded-b-xl mt-auto">
                  <button onClick={()=>setIsEditModalOpen(false)} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                  <button onClick={()=>setIsEditModalOpen(false)} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><Icons.Save size={14}/> Save Changes</button>
               </div>
        </DraggableModal>
      </div>
    </>
  );
}
