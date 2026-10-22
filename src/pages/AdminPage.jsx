import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Users,
  StickyNote,
  BarChart3,
  Pencil,
  Trash2,
  UserPlus,
  Search,
  RefreshCw,
  Layers,
  Shield,
} from 'lucide-react';
import PageShell from '../components/PageShell';
import UserModal from '../components/UserModal';
import ConfirmModal from '../components/ConfirmModal';
import Pagination from '../components/Pagination';
import { ListSkeleton, EmptyState } from '../components/Skeletons';
import api from '../api/axios';
import { cx, formatDate, relTime, snippet, initialsOf } from '../utils/format';

const TABS = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'notes', label: 'All notes', icon: StickyNote },
  { key: 'aggregations', label: 'Aggregations', icon: BarChart3 },
];

const PAGE_SIZE = 4;

const AdminPage = () => {
  const [tab, setTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [userMeta, setUserMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  const [userModal, setUserModal] = useState({ open: false, user: null });
  const [userSaving, setUserSaving] = useState(false);
  const [userModalError, setUserModalError] = useState('');
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [notes, setNotes] = useState([]);
  const [noteMeta, setNoteMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [notePage, setNotePage] = useState(1);
  const [noteSearch, setNoteSearch] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState('');

  const [groups, setGroups] = useState(null);
  const [groupError, setGroupError] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupMeta, setGroupMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 });
  const [groupPage, setGroupPage] = useState(1);

  const [posts, setPosts] = useState(null);
  const [postsError, setPostsError] = useState('');
  const [postsLoading, setPostsLoading] = useState(false);
  const [inspectUserId, setInspectUserId] = useState('');
  const [postMeta, setPostMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 });

  const loadUsers = useCallback(async (targetPage = 1, term = '', role = '') => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await api.get('/users', {
        params: {
          page: targetPage,
          limit: PAGE_SIZE,
          ...(term ? { search: term } : {}),
          ...(role ? { role } : {}),
        },
      });
      setUsers(res.data?.data || []);
      setUserMeta({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || PAGE_SIZE,
        totalPages: res.data?.totalPages || 1,
      });
    } catch (err) {
      setUsersError(err?.response?.data?.message || 'Could not load users');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadNotes = useCallback(async (targetPage = 1, term = '') => {
    setNotesLoading(true);
    setNotesError('');
    try {
      const res = await api.get('/notes/all', {
        params: { page: targetPage, limit: PAGE_SIZE, ...(term ? { search: term } : {}) },
      });
      setNotes(res.data?.data || []);
      setNoteMeta({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || PAGE_SIZE,
        totalPages: res.data?.totalPages || 1,
      });
    } catch (err) {
      setNotesError(err?.response?.data?.message || 'Could not load notes');
      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  }, []);


  const loadGroups = useCallback(async (targetPage = 1) => {
    setGroupsLoading(true);
    setGroupError('');
    try {
      const res = await api.get('/aggregations/group-by-interests', {
        params: { page: targetPage, limit: PAGE_SIZE },
      });
      setGroups({
        groups: res.data?.data || [],
        totalUsers: res.data?.summary?.totalUsers || 0,
        usersWithoutInterests: res.data?.summary?.usersWithoutInterests || 0,
        groupCount: res.data?.total || 0,
      });
      setGroupMeta({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || PAGE_SIZE,
        totalPages: res.data?.totalPages || 0,
      });
    } catch (err) {
      setGroupError(err?.response?.data?.message || 'Could not load the interest aggregation');
      setGroups(null);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  const loadUserPosts = useCallback(async (userId, targetPage = 1) => {
    if (!userId) return;
    setPostsLoading(true);
    setPostsError('');
    setPosts(null);
    try {
      const res = await api.get(`/aggregations/user-posts/${userId}`, {
        params: { page: targetPage, limit: PAGE_SIZE },
      });
      setPosts({
        ...res.data?.data,
        postCount: res.data?.total || 0,
      });
      setPostMeta({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || PAGE_SIZE,
        totalPages: res.data?.totalPages || 0,
      });
    } catch (err) {
      setPostsError(err?.response?.data?.message || 'Could not load that user');
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(1, '', '');
  }, [loadUsers]);

  useEffect(() => {
    loadNotes(1, '');
  }, [loadNotes]);

  useEffect(() => {
    loadGroups(1);
  }, [loadGroups]);

  useEffect(() => {
    const t = setTimeout(() => {
      setUserPage(1);
      loadUsers(1, userSearch.trim(), roleFilter);
    }, 350);
    return () => clearTimeout(t);
  }, [userSearch, roleFilter, loadUsers]);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotePage(1);
      loadNotes(1, noteSearch.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [noteSearch, loadNotes]);

  const saveUser = async (payload) => {
    const isEditing = Boolean(userModal.user);
    setUserSaving(true);
    setUserModalError('');
    try {
      if (isEditing) {
        await api.put(`/users/${userModal.user._id}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/users', payload);
        toast.success('User created');
      }
      setUserModal({ open: false, user: null });
      const targetPage = isEditing ? userPage : 1;
      setUserPage(targetPage);
      await loadUsers(targetPage, userSearch.trim(), roleFilter);
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not save the user';
      setUserModalError(message);
      toast.error(message);
    } finally {
      setUserSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!deletingUser) return;
    setDeleteBusy(true);
    try {
      const res = await api.delete(`/users/${deletingUser._id}`);
      const cascade = res.data?.data?.cascade;
      toast.success(
        cascade
          ? `User deleted (${cascade.notes} notes, ${cascade.posts} posts removed)`
          : 'User deleted'
      );
      setDeletingUser(null);
      const nextPage = users.length === 1 && userPage > 1 ? userPage - 1 : userPage;
      setUserPage(nextPage);
      loadUsers(nextPage, userSearch.trim(), roleFilter);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete the user');
    } finally {
      setDeleteBusy(false);
    }
  };


  return (
    <PageShell
      title="Admin Console"
      subtitle="Manage accounts, review every note and inspect the live aggregations"
      accent="sky"
      hideNav
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TABS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setTab(entry.key)}
            className={cx(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition',
              tab === entry.key
                ? 'bg-gradient-to-r from-brand-sky to-blue-500 text-white shadow-[0_8px_24px_rgba(59,163,255,0.28)]'
                : 'border border-cream-300 bg-white/80 text-ink-600 hover:bg-cream-100'
            )}
          >
            <entry.icon size={16} /> {entry.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'users' && (
          <motion.section
            key="users"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-panel mb-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
                  <input
                    type="search"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="w-field !py-2.5 !pl-10 text-[13.5px]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-field !py-2.5 sm:w-44"
                >
                  <option value="">All roles</option>
                  <option value="admin">Admins</option>
                  <option value="user">Users</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setUserModal({ open: true, user: null });
                    setUserModalError('');
                  }}
                  className="w-btn-primary px-4 py-2.5 text-sm"
                >
                  <UserPlus size={16} /> New user
                </button>
              </div>
            </div>

            {usersError && (
              <div className="mb-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                {usersError}
              </div>
)}

            {!usersLoading && users.length > 0 && (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="w-card w-card-hover flex items-center gap-4 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-sky to-blue-500 text-[13px] font-extrabold text-white shadow-warm-sm">
                      {initialsOf(u.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{u.name}</p>
                      <p className="truncate text-[12.5px] text-ink-500">{u.email}</p>
                      {Array.isArray(u.interests) && u.interests.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {u.interests.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-cream-100 px-2 py-0.5 text-[10.5px] font-bold text-ink-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <span
                      className={cx(
                        'hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider sm:inline-flex',
                        u.role === 'admin'
                          ? 'bg-brand-sky/15 text-brand-sky'
                          : 'bg-brand-grape/15 text-brand-grape'
                      )}
                    >
                      {u.role === 'admin' ? <Shield size={11} /> : <Users size={11} />}
                      {u.role}
                    </span>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserModal({ open: true, user: u });
                          setUserModalError('');
                        }}
                        aria-label="Edit user"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-cream-200 bg-white/80 text-ink-500 transition hover:border-brand-grape/40 hover:text-brand-grape"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingUser(u)}
                        aria-label="Delete user"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-cream-200 bg-white/80 text-ink-500 transition hover:border-brand-rose/40 hover:text-brand-rose"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!usersLoading && userMeta.total > 0 && (
              <Pagination
                page={userMeta.page}
                totalPages={userMeta.totalPages}
                total={userMeta.total}
                limit={userMeta.limit}
                onChange={(p) => {
                  setUserPage(p);
                  loadUsers(p, userSearch.trim(), roleFilter);
                }}
              />
            )}

          </motion.section>
        )}

        {tab === 'notes' && (
          <motion.section
            key="notes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-panel mb-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
                <input
                  type="search"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  placeholder="Search every note on the system…"
                  className="w-field !py-2.5 !pl-10 text-[13.5px]"
                />
              </div>
            </div>

            {notesError && (
              <div className="mb-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
                {notesError}
              </div>
            )}

            {notesLoading && <ListSkeleton rows={4} />}

            {!notesLoading && notes.length === 0 && (
              <EmptyState
                icon={StickyNote}
                tone="grape"
                title="No notes on the system"
                text="Nobody has written a note yet — or the search found nothing."
              />
            )}

            {!notesLoading && notes.length > 0 && (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note._id} className="w-card w-card-hover p-5">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-grape to-purple-500 text-white shadow-warm-sm">
                        <StickyNote size={18} strokeWidth={2.2} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="w-title truncate text-[15.5px]">{note.title}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                          {snippet(note.content, 160)}
                        </p>
                        <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400">
                          {note.user?.name || 'Unknown'} · {relTime(note.createdAt)} ·{' '}
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!notesLoading && noteMeta.total > 0 && (
              <Pagination
                page={noteMeta.page}
                totalPages={noteMeta.totalPages}
                total={noteMeta.total}
                limit={noteMeta.limit}
                onChange={(p) => {
                  setNotePage(p);
                  loadNotes(p, noteSearch.trim());
                }}
              />
            )}

          </motion.section>
        )}

        {tab === 'aggregations' && (
          <motion.section
            key="aggregations"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="w-panel">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="w-title flex items-center gap-2 text-lg">
                    <Layers size={17} className="text-brand-grape" /> Users grouped by interest
                  </h3>
                  <p className="w-sub mt-1">
                    One <code className="rounded bg-cream-100 px-1">User.aggregate()</code> call — no
                    extra queries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadGroups(groupPage)}
                  className="w-btn-soft px-4 py-2.5 text-sm"
                >
                  <RefreshCw size={15} className={groupsLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {groupError && (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-600">
                  {groupError}
                </p>
              )}

              {groupsLoading && <ListSkeleton rows={3} />}

              {!groupsLoading && groups && (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="w-eyebrow">{groups.groupCount} groups</span>
                    <span className="w-eyebrow">{groups.totalUsers} memberships</span>
                    {groups.usersWithoutInterests > 0 && (
                      <span className="w-eyebrow !border-brand-tangerine/40 !bg-brand-tangerine/10 !text-brand-tangerine">
                        {groups.usersWithoutInterests} without interests
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {groups.groups.map((group) => (
                      <div key={group.interest} className="rounded-3xl border border-cream-200 bg-white/70 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-ink-900">{group.interest}</h4>
                          <span className="rounded-full bg-brand-grape/12 px-2.5 py-0.5 text-[11px] font-bold text-brand-grape">
                            {group.count} {group.count === 1 ? 'user' : 'users'}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-1.5">
                          {group.members.map((member) => (
                            <li
                              key={member._id}
                              className="flex items-center justify-between gap-2 text-[12.5px]"
                            >
                              <span className="truncate text-ink-700">
                                {member.name}{' '}
                                <span className="text-ink-400">· {member.email}</span>
                              </span>
                              <span className="shrink-0 rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-500">
                                {member.role}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {group.count > group.members.length && (
                          <p className="mt-2 text-[11px] text-ink-400">
                            +{group.count - group.members.length} more
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <Pagination
                    {...groupMeta}
                    onChange={(nextPage) => {
                      setGroupPage(nextPage);
                      loadGroups(nextPage);
                    }}
                  />
                </>
              )}
            </div>

            <div className="w-panel">
              <h3 className="w-title flex items-center gap-2 text-lg">
                <Users size={17} className="text-brand-sky" /> User &amp; posts inspector
              </h3>
              <p className="w-sub mt-1">
                A single <code className="rounded bg-cream-100 px-1">$lookup</code> pipeline joins the
                user with their posts.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={inspectUserId}
                  onChange={(e) => setInspectUserId(e.target.value.trim())}
                  placeholder="Paste a user id…"
                  className="w-field flex-1 !py-2.5 text-[13.5px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPostMeta((meta) => ({ ...meta, page: 1 }));
                    loadUserPosts(inspectUserId, 1);
                  }}
                  disabled={!inspectUserId || postsLoading}
                  className="w-btn-primary px-5 py-2.5 text-sm"
                >
                  {postsLoading ? 'Loading…' : 'Inspect user'}
                </button>
              </div>

              {postsError && (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-600">
                  {postsError}
                </p>
              )}

              {posts && (
                <div className="mt-4">
                  <div className="rounded-3xl border border-cream-200 bg-white/70 p-4">
                    <p className="text-sm font-bold text-ink-900">{posts.user.name}</p>
                    <p className="text-[12.5px] text-ink-500">{posts.user.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {posts.user.interests?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-cream-100 px-2 py-0.5 text-[10.5px] font-bold text-ink-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="mt-4 text-sm font-bold text-ink-800">
                    {posts.postCount} {posts.postCount === 1 ? 'post' : 'posts'}
                  </h4>

                  <div className="mt-2 space-y-2">
                    {posts.postCount === 0 && (
                      <p className="rounded-2xl border border-dashed border-cream-300 bg-cream-100/60 px-4 py-6 text-center text-[13px] text-ink-500">
                        This user has no posts yet.
                      </p>
                    )}
                    {posts.posts.map((post) => (
                      <div key={post._id} className="rounded-2xl border border-cream-200 bg-white/70 p-4">
                        <p className="text-[13.5px] font-bold text-ink-900">{post.title}</p>
                        <p className="mt-1 text-[12.5px] text-ink-500">{snippet(post.content, 150)}</p>
                        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    {...postMeta}
                    onChange={(nextPage) => loadUserPosts(inspectUserId, nextPage)}
                  />
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <UserModal
        open={userModal.open}
        user={userModal.user}
        loading={userSaving}
        error={userModalError}
        onSubmit={saveUser}
        onCancel={() => {
          if (!userSaving) setUserModal({ open: false, user: null });
        }}
      />
      <ConfirmModal
        open={Boolean(deletingUser)}
        title="Delete user?"
        message={`Delete ${deletingUser?.name || 'this user'}?`}
        detail="Their notes and posts will also be deleted. This action cannot be undone."
        loading={deleteBusy}
        onConfirm={deleteUser}
        onCancel={() => {
          if (!deleteBusy) setDeletingUser(null);
        }}
      />
    </PageShell>
  );
};

export default AdminPage;