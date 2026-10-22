import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { StickyNote, Pencil, Trash2, Plus, Shield, Search, Eye } from 'lucide-react';
import PageShell from '../components/PageShell';
import NoteModal from '../components/NoteModal';
import ConfirmModal from '../components/ConfirmModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import Pagination from '../components/Pagination';
import { ListSkeleton, EmptyState } from '../components/Skeletons';
import api from '../api/axios';
import { EASE, formatDate, relTime, snippet } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 4;

const DashboardPage = () => {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);

  const loadNotes = useCallback(async (targetPage = 1, term = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/notes', {
        params: { page: targetPage, limit: PAGE_SIZE, ...(term ? { search: term } : {}) },
      });
      setNotes(res.data?.data || []);
      setMeta({
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        limit: res.data?.limit || PAGE_SIZE,
        totalPages: res.data?.totalPages || 1,
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes(1, '');
  }, [loadNotes]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      loadNotes(1, search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search, loadNotes]);

  const openCreate = () => {
    setEditing(null);
    setModalError('');
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setModalError('');
    setModalOpen(true);
  };

  const saveNote = async (values) => {
    setSaving(true);
    setModalError('');
    try {
      if (editing) {
        await api.put(`/notes/${editing._id}`, values);
        toast.success('Note updated');
      } else {
        await api.post('/notes', values);
        toast.success('Note created');
      }
      setModalOpen(false);
      loadNotes(page, search.trim());
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not save the note';
      setModalError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/notes/${deleting._id}`);
      toast.success('Note deleted');
      setDeleting(null);
      // Step back a page if the last item on it was removed.
      const nextPage = notes.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      loadNotes(nextPage, search.trim());
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete the note');
    } finally {
      setDeleteBusy(false);
    }
  };


  return (
    <PageShell
      title="My Notes"
      subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'friend'} — these are yours alone.`}
      accent="coral"
      showSearch
      searchValue={search}
      searchPlaceholder="Search your notes…"
      onSearch={setSearch}
      onAddClick={openCreate}
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="hidden sm:inline-flex w-btn-primary px-4 py-2.5 text-sm"
        >
          <Plus size={16} /> New note
        </button>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <span className="w-eyebrow">
          <StickyNote size={12} /> {meta.total} {meta.total === 1 ? 'note' : 'notes'}
        </span>
        {user?.role === 'admin' && (
          <span className="w-eyebrow !border-brand-sky/30 !bg-brand-sky/10 !text-brand-sky">
            <Shield size={12} /> Admin account
          </span>
        )}
        {search && (
          <span className="w-eyebrow !border-brand-grape/30 !bg-brand-grape/10 !text-brand-grape">
            <Search size={12} /> “{search}”
          </span>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {loading && <ListSkeleton rows={4} />}

      {!loading && !error && notes.length === 0 && (
        <EmptyState
          icon={StickyNote}
          tone="coral"
          title={search ? 'No notes match that search' : 'Your notebook is empty'}
          text={
            search
              ? 'Try a different word — or clear the search to see everything.'
              : 'Capture your first thought. It stays private to your account.'
          }
          action={
            !search && (
              <button type="button" onClick={openCreate} className="w-btn-primary mt-5 px-6 py-3 text-sm">
                <Plus size={16} /> Create your first note
              </button>
            )
          }
        />
      )}

      {!loading && notes.length > 0 && (
        <div className="space-y-3.5">
          <AnimatePresence initial={false}>
            {notes.map((note, i) => (
              <motion.article
                key={note._id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3), ease: EASE }}
                className="w-card w-card-hover p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-coral to-brand-tangerine text-white shadow-warm-sm">
                    <StickyNote size={18} strokeWidth={2.2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="w-title truncate text-[15.5px]">{note.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                      {snippet(note.content, 180)}
                    </p>
                    <p className="mt-2 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400">
                      {relTime(note.createdAt)} · {formatDate(note.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingNote(note)}
                      aria-label="View note"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-cream-200 bg-white/80 text-ink-500 transition hover:border-brand-sky/40 hover:text-brand-sky"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(note)}
                      aria-label="Edit note"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-cream-200 bg-white/80 text-ink-500 transition hover:border-brand-grape/40 hover:text-brand-grape"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(note)}
                      aria-label="Delete note"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-cream-200 bg-white/80 text-ink-500 transition hover:border-brand-rose/40 hover:text-brand-rose"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && meta.total > 0 && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onChange={(p) => {
            setPage(p);
            loadNotes(p, search.trim());
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      <NoteModal
        open={modalOpen}
        note={editing}
        loading={saving}
        error={modalError}
        onSubmit={saveNote}
        onCancel={() => setModalOpen(false)}
      />

      <ViewDetailsModal
        type="note"
        item={viewingNote}
        authorName={user?.name}
        onClose={() => setViewingNote(null)}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete this note?"
        message="This cannot be undone."
        detail={deleting?.title}
        confirmLabel="Delete note"
        loading={deleteBusy}
        onConfirm={deleteNote}
        onCancel={() => setDeleting(null)}
      />
    </PageShell>
  );
};

export default DashboardPage;