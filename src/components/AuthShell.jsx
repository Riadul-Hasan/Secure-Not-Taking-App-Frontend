import { motion } from 'framer-motion';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi';

const AuthShell = ({ children, title, accentLine = true }) => (
  <div className="relative min-h-screen w-full bg-[#fffbf7] flex flex-col items-center justify-center p-4 py-12 overflow-hidden">
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-coral/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-grape/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
    </div>

    <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'power4.out' }}
        className="w-full lg:w-1/2 text-center lg:text-left"
      >
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand-coral/20 px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <HiSparkles className="text-brand-coral" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-coral/80">
            Secure Workspace
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-ink-900 leading-[1.1] tracking-tighter mb-6">
          Welcome <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-coral via-brand-tangerine to-brand-sun italic">
            Back Home.
          </span>
        </h1>
        <p className="text-ink-500 text-lg md:text-xl max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
          A private home for your notes — warm, private and always within reach.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: 'power4.out' }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-warm-xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-coral/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-coral/10" />

          <div className="relative mb-8">
            <h2 className="text-3xl font-display font-bold text-ink-900 tracking-tight">{title}</h2>
            {accentLine && (
              <div className="h-1.5 w-12 bg-gradient-to-r from-brand-coral to-brand-tangerine rounded-full mt-3" />
            )}
          </div>

          {children}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 opacity-60">
          <HiShieldCheck className="text-brand-coral text-xl" />
          <span className="text-[10px] text-ink-500 font-bold uppercase tracking-[0.2em]">
            JWT Secured Workspace
          </span>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AuthShell;