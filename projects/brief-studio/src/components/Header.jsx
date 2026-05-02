import { Sun, Moon, Globe, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header({ t, theme, toggleTheme, lang, toggleLang, currentView, onHomeClick }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 backdrop-blur-md bg-cream-50/70 dark:bg-ink-700/70 border-b border-ink-400/10 dark:border-cream-100/10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <button onClick={onHomeClick} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-oxblood-500 dark:bg-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-display text-cream-50 dark:text-ink-700 text-2xl italic font-light leading-none -mt-0.5">B</span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-display text-lg leading-none">Brief Studio</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/40 mt-1">
              {t.nav.tagline}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {currentView !== 'home' && (
            <button
              onClick={onHomeClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider hover:bg-ink-400/5 dark:hover:bg-cream-100/5 transition-colors"
            >
              <Home size={14} />
              <span className="hidden sm:inline">{t.nav.home}</span>
            </button>
          )}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider hover:bg-ink-400/5 dark:hover:bg-cream-100/5 transition-colors"
          >
            <Globe size={14} />
            <span className="font-mono">{lang.toUpperCase()}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-ink-400/5 dark:hover:bg-cream-100/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
