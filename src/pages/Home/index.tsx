import React from 'react';
import { PackageCheck, ShoppingCart, Snowflake, ShieldCheck, Flame, Beef, Package, Waves, ChefHat, Activity, Bell, AlertTriangle, Thermometer, ShoppingBag, BarChart2, Scale, Gauge, Ban, PackageX, SearchX, ShieldAlert, CheckCircle2, Zap, Users } from 'lucide-react';

const MOCK_DATA = {
    stats: [
        { label: 'Daily Output', value: '2.4 Tons', sub: 'Sausage & Meatball', icon: PackageCheck, color: '#C22D2E' },
        { label: 'Pending Orders', value: '฿ 4.2M', sub: 'Hypermarkets & Wholesale', icon: ShoppingCart, color: '#D8A48F' },
        { label: 'Ingredients', value: 'Fresh', sub: 'Meat & Spices Safe', icon: Snowflake, color: '#537E72' },
        { label: 'Hygiene Score', value: '99.8%', sub: 'Halal Certified', icon: ShieldCheck, color: '#55738D' },
    ],
    production: [
        { id: 'LOT-2401', item: 'Chicken Sausage (Smoked)', stage: 'COOKING', progress: 75, status: 'Active', icon: Flame, color: '#D8A48F' }, 
        { id: 'LOT-2402', item: 'Beef Burger Patties (Premium)', stage: 'MIXING', progress: 30, status: 'Production', icon: Beef, color: '#C22D2E' }, 
        { id: 'LOT-2403', item: 'Bologna Chili Grade A', stage: 'PACKING', progress: 95, status: 'QC Check', icon: Package, color: '#537E72' }, 
        { id: 'LOT-2404', item: 'Fish Balls (Classic)', stage: 'FORMING', progress: 50, status: 'Active', icon: Waves, color: '#55738D' }, 
    ],
};

