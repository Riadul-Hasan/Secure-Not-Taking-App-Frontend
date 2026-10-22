import { useEffect, useState } from 'react';
import { UserPlus, Pencil, Shield, Sparkles } from 'lucide-react';
import { Shell, Head, Foot } from './Dialogs';
import { cx } from '../utils/format';

export const INTEREST_OPTIONS = [
  'productivity',
  'design',
  'security',
  'analytics',
  'coding',
  'writing',
  'research',
  'planning',
  'finance',
  'health',
];

const UserModal = ({
  open,
  user = null,
  loading = false,
  error = '',
  onSubmit,
  onCancel,
}) => {
  const isEdit = Boolean(user?._id);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    interests: [],
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'user',
        interests: Array.isArray(user?.interests) ? user.interests : [],
      });
    }
  }, [open, user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleInterest = (tag) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(tag)
        ? f.interests.filter((t) => t !== tag)
        : [...f.interests, tag],
    }));

  const valid =
    form.name.trim().length >= 2 &&
    form.email.trim().length > 0 &&
    (isEdit || form.password.length >= 8);

  const submit = (e) => {
    e.preventDefault();
    if (!valid || loading) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      interests: form.interests,
    };
    if (form.password) payload.password = form.password;

    onSubmit?.(payload);
  };

  return (
    <Shell open={open} onClose={onCancel} size="max-w-xl">
      <form onSubmit={submit}>
        <Head
          tone={isEdit ? 'grape' : 'sky'}
          icon={isEdit ? Pencil : UserPlus}
          title={isEdit ? 'Edit user' : 'Create user'}
          subtitle={
            isEdit
              ? 'Update the account details and role.'
              : 'Add a new account to the workspace.'
          }
          onClose={onCancel}
        />

        <div className="space-y-4 px-6 pb-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="w-label" htmlFor="user-name">
                Full name
              </label>
              <input
                id="user-name"
                className="w-field"
                value={form.name}
                onChange={set('name')}
                placeholder="Ada Lovelace"
                autoFocus
              />
            </div>

            <div>
              <label className="w-label" htmlFor="user-email">
                Email
              </label>
              <input
                id="user-email"
                type="email"
                className="w-field"
                value={form.email}
                onChange={set('email')}
                placeholder="ada@example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="w-label" htmlFor="user-password">
                Password {isEdit && <span className="normal-case text-ink-400">(leave blank to keep)</span>}
              </label>
              <input
                id="user-password"
                type="password"
                className="w-field"
                value={form.password}
                onChange={set('password')}
                placeholder={isEdit ? '••••••••' : 'At least 8 characters'}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="w-label" htmlFor="user-role">
                Role
              </label>
              <select id="user-role" className="w-field" value={form.role} onChange={set('role')}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <span className="w-label">
              <Sparkles size={12} className="mr-1 inline" /> Interests
            </span>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((tag) => {
                const active = form.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={cx('w-chip', active && 'w-chip-active')}
                  >
                    {active && <Shield size={12} />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-semibold text-rose-600">
              {error}
            </p>
          )}
        </div>

        <Foot>
          <button type="button" onClick={onCancel} className="w-btn-soft px-5 py-3 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={!valid || loading} className="w-btn-primary px-6 py-3 text-sm">
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
          </button>
        </Foot>
      </form>
    </Shell>
  );
};

export default UserModal;