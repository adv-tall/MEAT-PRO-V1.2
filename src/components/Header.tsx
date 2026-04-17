import React, { useState, useEffect } from 'react';
import { Clock, Bell, Beef } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-24 px-8 flex items-center justify-between z-10 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-4 group select-none">
            <div className="relative w-14 h-14 flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                {/* Ambient glowing fuzz behind the icon */}
                <div className="absolute w-10 h-10 bg-[#FF2A54] rounded-full blur-[16px] opacity-60 group-hover:opacity-100 group-hover:blur-[22px] animate-pulse transition-all duration-500"></div>
                
                {/* Neon glowing Meat Icon */}
                <Beef size={38} strokeWidth={2} className="text-[#FF2A54] drop-shadow-[0_0_10px_rgba(255,42,84,0.9)] relative z-10 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-center">
                <h2 className="text-lg lg:text-xl font-black text-[#2E395F] tracking-tight leading-none drop-shadow-sm">AUTHENTIC <span className="text-[#BB8588] italic">&</span> VARIETY <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#537E72] to-[#184F61]">HALAL FOOD</span></h2>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-0.5 w-8 bg-[#DCBC1B] rounded-full shadow-[0_0_5px_#DCBC1B]"></div>
                    <p className="text-[10px] font-bold text-[#55738D] tracking-[0.15em] uppercase group-hover:text-[#C22D2E] transition-colors duration-300">High Quality & Safety Product for Consumption</p>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-4 bg-white/50 rounded-lg pl-4 pr-1 py-1 border border-[#D7CE93]/30 shadow-sm backdrop-blur-sm group hover:bg-white/70 transition-colors">
                <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] font-bold text-[#7B555C] tracking-widest uppercase">{currentTime.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                    <span className="text-xs font-bold text-[#2E395F]">{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="h-6 w-[1px] bg-[#90B7BF]/40"></div>
                <div className="flex items-center gap-2 bg-[#A91B18] text-white px-3 py-1.5 rounded font-mono text-sm tracking-widest shadow-inner">
                    <Clock size={14} className="text-white animate-pulse"/> {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <button className="relative p-3 rounded-full bg-white/50 hover:bg-white/70 transition-colors border border-white/60">
                <Bell size={18} className="text-[#2E395F]" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#A91B18] rounded-full border border-white"></span>
            </button>
        </div>
    </header>
  );
}
