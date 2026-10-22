import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search, Menu, Lock, StickyNote, Shield, User, LogOut, Plus } from 'lucide-react';
import { cx, EASE, initialsOf } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const ACCENTS = {
  coral: 'from-brand-coral to-brand-tangerine',
  grape: 'from-brand-grape to-purple-500',
  mint: 'from-brand-mint to-emerald-500',
  sky: 'from-brand-sky to-blue-500',
  rose: 'from-brand-rose to-pink-500',
};

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Notes', icon: StickyNote },
  { to: '/profile', label: 'Profile', icon: User },
];

const Navbar = ({
  title = 'Secure Notes',
  subtitle,
  onSearch,
  showSearch = false,
  searchValue = '',
  searchPlaceholder = 'Search your notes…',
  accent = 'coral',
  actions,
  onAddClick,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const gradient = ACCENTS[accent] || ACCENTS.coral;

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    toast.success('Logged out — see you soon!');
    navigate('/login');
  };

  const navItems = isAdmin
    ? [...NAV_ITEMS, { to: '/admin', label: 'Admin', icon: Shield }]
    : NAV_ITEMS;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 backdrop-blur-md -z-10" />
      <motion.div
        initial={{ y: -26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="container mx-auto rounded-[26px] border border-white/70 bg-white/75 px-4 py-3 shadow-warm-md backdrop-blur-xl sm:px-5"
      >
        <div className="flex items-center gap-3">
          <motion.span
            whileHover={{ rotate: -6, scale: 1.05 }}
            className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-warm-sm', gradient)}
          >
            <Lock size={18} strokeWidth={2.4} />
          </motion.span>

          <div className="min-w-0 flex-1">
            <h1 className="w-title truncate text-lg leading-tight sm:text-xl">{title}</h1>
            <p className="w-sub truncate text-[12.5px]">
              {subtitle || 'Your warm little corner of the cloud'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((entry) => (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-bold transition',
                      isActive
                        ? 'bg-cream-100 text-ink-900 shadow-warm-xs'
                        : 'text-ink-500 hover:bg-cream-100 hover:text-ink-900'
                    )
                  }
                >
                  <entry.icon size={16} />
                  {entry.label}
                </NavLink>
              ))}
            </nav>

            {onAddClick && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onAddClick}
                aria-label="Create a new note"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-cream-200 bg-white/80 text-ink-600 transition hover:border-brand-coral/40 hover:text-brand-coral"
              >
                <Plus size={17} />
              </motion.button>
            )}


            <div className="relative" ref={menuRef}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Account menu"
                className={cx(
                  'grid h-10 w-10 place-items-center rounded-2xl border transition',
                  menuOpen
                    ? 'border-transparent bg-gradient-to-br from-brand-coral to-brand-tangerine text-white shadow-warm-glow'
                    : 'border-cream-200 bg-white/80 text-ink-600 hover:text-ink-900'
                )}
              >
                {user?.name ? (
                  <span className="text-[13px] font-extrabold">{initialsOf(user.name)}</span>
                ) : (
                  <Menu size={17} />
                )}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-3xl border border-cream-200 bg-white p-1.5 shadow-warm-lg"
                    >
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-bold text-ink-900">{user?.name}</p>
                        <p className="truncate text-[12px] text-ink-500">{user?.email}</p>
                        <span
                          className={cx(
                            'mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                            isAdmin ? 'bg-brand-sky/15 text-brand-sky' : 'bg-brand-grape/15 text-brand-grape'
                          )}
                        >
                          {isAdmin ? <Shield size={11} /> : <User size={11} />}
                          {user?.role || 'user'}
                        </span>
                      </div>
                      <div className="my-1 h-px bg-cream-200" />
                      {navItems.map((row) => (
                        <button
                          key={row.to}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate(row.to);
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-ink-700 transition hover:bg-cream-100 hover:text-ink-900"
                        >
                          <row.icon size={16} className="text-ink-500" /> {row.label}
                        </button>
                      ))}
                      <div className="my-1 h-px bg-cream-200" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
            className="relative mt-3"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-field !py-2.5 !pl-10 text-[13.5px]"
            />
          </motion.div>
        )}
      </motion.div>
    </header>
  );
};

export default Navbar;