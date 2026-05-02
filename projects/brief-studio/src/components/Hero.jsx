import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export default function Hero({ t, onStart }) {
  return (
    <section className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-24 md:pt-28 md:pb-36">
      {/* Decorative line numbers (editorial detail) */}
      <div className="absolute left-2 top-20 hidden lg:flex flex-col gap-3 text-[10px] font-mono text-ink-400/30 dark:text-cream-100/20">
        <span>01</span>
        <span>02</span>
        <span>03</span>
        <span>04</span>
        <span>05</span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono">
            {t.hero.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight font-light"
        >
          {t.hero.title}
          <br />
          <span className="italic text-oxblood-500 dark:text-gold-400 font-normal">
            {t.hero.titleAccent}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-ink-400 dark:text-cream-100/70"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-8"
        >
          <button onClick={onStart} className="btn-primary group">
            <span>{t.hero.cta}</span>
            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-6 md:gap-10">
            {t.hero.stats.map((stat, i) => (
              <div key={i} className="border-l border-ink-400/20 dark:border-cream-100/15 pl-4">
                <div className="text-display text-2xl md:text-3xl font-light">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Editorial decorative element */}
      <div className="absolute right-6 md:right-10 top-32 hidden md:block">
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[10px] font-mono text-ink-400/40 dark:text-cream-100/30 uppercase tracking-widest"
        >
          <div className="border border-current p-3 inline-block">
            <div>Issue №01</div>
            <div className="mt-1">May / 2026</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
