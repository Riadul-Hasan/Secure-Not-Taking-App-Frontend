import { useEffect, useState } from 'react';
import { StickyNote, Pencil, Plus } from 'lucide-react';
import { Shell, Head, Foot } from './Dialogs';
import { cx } from '../utils/format';

const NoteModal = ({
  open,
  note = null,
  loading = false,
  error = '',
  onSubmit,
  onCancel,
}) => {
  const isEdit = Boolean(note?._id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
    }
  }, [open, note]);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !loading;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit?.({ title: title.trim(), content: content.trim() });
  };

  return (
    <Shell open={open} onClose={onCancel} size="max-w-2xl">
      <form onSubmit={submit}>
        <Head
          tone={isEdit ? 'grape' : 'coral'}
          icon={isEdit ? Pencil : Plus}
          title={isEdit ? 'Edit note' : 'New note'}
          subtitle={
            isEdit
              ? 'Update the details of this note.'
              : 'Capture a thought — it stays private to your account.'
          }
          onClose={onCancel}
        />

        <div className="space-y-4 px-6 pb-5">
          <div>
            <label className="w-label" htmlFor="note-title">
              Title
            </label>
            <input
              id="note-title"
              className="w-field"
              value={title}
              maxLength={160}
              placeholder="A short, memorable title"
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="w-label" htmlFor="note-content">
              Content
            </label>
            <textarea
              id="note-content"
              className="w-field min-h-[190px] resize-y leading-relaxed"
              value={content}
              placeholder="Write it all down…"
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="mt-1.5 text-[11.5px] text-ink-400">
              {content.trim().length} characters
            </p>
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
          <button type="submit" disabled={!canSubmit} className="w-btn-primary px-6 py-3 text-sm">
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create note'}
          </button>
        </Foot>
      </form>
    </Shell>
  );
};

export default NoteModal;