interface KPICardProps {
    title: string;
    val: string;
    color: string;
    icon: any;
    desc?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, val, color, icon: Icon, desc }) => (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-500 border border-white/50 relative overflow-hidden group h-full hover:-translate-y-1">
        <div className="absolute -right-8 -bottom-8 opacity-[0.08] transform rotate-[15deg] group-hover:scale-110 group-hover:opacity-[0.15] group-hover:rotate-[5deg] transition-all duration-700 pointer-events-none z-0">
            <Icon size={140} style={{color: color}} strokeWidth={1.5} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[10px] font-bold text-[#737597] uppercase tracking-widest font-mono opacity-90 truncate" title={title}>{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-black tracking-tight font-mono leading-tight truncate drop-shadow-sm" style={{color: color}}>{val}</h4>
                </div>
                {desc && <p className="text-[10px] text-[#55738D] font-medium font-mono mt-2 flex items-center gap-1.5 truncate"><span className="w-2 h-2 rounded-sm" style={{backgroundColor: color}}></span>{desc}</p>}
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/80 group-hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white/80 to-transparent" style={{backgroundColor: color + '40'}}>
                <Icon size={24} style={{color: color}} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

const GlassCard = ({ children, className = '', hoverEffect = true }) => (
    <div className={`rounded-3xl p-6 backdrop-blur-xl shadow-soft border border-white/40 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`} style={{ backgroundColor: 'rgba(239, 235, 206, 0.85)' }}>{children}</div>
);

export default function Home() {
  const user = { name: 'T-DCC Developer' }; // Mock user for now

  return (
    <div className="space-y-6 animate-fadeIn px-8 pt-8 pb-10">
        <div className="flex justify-between items-center mb-0">
            <div>
                <h1 className="text-3xl font-bold text-[#2E395F] uppercase">SAWASDEE, {user?.name || 'USER'}!</h1>
                <p className="text-[#55738D] text-sm">Real-time monitoring & Control • Status: <span className="text-[#537E72] font-bold">Line A-B Running</span></p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DATA.stats.map((stat, idx) => (
                <KPICard key={idx} title={stat.label} val={stat.value} color={stat.color} icon={stat.icon} desc={stat.sub} />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Processing Floor */}
            <GlassCard className="lg:col-span-2 relative overflow-hidden group bg-gradient-to-br from-white via-[#F8FAFC] to-[#55738D]/10 border-[#55738D]/20">
                  <div className="absolute -bottom-10 -right-10 text-[#55738D] opacity-[0.08] transform -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <ChefHat size={240} />
                </div>
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-[#2E395F] flex items-center gap-2 uppercase">
                        <div className="p-2 bg-[#55738D]/10 rounded-lg text-[#55738D]">
                            <ChefHat size={20} /> 
                        </div>
                        Live Processing Floor
                    </h2>
                    <span className="text-xs text-[#55738D] font-bold bg-white/60 px-3 py-1 rounded-full border border-[#55738D]/20 shadow-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55738D] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#55738D]"></span>
                        </span>
                        Line A, B Active
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    {MOCK_DATA.production.slice(0, 3).map((job, idx) => {
                        const Icon = job.icon;
                        return (
                        <div key={idx} className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white hover:shadow-lg transition-all text-center group/item">
                            <div className="relative inline-block mb-3">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-sm mx-auto p-0.5 bg-white flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300"
                                     style={{ borderColor: `${job.color}40` }}>
                                    <Icon size={32} style={{ color: job.color }} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 text-white p-1 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: job.color }}>
                                     <Activity size={10} />
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-[#2E395F] truncate w-full">{job.item}</h4>
                            <p className="text-[10px] font-bold mt-1 uppercase tracking-tight" style={{ color: job.color }}>{job.stage}</p>
                            <p className="text-[9px] text-[#737597] mt-0.5 font-mono">{job.id}</p>
                            
                            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center px-1">
                                <div className="w-full bg-gray-200/50 rounded-full h-1.5 mr-2 overflow-hidden">
                                    <div className="h-1.5 rounded-full" style={{width: `${job.progress}%`, backgroundColor: job.color}}></div>
                                </div>
                                <span className="text-[9px] font-bold" style={{ color: job.color }}>{job.progress}%</span>
                            </div>
                        </div>
                    )})}
                </div>
            </GlassCard>

            {/* PRODUCTION ALERT */}
            <GlassCard className="bg-gradient-to-b from-white via-[#FFF5F5] to-[#C22D2E]/10 border-[#C22D2E]/20 relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 text-[#C22D2E] opacity-[0.08] transform -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-700">
                    <Bell size={140} />
                </div>

                <h2 className="text-xl font-bold text-[#2E395F] mb-4 flex items-center gap-2 uppercase relative z-10">
                    <div className="p-2 bg-[#C22D2E]/10 rounded-lg text-[#C22D2E] animate-pulse">
                        <AlertTriangle size={20} />
                    </div>
                    PRODUCTION ALERT
                </h2>
                
                <div className="space-y-3 relative z-10">
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#C22D2E]/20 flex gap-3 items-start hover:bg-white hover:shadow-md transition-all">
                        <div className="bg-[#C22D2E]/10 p-2 rounded-lg text-[#C22D2E] shadow-sm mt-0.5"><Thermometer size={16}/></div>
                        <div>
                            <p className="text-xs font-bold text-[#C22D2E]">Cold Room Temp High</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-tight">Room C reached -15°C. Check compressor immediately.</p>
                        </div>
                    </div>
                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#DCBC1B]/30 flex gap-3 items-start hover:bg-white hover:shadow-md transition-all">
                        <div className="bg-[#DCBC1B]/10 p-2 rounded-lg text-[#B06821] shadow-sm mt-0.5"><ShoppingBag size={16}/></div>
                        <div>
                            <p className="text-xs font-bold text-[#B06821]">Spice Stock Low</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-tight">Black pepper reserve below 10kg. Reorder needed.</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-0">
            <KPICard title="PRODUCTION CAP TODAY" val="2.4 / 2.8 Tons" color="#55738D" icon={BarChart2} desc="85.7% Utilization" />
            <KPICard title="% YIELD TODAY" val="98.5%" color="#D8A48F" icon={Scale} desc="Target: >98%" />
            <KPICard title="OEE" val="92.4%" color="#BB8588" icon={Gauge} desc="World Class > 85%" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
            
            {/* NC / DEFECT STATUS */}
            <GlassCard className="flex flex-col group hover:border-[#BB8588]/40 bg-gradient-to-br from-white via-[#FFF8F8] to-[#BB8588]/15 border-[#BB8588]/20 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 text-[#BB8588] opacity-[0.1] transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Ban size={160} />
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#2E395F] flex items-center gap-2 uppercase">
                            <div className="p-2 bg-[#BB8588]/10 rounded-lg text-[#BB8588]">
                                <AlertTriangle size={20} />
                            </div>
                            NC / DEFECT STATUS
                        </h2>
                        <p className="text-[10px] text-[#737597] font-medium mt-1 ml-11">Target &lt; 0.5%</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-3xl font-black text-[#BB8588]">0.45%</h4>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-[10px] relative z-10 mt-2">
                    <div className="bg-white/60 p-3 rounded-xl border border-[#BB8588]/10 backdrop-blur-sm">
                        <p className="font-bold text-[#BB8588] mb-2 uppercase tracking-wide flex items-center gap-1"><PackageX size={12}/> Top 5 Products</p>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center text-gray-600"><span>1. Chicken Sausage</span><span className="font-bold text-white bg-[#BB8588] px-1.5 py-0.5 rounded text-[9px]">12%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>2. Beef Ball (L)</span><span className="font-bold text-white bg-[#BB8588]/80 px-1.5 py-0.5 rounded text-[9px]">8%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>3. Bologna Chili</span><span className="font-bold text-white bg-[#BB8588]/60 px-1.5 py-0.5 rounded text-[9px]">5%</span></li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-[#BB8588]/10 backdrop-blur-sm">
                        <p className="font-bold text-[#BB8588] mb-2 uppercase tracking-wide flex items-center gap-1"><SearchX size={12}/> Top 5 Causes</p>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center text-gray-600"><span>1. Casing Split</span><span className="font-bold text-[#BB8588]">40%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>2. Wt. Variation</span><span className="font-bold text-[#BB8588]">25%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>3. Color Off</span><span className="font-bold text-[#BB8588]">15%</span></li>
                        </ul>
                    </div>
                </div>
            </GlassCard>

            {/* PROCESS RISK & CCP */}
            <GlassCard className="flex flex-col group hover:border-[#DCBC1B]/50 bg-gradient-to-br from-white via-[#FFFCF0] to-[#DCBC1B]/15 border-[#DCBC1B]/20 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 text-[#DCBC1B] opacity-[0.1] transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ShieldAlert size={160} />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#2E395F] flex items-center gap-2 uppercase">
                            <div className="p-2 bg-[#DCBC1B]/10 rounded-lg text-[#B06821]">
                                <Activity size={20} />
                            </div>
                            PROCESS RISK & CCP
                        </h2>
                        <p className="text-[10px] text-[#737597] font-medium mt-1 ml-11">Monitoring 12 Control Points</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#537E72] text-white px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 self-start mt-1">
                        <CheckCircle2 size={12}/> CCP Status: Normal
                    </span>
                </div>

                <div className="relative z-10 mt-2 bg-white/60 rounded-xl border border-[#DCBC1B]/20 p-3 backdrop-blur-sm">
                    <p className="font-bold text-[#B06821] text-[10px] mb-2 uppercase tracking-wide border-b border-[#DCBC1B]/20 pb-1">Top Productivity Risks</p>
                    <ul className="space-y-2 text-[10px]">
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#C22D2E]/20 hover:shadow-sm group/list">
                            <span className="flex items-center gap-2 text-[#2E395F] font-medium"><Thermometer size={12} className="text-[#C22D2E]"/> Cutter #2 Temp High</span>
                            <span className="text-[#C22D2E] font-extrabold bg-[#C22D2E]/10 px-1.5 py-0.5 rounded">CRITICAL</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#D8A48F]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#2E395F] font-medium"><Zap size={12} className="text-[#D8A48F]"/> Mixer #1 Vibration</span>
                            <span className="text-[#B06821] font-bold">Warning</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#DCBC1B]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#2E395F] font-medium"><Gauge size={12} className="text-[#DCBC1B]"/> Filler A Speed Drop</span>
                            <span className="text-[#B06821] font-bold opacity-70">Watch</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#55738D]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#2E395F] font-medium"><Users size={12} className="text-[#55738D]"/> Packing Line Manpower</span>
                            <span className="text-[#55738D] font-bold opacity-70">Info</span>
                        </li>
                    </ul>
                </div>
            </GlassCard>
        </div>
    </div>
  );
}
