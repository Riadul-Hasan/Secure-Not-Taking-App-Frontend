import { Eye, Shield, StickyNote, Users } from 'lucide-react';
import { Foot, Head, Shell } from './Dialogs';
import { formatDate, initialsOf } from '../utils/format';

const ViewDetailsModal = ({ type, item, authorName, onClose }) => {
  if (!item || !type) return null;

  const isUser = type === 'user';
  const isNote = type === 'note';
  const title = isUser ? item.name : item.title;
  const Icon = isUser ? Users : isNote ? StickyNote : Eye;
  const author = item.user;

  return (
    <Shell open={Boolean(item)} onClose={onClose} size="max-w-2xl">
      <Head
        tone={isUser ? 'sky' : isNote ? 'coral' : 'grape'}
        icon={Icon}
        title={title || 'Details'}
        subtitle={isUser ? 'Account details' : isNote ? 'Note details' : 'Post details'}
        onClose={onClose}
      />

      <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 pb-5">
        {isUser ? (
          <>
            <div className="flex items-center gap-3 rounded-3xl border border-cream-200 bg-gradient-to-br from-cream-100 to-white p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-sky to-blue-500 text-sm font-extrabold text-white shadow-warm-sm">
                {initialsOf(item.name)}
              </span>
              <div className="min-w-0">
                <p className="break-all text-sm font-bold text-ink-900">{item.email}</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-sky/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-brand-sky">
                  {item.role === 'admin' ? <Shield size={11} /> : <Users size={11} />}
                  {item.role || 'user'}
                </span>
              </div>
            </div>
            <DetailField label="Joined" value={formatDate(item.createdAt) || 'Not available'} />
            <div className="rounded-3xl border border-cream-200 bg-white/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Interests</p>
              {Array.isArray(item.interests) ? item.interests.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-600">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink-500">No interests added.</p>
              ) : (
                <p className="mt-2 text-sm text-ink-500">Interest details are not available in this list.</p>
              )}
            </div>
          </>
        ) : (
          <>
            {(author || authorName) && (
              <div className="rounded-3xl border border-cream-200 bg-cream-100/70 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Author</p>
                <p className="mt-1 text-sm font-semibold text-ink-800">
                  {author?.name || authorName || 'Unknown'}
                  {author?.email ? <span className="font-normal text-ink-500"> · {author.email}</span> : null}
                </p>
              </div>
            )}
            <div className="whitespace-pre-wrap break-words rounded-3xl border border-cream-200 bg-gradient-to-br from-cream-100 to-white p-5 text-[14px] leading-relaxed text-ink-700">
              {item.content?.trim() || 'No content available.'}
            </div>
            <DetailField label="Created" value={formatDate(item.createdAt) || 'Not available'} />
          </>
        )}
      </div>

      <Foot>
        <button type="button" onClick={onClose} className="w-btn-primary px-6 py-3 text-sm">
          Close
        </button>
      </Foot>
    </Shell>
  );
};

const DetailField = ({ label, value }) => (
  <div className="rounded-2xl border border-cream-200 bg-white/70 px-4 py-3">
    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
    <p className="mt-1 text-sm text-ink-700">{value}</p>
  </div>
);

export default ViewDetailsModal;
