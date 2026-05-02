import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Download, RotateCcw, RefreshCw, ExternalLink } from 'lucide-react'
import { generateMoodBoard } from '../tools/moodEngine'
import { downloadPaletteSVG } from '../export'
import LoadingState from '../components/LoadingState'

export default function MoodBoardTool({ t, lang, onBack }) {
  const [view, setView] = useState('form')
  const [progress, setProgress] = useState('analyzing')
  const [board, setBoard] = useState(null)
  const [formData, setFormData] = useState({
    industry: t.industries[0],
    aesthetic: t.aesthetics[0],
    keywords: '',
  })

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }))

  const handleGenerate = async () => {
    setView('loading')
    setProgress('analyzing')
    try {
      const result = await generateMoodBoard({ formData, onProgress: setProgress })
      setBoard(result)
      setView('output')
    } catch (err) {
      console.error(err)
      setView('form')
    }
  }

  const handleRegenerate = () => handleGenerate()
  const reset = () => { setBoard(null); setView('form') }

  if (view === 'loading') return <LoadingState t={t} progress={progress} />

  if (view === 'output' && board) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-8">
          <ArrowLeft size={12} />{t.mood.back}
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border-t-2 border-oxblood-500 dark:border-gold-400 pt-8 mb-12">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono mb-3">
                {board.industry} · {board.aesthetic}
              </div>
              <h2 className="text-display text-4xl md:text-6xl font-light leading-tight">
                Mood <span className="italic text-oxblood-500 dark:text-gold-400">Board</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => downloadPaletteSVG(board.palette, `palette-${board.aesthetic.toLowerCase()}.svg`)} className="btn-secondary"><Download size={12} />{t.mood.output.download}</button>
              <button onClick={handleRegenerate} className="btn-secondary"><RefreshCw size={12} />{t.mood.output.regenerate}</button>
              <button onClick={reset} className="btn-secondary"><RotateCcw size={12} />{t.mood.output.new}</button>
            </div>
          </div>
        </motion.div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-16">
          {board.images.map((img, i) => (
            <motion.figure
              key={img.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative group overflow-hidden bg-ink-400/5 dark:bg-cream-100/5 ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
              }`}
            >
              <img
                src={img.url}
                alt={`Mood ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-700/80 to-transparent text-cream-50 p-3 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <span>{t.mood.output.photographedBy} {img.author}</span>
                  <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400" aria-label="View on Unsplash">
                    <ExternalLink size={10} />
                  </a>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Palette */}
        <div className="border-t border-ink-400/10 dark:border-cream-100/10 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">§ palette</span>
            <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
            <h3 className="text-display text-2xl italic">{t.mood.output.palette}</h3>
          </div>

          <div className="grid grid-cols-5 gap-px bg-ink-400/10 dark:bg-cream-100/10">
            {board.palette.map((color, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="aspect-[3/4] flex flex-col justify-end p-3 md:p-5 relative group cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => navigator.clipboard?.writeText(color.hex)}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: getContrast(color.hex) }}>
                  {color.name}
                </div>
                <div className="font-mono text-xs md:text-sm" style={{ color: getContrast(color.hex) }}>
                  {color.hex}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // FORM
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-12">
        <ArrowLeft size={12} />{t.mood.back}
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">№ 02</span>
          <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono">Tool</span>
        </div>
        <h1 className="text-display text-5xl md:text-7xl font-light leading-tight mb-4">
          {t.mood.title}{' '}<span className="italic text-oxblood-500 dark:text-gold-400">{t.mood.titleAccent}</span>
        </h1>
        <p className="text-lg text-ink-400 dark:text-cream-100/70 max-w-2xl">{t.mood.subtitle}</p>
      </motion.div>

      <div className="mt-16 space-y-10">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">{t.mood.form.industry.label}</label>
          <div className="flex flex-wrap gap-2">
            {t.industries.map(opt => (
              <button key={opt} type="button" onClick={() => update('industry', opt)} className={`chip ${formData.industry === opt ? 'chip-active' : ''}`}>{opt}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">{t.mood.form.aesthetic.label}</label>
          <div className="flex flex-wrap gap-2">
            {t.aesthetics.map(opt => (
              <button key={opt} type="button" onClick={() => update('aesthetic', opt)} className={`chip ${formData.aesthetic === opt ? 'chip-active' : ''}`}>{opt}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">{t.mood.form.keywords.label}</label>
          <input type="text" value={formData.keywords} onChange={e => update('keywords', e.target.value)} placeholder={t.mood.form.keywords.placeholder} className="input-field" />
        </div>
      </div>

      <div className="mt-16">
        <button onClick={handleGenerate} className="btn-primary group">
          <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
          {t.mood.form.generate}
        </button>
      </div>
    </section>
  )
}

function getContrast(hex) {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = rgb & 0xff
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}
