import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, User as UserIcon, Loader2, ArrowRight, Phone, Mail, Eye, EyeOff, Beef } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [showIdCard, setShowIdCard] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('login', undefined, { employeeId, idCard });
      
      if (response.status === 'success' && response.data) {
        login(response.data);
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F2F4F6] font-sans text-[#2E395F]">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1E242B] p-12 lg:flex">
        {/* Background Image (Shadow/Watermark effect) */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity"
          style={{ 
            backgroundImage: `url('https://www.bradleysmoker.com/cdn/shop/articles/German-Sausage-scaled.jpg?v=1675739123')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Abstract Background Shapes using the provided palette */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#C22D2E] opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#E6E1DB] opacity-20 blur-[100px]"></div>

        {/* Top Logo Area */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A91B18] to-[#96291C] shadow-lg transform rotate-3">
              <Beef size={26} className="text-[#EFEBCE]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
                <h1 className="text-white font-brand text-2xl tracking-widest whitespace-nowrap"><span className="font-light">MEAT</span><span className="font-bold text-[#A91B18]">PRO</span></h1>
                <p className="text-[#90B7BF] text-[10px] font-bold uppercase tracking-[0.55em] whitespace-nowrap ml-1 mt-1">Halal MES</p>
            </div>
          </div>
        </div>

        {/* Main Branding Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-black tracking-tight text-white leading-tight">
              PRODUCTION <span className="text-[#BB8588] italic">STATUS</span> <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#537E72] to-[#90B7BF]">TRACKING SYSTEM</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#90B7BF]">
              High Quality & Safety Product for Consumption. Streamline your production and take full control of your manufacturing process.
            </p>
          </motion.div>

          {/* Decorative stats/features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8"
          >
            <div>
              <div className="text-3xl font-bold text-[#A91B18]">REAL-TIME</div>
              <div className="mt-1 text-sm text-white/60">Live Tracking</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#A91B18]">100%</div>
              <div className="mt-1 text-sm text-white/60">Process Visibility</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex w-full items-end justify-between">
          <div className="text-sm text-white/70">
            <div className="font-semibold text-white text-base mb-2">T All Intelligence</div>
            <div className="flex flex-wrap items-center gap-3">
              <span>System Provider</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> 082-5695654</span>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1.5"><Mail size={14} /> tallintelligence.ho@gmail.com</span>
            </div>
            <div className="mt-4 text-xs text-white/40 tracking-wider">
              &copy; 2026 ALL RIGHTS RESERVED
            </div>
          </div>

          {/* DEV Profile Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 shadow-lg transition-all hover:bg-white/10 shrink-0"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400" 
              alt="T-DCC Developer" 
              className="h-11 w-11 shrink-0 rounded-full object-cover border-2 border-[#A91B18] shadow-sm"
            />
            <div className="flex flex-col pr-2">
              <span className="text-sm font-bold text-white leading-tight whitespace-nowrap">T-DCC Developer</span>
              <span className="text-xs font-semibold text-[#A91B18] leading-tight mt-0.5 whitespace-nowrap">Lead Developer</span>
              <span className="text-[10px] text-white/50 mt-1 whitespace-nowrap">tallintelligence.dcc@gmail.com</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center lg:text-left">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#A91B18] to-[#96291C] shadow-lg transform rotate-3 lg:hidden">
              <Beef size={26} className="text-[#EFEBCE]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-[#2E395F]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#55738D]">
              Please enter your credentials to access the system.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium leading-6 text-[#2E395F]">
                  Staff Code
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-[#55738D]" />
                  </div>
                  <input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    required
                    className="block w-full rounded-xl border-0 py-3 pl-10 text-[#2E395F] shadow-sm ring-1 ring-inset ring-[#55738D]/20 placeholder:text-[#55738D]/50 focus:ring-2 focus:ring-inset focus:ring-[#C22D2E] sm:text-sm sm:leading-6 transition-all bg-white/60 backdrop-blur-sm"
                    placeholder="e.g., U001 or demo"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="idCard" className="block text-sm font-medium leading-6 text-[#2E395F]">
                  ID Card Number
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-[#55738D]" />
                  </div>
                  <input
                    id="idCard"
                    name="idCard"
                    type={showIdCard ? "text" : "password"}
                    required
                    className="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-[#2E395F] shadow-sm ring-1 ring-inset ring-[#55738D]/20 placeholder:text-[#55738D]/50 focus:ring-2 focus:ring-inset focus:ring-[#C22D2E] sm:text-sm sm:leading-6 transition-all bg-white/60 backdrop-blur-sm"
                    placeholder="13 digits or demo"
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#55738D] hover:text-[#C22D2E] focus:outline-none transition-colors"
                    onClick={() => setShowIdCard(!showIdCard)}
                  >
                    {showIdCard ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-[#C22D2E]/10 p-4 border border-[#C22D2E]/20"
              >
                <p className="text-sm font-medium text-[#C22D2E]">{error}</p>
              </motion.div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A91B18] via-[#96291C] to-[#A91B18] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C22D2E]/30 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C22D2E] disabled:opacity-70 disabled:hover:translate-y-0 transition-all uppercase tracking-wide"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign in to account
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 rounded-xl bg-white/60 backdrop-blur-sm p-4 text-center text-sm text-[#55738D] border border-[#55738D]/10">
              <p className="font-medium text-[#2E395F] mb-1">Demo Credentials</p>
              <p>User: <span className="font-mono font-bold text-[#C22D2E]">demo</span> / Pass: <span className="font-mono font-bold text-[#C22D2E]">demo</span></p>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}

