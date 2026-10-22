import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, User, Shield, Plus } from 'lucide-react';
import { cx, EASE } from '../utils/format';

const ITEMS = [
  { to: '/dashboard', label: 'Notes', icon: StickyNote, tint: 'text-brand-coral' },
  { to: '/profile', label: 'Profile', icon: User, tint: 'text-brand-grape' },
];

const BottomNav = ({ onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdd = () => {
    onAddClick?.();
  };

  const items = location.pathname.startsWith('/admin')
    ? [...ITEMS, { to: '/admin', label: 'Admin', icon: Shield, tint: 'text-brand-sky' }]
    : ITEMS;

  const left = items.slice(0, 1);
  const right = items.slice(1);

  const Item = ({ entry }) => {
    const active = location.pathname === entry.to;
    return (
      <button
        type="button"
        onClick={() => navigate(entry.to)}
        className="relative flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-2 py-1.5 outline-none"
        aria-current={active ? 'page' : undefined}
      >
        {active && (
          <motion.span
            layoutId="nav-pill"
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white to-cream-100 shadow-warm-sm"
          />
        )}
        <motion.span
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className={cx('relative', active ? entry.tint : 'text-ink-500')}
        >
          <entry.icon size={19} strokeWidth={active ? 2.5 : 2} fill="none" />
        </motion.span>
        <span
          className={cx(
            'relative text-[10px] font-bold tracking-wide',
            active ? 'text-ink-900' : 'text-ink-500'
          )}
        >
          {entry.label}
        </span>
      </button>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
      <motion.nav
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="pointer-events-auto mx-auto flex w-full max-w-lg items-center justify-between gap-1 rounded-[28px] border border-white/70 bg-white/80 px-3 py-2 shadow-warm-lg backdrop-blur-xl"
      >
        {left.map((entry) => (
          <Item key={entry.to} entry={entry} />
        ))}

        <AnimatePresence>
          <motion.button
            type="button"
            key="add"
            onClick={handleAdd}
            whileHover={{ scale: 1.07, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label="Create new note"
            className="-mt-9 grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-coral to-brand-tangerine text-white shadow-[0_12px_28px_rgba(255,107,91,0.45)] ring-4 ring-cream-50"
          >
            <Plus size={26} strokeWidth={2.6} />
          </motion.button>
        </AnimatePresence>

        {right.map((entry) => (
          <Item key={entry.to} entry={entry} />
        ))}
      </motion.nav>
    </div>
  );
};

export default BottomNav;