import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiMail, HiLockClosed, HiArrowRight, HiSparkles, HiShieldCheck } from 'react-icons/hi';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    key: 'admin',
    label: 'Demo Admin',
    hint: 'admin@example.com / adminPassword123',
    email: 'admin@example.com',
    password: 'adminPassword123',
    tint: 'from-brand-sky to-blue-500',
  },
  {
    key: 'user',
    label: 'Demo User',
    hint: 'john@example.com / password123',
    email: 'john@example.com',
    password: 'password123',
    tint: 'from-brand-coral to-brand-tangerine',
  },
];

const FIELD =
  'w-full bg-white/50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-ink-900 outline-none focus:bg-white focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/10 transition-all placeholder:text-ink-200';
const LABEL = 'text-[11px] font-bold text-ink-400 uppercase tracking-widest ml-1';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Welcome back! Access granted');
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (account) => {
    setFormData({ email: account.email, password: account.password });
    setLoading(true);
    try {
      const user = await login(account.email, account.password);
      toast.success(`Signed in as ${account.label}`);
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthShell title="Login">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={LABEL} htmlFor="login-email">
            Email Address
          </label>
          <div className="relative group">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
            <input
              id="login-email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={FIELD}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={LABEL} htmlFor="login-password">
            Password
          </label>
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
            <input
              id="login-password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={FIELD}
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="relative w-full h-[64px] bg-ink-900 rounded-2xl overflow-hidden transition-all active:scale-[0.98] group shadow-lg shadow-ink-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-coral via-brand-tangerine to-brand-sun opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-center gap-3 text-white font-bold tracking-wide text-sm uppercase">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Workspace</span>
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>
      </form>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-cream-200" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
            Or try a demo
          </span>
          <span className="h-px flex-1 bg-cream-200" />
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.key}
              type="button"
              disabled={loading}
              onClick={() => loginAsDemo(account)}
              className="group rounded-2xl border border-cream-200 bg-white/70 px-4 py-3 text-left transition hover:border-brand-coral/40 hover:bg-white disabled:opacity-60"
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${account.tint} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white`}
              >
                {account.key === 'admin' ? <HiShieldCheck /> : <HiSparkles />}
                {account.label}
              </span>
              <span className="mt-1.5 block truncate text-[11.5px] text-ink-500">{account.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-cream-100 text-center">
        <p className="text-ink-400 text-sm font-medium">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-coral font-bold hover:text-brand-tangerine transition-colors underline underline-offset-4 decoration-2"
          >
            Create one now
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
