import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx } from '../utils/format';

const Pagination = ({ page = 1, totalPages = 1, total = 0, limit = 4, onChange }) => {
  if (!totalPages || totalPages < 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);

  const windowSize = 5;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  const from = total === 0 ? 0 : (current - 1) * limit + 1;
  const to = Math.min(current * limit, total);

  const go = (p) => {
    if (p < 1 || p > totalPages || p === current) return;
    onChange?.(p);
  };

  const btn =
    'grid h-9 min-w-9 place-items-center rounded-xl px-2 text-sm font-bold transition disabled:pointer-events-none disabled:opacity-40';

  return (
    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-[12.5px] text-ink-500">
        Showing <span className="font-bold text-ink-800">{from}</span>–
        <span className="font-bold text-ink-800">{to}</span> of{' '}
        <span className="font-bold text-ink-800">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => go(current - 1)}
          disabled={current <= 1}
          aria-label="Previous page"
          className={cx(btn, 'border border-cream-300 bg-white text-ink-600 hover:bg-cream-100')}
        >
          <ChevronLeft size={16} />
        </button>

        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(1)}
              className={cx(btn, 'border border-cream-300 bg-white text-ink-600 hover:bg-cream-100')}
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-ink-400">…</span>}
          </>
        )}

        {pages.map((p) => (
          <motion.button
            key={p}
            type="button"
            onClick={() => go(p)}
            whileTap={{ scale: 0.94 }}
            aria-current={p === current ? 'page' : undefined}
            className={cx(
              btn,
              p === current
                ? 'bg-gradient-to-r from-brand-coral to-brand-tangerine text-white shadow-warm-glow'
                : 'border border-cream-300 bg-white text-ink-600 hover:bg-cream-100'
            )}
          >
            {p}
          </motion.button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
            <button
              type="button"
              onClick={() => go(totalPages)}
              className={cx(btn, 'border border-cream-300 bg-white text-ink-600 hover:bg-cream-100')}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => go(current + 1)}
          disabled={current >= totalPages}
          aria-label="Next page"
          className={cx(btn, 'border border-cream-300 bg-white text-ink-600 hover:bg-cream-100')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;