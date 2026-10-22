import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { User, Shield, Sparkles, Mail, CalendarDays, Save, KeyRound } from 'lucide-react';
import PageShell from '../components/PageShell';
import { INTEREST_OPTIONS } from '../components/UserModal';
import api from '../api/axios';
import { cx, formatDate, initialsOf } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, patchUser } = useAuth();

  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInterests(Array.isArray(user?.interests) ? user.interests : []);
  }, [user]);

  const toggleInterest = (tag) =>
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const saveInterests = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/me', { interests });
      patchUser(res.data?.data);
      toast.success('Interests updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not update your interests');
    } finally {
      setSaving(false);
    }
  };

  const changed =
    JSON.stringify([...(interests || [])].sort()) !==
    JSON.stringify([...(user?.interests || [])].sort());

  return (
    <PageShell title="Profile" subtitle="Your account details and interests" accent="grape">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-panel h-fit"
        >
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-brand-grape to-purple-500 text-xl font-extrabold text-white shadow-warm-md">
              {initialsOf(user?.name || '')}
            </span>

            <h2 className="w-title mt-4 text-xl">{user?.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-500">
              <Mail size={13} /> {user?.email}
            </p>

            <span
              className={cx(
                'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                user?.role === 'admin'
                  ? 'bg-brand-sky/15 text-brand-sky'
                  : 'bg-brand-grape/15 text-brand-grape'
              )}
            >
              {user?.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
              {user?.role || 'user'}
            </span>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-cream-200 pt-5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2 text-ink-500">
                <CalendarDays size={14} /> Member since
              </span>
              <span className="font-bold text-ink-800">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2 text-ink-500">
                <KeyRound size={14} /> Account type
              </span>
              <span className="font-bold capitalize text-ink-800">{user?.role}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="w-panel"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="w-title flex items-center gap-2 text-lg">
                <Sparkles size={17} className="text-brand-coral" /> Interest tags
              </h3>
              <p className="w-sub mt-1">
                These tags power the admin interest-grouping aggregation.
              </p>
            </div>

            <button
              type="button"
              onClick={saveInterests}
              disabled={!changed || saving}
              className="w-btn-primary px-5 py-2.5 text-sm"
            >
              <Save size={15} /> {saving ? 'Saving…' : 'Save interests'}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((tag) => {
              const active = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={cx('w-chip', active && 'w-chip-active')}
                >
                  {active && <Sparkles size={12} />}
                  {tag}
                </button>
              );
            })}
          </div>

          {interests.length === 0 && (
            <p className="mt-5 rounded-2xl border border-dashed border-cream-300 bg-cream-100/60 px-4 py-6 text-center text-[13px] text-ink-500">
              No interests selected yet — pick a few tags so admins can group you
              meaningfully.
            </p>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;