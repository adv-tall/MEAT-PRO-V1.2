import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  Beef,
  ChevronDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../config/menu';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
    if (isCollapsed) setIsCollapsed(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 96 : 288 }}
      className="flex-shrink-0 flex flex-col transition-all duration-500 z-30 shadow-2xl relative bg-[#141619]"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-[#A91B18] text-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(169,27,24,0.5)] hover:scale-110 transition-transform z-50 border-2 border-[#141619]"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo Area */}
      <div className="h-32 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A91B18] to-[#96291C] flex items-center justify-center shadow-lg transform rotate-3">
                  <Beef size={26} className="text-[#EFEBCE]" strokeWidth={2.5} />
              </div>
              <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center ${!isCollapsed ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  <h1 className="text-white font-brand text-xl tracking-widest whitespace-nowrap"><span className="font-light">MEAT</span><span className="font-bold text-[#A91B18]">PRO</span></h1>
                  <p className="text-[#90B7BF] text-[10px] font-bold uppercase tracking-[0.55em] text-center whitespace-nowrap ml-1 mt-1">Halal MES</p>
              </div>
          </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar py-4 relative z-10">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isDirectActive = location.pathname === item.path && !hasSubItems;
          const isParentActive = hasSubItems && item.subItems?.some(sub => location.pathname === sub.path);
          const isExpanded = expandedMenus[item.id];

          return (
            <div key={item.id} className="mb-2">
              {hasSubItems ? (
                <button 
                  onClick={() => toggleMenu(item.id)}
                  className={twMerge(clsx(
                    "w-full flex items-center px-4 py-3 transition-all duration-500 group relative rounded-xl mx-auto overflow-hidden",
                    isParentActive ? 'text-[#C22D2E] bg-[#C22D2E]/10 border border-[#C22D2E]/20' : 'text-[#737597] hover:text-[#C22D2E] hover:bg-gradient-to-r hover:from-[#C22D2E]/10 hover:to-transparent hover:border hover:border-[#C22D2E]/30',
                    isCollapsed ? 'justify-center w-12 px-0' : 'w-[90%]'
                  ))}
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none group-hover:animate-shimmer" />
                  <Icon size={22} strokeWidth={isParentActive ? 2.5 : 2} className={clsx("relative z-10 transition-transform duration-300", isParentActive ? 'text-[#C22D2E]' : 'group-hover:scale-110 group-hover:text-[#C22D2E]')} />
                  <div className={clsx("relative z-10 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-between flex-1", !isCollapsed ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0')}>
                      <span className={clsx("text-sm tracking-wide uppercase", isParentActive ? 'font-bold' : 'font-medium group-hover:font-semibold')}>{item.name}</span>
                      <ChevronDown size={14} className={clsx("transition-transform duration-300", isExpanded ? 'rotate-180' : '')} />
                  </div>
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => twMerge(clsx(
                    "w-full flex items-center px-4 py-3 transition-all duration-500 group relative rounded-xl mx-auto overflow-hidden",
                    isActive ? 'text-white bg-gradient-to-r from-[#A91B18] via-[#96291C] to-[#A91B18] shadow-[0_0_20px_rgba(217,74,61,0.6)] border border-[#FF8A80]/50' : 'text-[#737597] hover:text-[#C22D2E] hover:bg-gradient-to-r hover:from-[#C22D2E]/10 hover:to-transparent hover:border hover:border-[#C22D2E]/30',
                    isCollapsed ? 'justify-center w-12 px-0' : 'w-[90%]'
                  ))}
                  title={isCollapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <div className={clsx("absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none", isActive ? 'animate-shimmer' : 'group-hover:animate-shimmer')} />
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={clsx("relative z-10 transition-transform duration-300", isActive ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-[#C22D2E]')} />
                      <div className={clsx("relative z-10 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-between flex-1", !isCollapsed ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0')}>
                          <span className={clsx("text-sm tracking-wide uppercase", isActive ? 'font-bold' : 'font-medium group-hover:font-semibold')}>{item.name}</span>
                      </div>
                      {isActive && !isCollapsed && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </>
                  )}
                </NavLink>
              )}

              {/* Sub Items */}
              {hasSubItems && (
                <div className={clsx("overflow-hidden transition-all duration-500 ease-in-out", isExpanded && !isCollapsed ? 'max-h-[500px] opacity-100 mt-2 pl-4' : 'max-h-0 opacity-0')}>
                    <div className="border-l border-[#C22D2E]/20 pl-2 space-y-1">
                    {item.subItems?.map((sub) => (
                        <NavLink 
                          key={sub.id} 
                          to={sub.path}
                          className={({ isActive }) => twMerge(clsx(
                            "w-full flex items-center px-4 py-2 rounded-lg transition-all duration-300 text-xs font-medium uppercase relative overflow-hidden group/sub",
                            isActive ? 'text-white bg-gradient-to-r from-[#A91B18] via-[#96291C] to-[#A91B18] shadow-[0_0_15px_rgba(217,74,61,0.4)] border border-[#FF8A80]/50 font-bold' : 'text-[#737597] hover:text-[#C22D2E] hover:bg-[#C22D2E]/5'
                          ))}
                        >
                          {({ isActive }) => (
                            <>
                              <div className="absolute inset-0 -translate-x-full group-hover/sub:animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none" />
                              <span className={clsx("w-1.5 h-1.5 rounded-full bg-current mr-2 relative z-10 transition-all duration-300", isActive ? 'opacity-100 shadow-[0_0_5px_currentColor] bg-white' : 'opacity-50 group-hover/sub:opacity-100 group-hover/sub:shadow-[0_0_5px_#C22D2E]')}></span>
                              <span className="relative z-10">{sub.name}</span>
                            </>
                          )}
                        </NavLink>
                    ))}
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Actual User Profile Area */}
      {user && (
        <div className="p-6 border-t border-white/5 bg-[#141619] relative z-10">
            <div className={clsx("flex items-center gap-3", isCollapsed && 'justify-center')}>
                <div className="w-10 h-10 rounded-full border-2 border-[#A91B18] overflow-hidden p-0.5 shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-[#E3624A] text-white flex items-center justify-center font-bold rounded-full">
                        {user.name.charAt(0)}
                      </div>
                    )}
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden flex-1">
                        <p className="text-[#B7A596] text-sm font-bold uppercase truncate w-full">{user.email?.split('@')[0] || user.name}</p>
                        <p className="text-[#A91B18] text-[10px] uppercase">Logged in</p>
                    </div>
                )}
                {!isCollapsed && (
                  <button onClick={logout} className="ml-auto text-[#737597] hover:text-[#A91B18] cursor-pointer shrink-0">
                    <LogOut size={18} />
                  </button>
                )}
            </div>
            {isCollapsed && (
              <button onClick={logout} className="mt-4 w-full flex justify-center text-[#737597] hover:text-[#A91B18] cursor-pointer">
                <LogOut size={18} />
              </button>
            )}
        </div>
      )}

    </motion.aside>
  );
}
