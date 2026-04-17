import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SecurityGuard from './SecurityGuard';
import { useAuth } from '../context/AuthContext';

const PALETTE = {
    glassWhite: 'rgba(239, 235, 206, 0.85)',
    bgGradientStart: '#F2F4F6',
    bgGradientEnd: '#E6E1DB'
};

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <SecurityGuard>
      <div className="flex h-screen w-full font-sans overflow-hidden bg-[#F2F4F6] text-[#2E395F]">
        {/* Background Decorations */}
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#C22D2E] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#E6E1DB] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content Area */}
        <main className="flex-1 relative transition-all duration-300 overflow-hidden" style={{ background: `linear-gradient(135deg, ${PALETTE.bgGradientStart} 0%, ${PALETTE.bgGradientEnd} 100%)` }}>
            <Header />
            <div className="absolute inset-0 top-24 bottom-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col absolute inset-0 w-full h-full">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                    <footer className="mt-8 py-3.5 text-center border-t border-[#191C20]/10">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                            <div className="flex items-center gap-2 mb-0">
                                <span className="text-[10px] font-bold text-[#BB8588] tracking-widest uppercase">✨ MEAT PRO - Production Management System • ISO 9001, GHPs, HACCP, HALAL CERTIFIED ✨</span>
                            </div>
                            <p className="text-[9px] text-[#55738D] font-mono font-medium tracking-tight">System by <span className="font-bold text-[#2E395F]">T All Intelligence</span> | 📞 082-5695654 | 📧 tallintelligence.ho@gmail.com</p>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
      </div>
    </SecurityGuard>
  );
}
