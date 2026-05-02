import { motion } from 'framer-motion'

export default function LoadingState({ t, progress, messages }) {
  const stages = messages || ['analyzing', 'composing', 'finalizing']
  const currentIndex = stages.indexOf(progress)

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-32 min-h-[50vh] flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="relative w-20 h-20 mb-12"
      >
        <div className="absolute inset-0 border-2 border-oxblood-500/20 dark:border-gold-400/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-oxblood-500 dark:border-t-gold-400 rounded-full" />
      </motion.div>

      <div className="space-y-3 text-center max-w-md">
        {stages.map((msg, i) => (
          <motion.div
            key={msg}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: i <= currentIndex ? 1 : 0.2 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center justify-center gap-3 text-sm ${
              i === currentIndex ? 'text-display italic text-xl text-oxblood-500 dark:text-gold-400' : 'text-ink-400/50 dark:text-cream-100/40'
            }`}
          >
            {i < currentIndex && <span className="text-oxblood-500 dark:text-gold-400">✓</span>}
            <span>{t.loading[msg]}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
