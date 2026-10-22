import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineUser, HiMail, HiLockClosed, HiArrowRight, HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import { cx } from '../utils/format';

const INTERESTS = [
  'productivity',
  'design',
  'security',
  'analytics',
  'coding',
  'writing',
  'research',
  'planning',
];

const FIELD =
  'w-full bg-white/50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-ink-900 outline-none focus:bg-white focus:border-brand-coral focus:ring-4 focus:ring-brand-coral/10 transition-all placeholder:text-ink-200';
const LABEL = 'text-[11px] font-bold text-ink-400 uppercase tracking-widest ml-1';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (tag) =>
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        interests,
      });
      toast.success('Account created — welcome to Secure Notes!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className={LABEL} htmlFor="register-name">
            Full Name
          </label>
          <div className="relative group">
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
            <input
              id="register-name"
              type="text"
              name="name"
              required
              minLength={2}
              value={formData.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              className={FIELD}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={LABEL} htmlFor="register-email">
            Email Address
          </label>
          <div className="relative group">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
            <input
              id="register-email"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={LABEL} htmlFor="register-password">
              Password
            </label>
            <div className="relative group">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
              <input
                id="register-password"
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={FIELD}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={LABEL} htmlFor="register-confirm">
              Confirm
            </label>
            <div className="relative group">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 group-focus-within:text-brand-coral transition-colors text-xl" />
              <input
                id="register-confirm"
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={FIELD}
              />
            </div>
          </div>
        </div>

        <div>
          <span className={LABEL}>
            <HiSparkles className="mr-1 inline" /> What are you into?
          </span>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((tag) => {
              const active = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={cx(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300',
                    active
                      ? 'border-transparent bg-gradient-to-r from-brand-coral to-brand-tangerine text-white shadow-warm-glow'
                      : 'border-cream-200 bg-white/60 text-ink-600 hover:border-cream-300 hover:bg-white'
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11.5px] text-ink-400">
            Optional — you can change these any time on your profile.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="relative w-full h-[64px] bg-ink-900 rounded-2xl overflow-hidden transition-all group shadow-lg shadow-ink-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-coral via-brand-tangerine to-brand-sun opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-center gap-3 text-white font-bold tracking-wide text-sm uppercase">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </div>
        </motion.button>
      </form>

      <div className="mt-10 pt-8 border-t border-cream-100 text-center">
        <p className="text-ink-400 text-sm font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-brand-coral font-bold hover:text-brand-tangerine transition-colors underline underline-offset-4 decoration-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;