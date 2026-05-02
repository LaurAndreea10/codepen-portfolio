import { Github } from 'lucide-react'

export default function Footer({ t }) {
  return (
    <footer className="border-t border-ink-400/10 dark:border-cream-100/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-end">
          <div>
            <div className="text-display text-3xl italic font-light mb-2">Brief Studio</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-ink-400/60 dark:text-cream-100/40 mb-3">
              Vol. 01 · {t.footer.year}
            </div>
            <div className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400 uppercase tracking-wider">
              {t.footer.noCost}
            </div>
          </div>

          <div className="text-sm text-ink-400 dark:text-cream-100/70 leading-relaxed">
            {t.footer.built}{' '}
            <a href="https://github.com/LaurAndreea10" target="_blank" rel="noopener noreferrer" className="text-oxblood-500 dark:text-gold-400 hover:underline">
              Laura Andreea
            </a>{' '}{t.footer.with}{' '}
            <span className="text-oxblood-500 dark:text-gold-400">React</span>{' '}{t.footer.and} Wikipedia + Unsplash + REST Countries.
          </div>

          <div className="flex md:justify-end gap-4">
            <a
              href="https://github.com/LaurAndreea10/brief-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={12} />
              {t.footer.open}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
