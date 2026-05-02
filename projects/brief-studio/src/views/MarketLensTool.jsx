import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ExternalLink, Globe, Users, Coins, MapPin, Languages } from 'lucide-react'
import { fetchMarketLens } from '../tools/marketLensEngine'
import LoadingState from '../components/LoadingState'

export default function MarketLensTool({ t, lang, onBack }) {
  const [view, setView] = useState('form')
  const [progress, setProgress] = useState('analyzing')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    brand: '',
    country: '',
  })

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }))

  const handleSearch = async () => {
    if (!formData.brand.trim()) return
    setView('loading')
    setProgress('analyzing')
    setError(null)
    try {
      const result = await fetchMarketLens({ brand: formData.brand, country: formData.country, lang, onProgress: setProgress })
      setData(result)
      setView('output')
    } catch (err) {
      setError(err.message === 'NOT_FOUND' ? t.competitor.output.notFound : t.errors.generic)
      setView('form')
    }
  }

  const reset = () => { setData(null); setView('form'); setError(null) }

  if (view === 'loading') return <LoadingState t={t} progress={progress} />

  if (view === 'output' && data) {
    const { brand, related, country } = data
    return (
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
        <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-8">
          <ArrowLeft size={12} />{t.competitor.back}
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border-t-2 border-oxblood-500 dark:border-gold-400 pt-8 mb-12">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono mb-3">
                Market intelligence · {brand.title}
              </div>
              <h2 className="text-display text-4xl md:text-6xl font-light leading-tight">
                {brand.title}
              </h2>
              {brand.description && (
                <p className="text-display italic text-lg text-oxblood-500 dark:text-gold-400 mt-3">{brand.description}</p>
              )}
            </div>
            <button onClick={reset} className="btn-secondary">
              <Search size={12} />{lang === 'ro' ? 'Caută alt termen' : 'Search again'}
            </button>
          </div>
        </motion.div>

        {/* Brand description */}
        <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 mb-16">
          <div className={brand.thumbnail ? 'md:col-span-8' : 'md:col-span-12'}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">01</span>
              <div className="w-12 h-px bg-ink-400/15 dark:bg-cream-100/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">{t.competitor.output.about}</span>
            </div>
            <p className="text-display text-xl md:text-2xl font-light leading-relaxed">
              {brand.extract}
            </p>
            {brand.url && (
              <a href={brand.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-xs uppercase tracking-wider text-oxblood-500 dark:text-gold-400 hover:underline">
                {t.competitor.output.readMore} <ExternalLink size={12} />
              </a>
            )}
          </div>
          {brand.thumbnail && (
            <div className="md:col-span-4">
              <img src={brand.thumbnail} alt={brand.title} className="w-full aspect-square object-cover bg-ink-400/5 dark:bg-cream-100/5" />
            </div>
          )}
        </div>

        {/* Country data */}
        {country && (
          <div className="mb-16 border-t border-ink-400/10 dark:border-cream-100/10 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">02</span>
              <div className="w-12 h-px bg-ink-400/15 dark:bg-cream-100/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">{t.competitor.output.market}</span>
            </div>

            <div className="grid md:grid-cols-12 gap-6 md:gap-10">
              <div className="md:col-span-3">
                <div className="aspect-[3/2] bg-ink-400/5 dark:bg-cream-100/5 overflow-hidden flex items-center justify-center">
                  {country.flag && <img src={country.flag} alt={country.name} className="w-full h-full object-cover" />}
                </div>
                <h3 className="text-display text-2xl mt-4">{country.name}</h3>
                <div className="text-xs uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 font-mono mt-1">{country.code}</div>
              </div>

              <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-6">
                <Stat icon={Users} label={t.competitor.output.population} value={country.population?.toLocaleString(lang === 'ro' ? 'ro-RO' : 'en-US') || '—'} />
                <Stat icon={MapPin} label={t.competitor.output.capital} value={country.capital} />
                <Stat icon={Coins} label={t.competitor.output.currency} value={country.currencies} />
                <Stat icon={Languages} label={t.competitor.output.languages} value={country.languages} />
                <Stat icon={Globe} label={t.competitor.output.region} value={`${country.region}${country.subregion ? ` · ${country.subregion}` : ''}`} />
              </div>
            </div>
          </div>
        )}

        {/* Related topics */}
        {related && related.length > 0 && (
          <div className="border-t border-ink-400/10 dark:border-cream-100/10 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">{country ? '03' : '02'}</span>
              <div className="w-12 h-px bg-ink-400/15 dark:bg-cream-100/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">{t.competitor.output.related}</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-400/10 dark:bg-cream-100/10">
              {related.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-cream-50 dark:bg-ink-700 p-6 hover:bg-cream-100 dark:hover:bg-ink-600 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover bg-ink-400/5 dark:bg-cream-100/5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-display text-lg leading-tight mb-2 group-hover:text-oxblood-500 dark:group-hover:text-gold-400 transition-colors">
                        {item.title}
                      </h4>
                      {item.extract && (
                        <p className="text-xs text-ink-400/70 dark:text-cream-100/60 leading-relaxed line-clamp-3">
                          {item.extract}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-12">
        <ArrowLeft size={12} />{t.competitor.back}
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">№ 03</span>
          <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono">Tool</span>
        </div>
        <h1 className="text-display text-5xl md:text-7xl font-light leading-tight mb-4">
          {t.competitor.title}{' '}<span className="italic text-oxblood-500 dark:text-gold-400">{t.competitor.titleAccent}</span>
        </h1>
        <p className="text-lg text-ink-400 dark:text-cream-100/70 max-w-2xl">{t.competitor.subtitle}</p>
      </motion.div>

      <div className="mt-16 space-y-10">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">{t.competitor.form.brand.label}</label>
          <input type="text" value={formData.brand} onChange={e => update('brand', e.target.value)} placeholder={t.competitor.form.brand.placeholder} className="input-field text-display text-2xl" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">{t.competitor.form.country.label}</label>
          <input type="text" value={formData.country} onChange={e => update('country', e.target.value.toUpperCase())} placeholder={t.competitor.form.country.placeholder} maxLength={3} className="input-field font-mono uppercase max-w-xs" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        </div>

        {error && (
          <div className="text-sm text-oxblood-500 dark:text-gold-400 border-l-2 border-oxblood-500 dark:border-gold-400 pl-4 py-2">
            {error}
          </div>
        )}
      </div>

      <div className="mt-16">
        <button onClick={handleSearch} disabled={!formData.brand.trim()} className="btn-primary">
          <Search size={14} />
          {t.competitor.form.search}
        </button>
      </div>
    </section>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-ink-400/60 dark:text-cream-100/50">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-wider font-mono">{label}</span>
      </div>
      <div className="text-display text-xl md:text-2xl font-light leading-tight">{value}</div>
    </div>
  )
}
