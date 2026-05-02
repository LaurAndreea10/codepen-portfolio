import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, RotateCw } from 'lucide-react'

export default function HistoryPanel({ t, isOpen, onClose, history, onRestore, onRemove, onClearAll, lang }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-700/40 backdrop-blur-sm z-50"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream-50 dark:bg-ink-700 z-50 shadow-2xl flex flex-col border-l border-ink-400/10 dark:border-cream-100/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-ink-400/10 dark:border-cream-100/10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono mb-1">
                  Archive
                </div>
                <h2 className="text-display text-2xl">{t.history.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-ink-400/5 dark:hover:bg-cream-100/5 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {history.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-400/60 dark:text-cream-100/50">
                  {t.history.empty}
                </div>
              ) : (
                <ul className="divide-y divide-ink-400/10 dark:divide-cream-100/10">
                  {history.map((item) => {
                    const date = new Date(item.timestamp)
                    const dateStr = date.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    return (
                      <li key={item.id} className="p-5 hover:bg-ink-400/[0.02] dark:hover:bg-cream-100/[0.02] transition-colors group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-1.5 font-mono">
                              {dateStr}
                            </div>
                            <h3 className="text-display text-lg leading-tight mb-1 truncate">
                              {item.brief?.campaignBrief?.title || item.formData?.businessName}
                            </h3>
                            <p className="text-xs text-ink-400/60 dark:text-cream-100/50 truncate">
                              {item.formData?.businessType}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onRestore(item)}
                              className="p-2 hover:bg-ink-400/5 dark:hover:bg-cream-100/5 transition-colors"
                              aria-label="Restore"
                              title={t.history.restore}
                            >
                              <RotateCw size={12} />
                            </button>
                            <button
                              onClick={() => onRemove(item.id)}
                              className="p-2 hover:bg-oxblood-500/10 dark:hover:bg-gold-400/10 text-oxblood-500 dark:text-gold-400 transition-colors"
                              aria-label="Delete"
                              title={t.history.delete}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {history.length > 0 && (
              <div className="p-6 border-t border-ink-400/10 dark:border-cream-100/10">
                <button
                  onClick={() => {
                    if (window.confirm(t.history.confirmClear)) onClearAll()
                  }}
                  className="text-xs uppercase tracking-wider text-oxblood-500 dark:text-gold-400 hover:underline"
                >
                  {t.history.clearAll}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
