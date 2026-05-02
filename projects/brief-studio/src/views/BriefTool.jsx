import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, FileText, Pen, Calendar, Hash, Copy, Check, Download, RotateCcw } from 'lucide-react'
import { generateBrief } from '../tools/briefEngine'
import { briefToMarkdown, downloadFile, copyToClipboard } from '../export'
import LoadingState from '../components/LoadingState'

export default function BriefTool({ t, lang, onBack }) {
  const [view, setView] = useState('form') // form | loading | output
  const [progress, setProgress] = useState('analyzing')
  const [brief, setBrief] = useState(null)
  const [formData, setFormData] = useState({
    businessName: '',
    industry: t.industries[0],
    audience: '',
    tone: [t.tones[0]],
    platforms: [t.platforms[0]],
    goal: t.goals[0],
    duration: t.durations[2],
  })

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }))
  const toggleArray = (field, value) => {
    setFormData(p => {
      const arr = p[field]
      return { ...p, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const canSubmit = formData.businessName.trim() && formData.audience.trim() && formData.platforms.length > 0

  const handleGenerate = async () => {
    setView('loading')
    setProgress('analyzing')
    try {
      const result = await generateBrief({ formData, lang, onProgress: setProgress })
      setBrief(result)
      setView('output')
    } catch (err) {
      console.error(err)
      setView('form')
    }
  }

  const reset = () => {
    setBrief(null)
    setView('form')
  }

  if (view === 'loading') return <LoadingState t={t} progress={progress} />
  if (view === 'output' && brief) return <BriefOutput t={t} lang={lang} brief={brief} formData={formData} onReset={reset} onBack={onBack} />

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-12">
        <ArrowLeft size={12} />
        {t.brief.back}
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">№ 01</span>
          <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono">Tool</span>
        </div>
        <h1 className="text-display text-5xl md:text-7xl font-light leading-tight mb-4">
          {t.brief.title}{' '}
          <span className="italic text-oxblood-500 dark:text-gold-400">{t.brief.titleAccent}</span>
        </h1>
        <p className="text-lg text-ink-400 dark:text-cream-100/70 max-w-2xl">{t.brief.subtitle}</p>
      </motion.div>

      <div className="mt-16 space-y-10">
        <Field label={t.brief.form.businessName.label}>
          <input type="text" value={formData.businessName} onChange={e => update('businessName', e.target.value)} placeholder={t.brief.form.businessName.placeholder} className="input-field text-display text-2xl" />
        </Field>

        <Field label={t.brief.form.industry.label}>
          <Chips options={t.industries} value={formData.industry} onChange={v => update('industry', v)} />
        </Field>

        <Field label={t.brief.form.audience.label}>
          <textarea value={formData.audience} onChange={e => update('audience', e.target.value)} placeholder={t.brief.form.audience.placeholder} rows={2} className="input-field resize-none" />
        </Field>

        <Field label={t.brief.form.tone.label}>
          <Chips options={t.tones} value={formData.tone} onChange={v => toggleArray('tone', v)} multi />
        </Field>

        <Field label={t.brief.form.platforms.label}>
          <Chips options={t.platforms} value={formData.platforms} onChange={v => toggleArray('platforms', v)} multi />
        </Field>

        <Field label={t.brief.form.goal.label}>
          <Chips options={t.goals} value={formData.goal} onChange={v => update('goal', v)} />
        </Field>

        <Field label={t.brief.form.duration.label}>
          <Chips options={t.durations} value={formData.duration} onChange={v => update('duration', v)} />
        </Field>
      </div>

      <div className="mt-16">
        <button onClick={handleGenerate} disabled={!canSubmit} className="btn-primary group">
          <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
          {t.brief.form.generate}
        </button>
      </div>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
        {label}
      </label>
      {children}
    </div>
  )
}

function Chips({ options, value, onChange, multi }) {
  const isActive = (opt) => multi ? value.includes(opt) : value === opt
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className={`chip ${isActive(opt) ? 'chip-active' : ''}`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

// === Brief Output ===
function BriefOutput({ t, lang, brief, formData, onReset, onBack }) {
  const [activeTab, setActiveTab] = useState('brief')
  const [copiedId, setCopiedId] = useState(null)

  const tabs = [
    { id: 'brief', label: t.brief.output.objective.split(' ')[0] === 'Objective' ? 'Brief' : 'Brief', icon: FileText },
    { id: 'copy', label: t.brief.output.copy, icon: Pen },
    { id: 'calendar', label: t.brief.output.calendar, icon: Calendar },
    { id: 'hashtags', label: t.brief.output.hashtags, icon: Hash },
  ]

  const handleCopy = async (text, id) => {
    if (await copyToClipboard(text)) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    }
  }

  const handleExport = () => {
    const md = briefToMarkdown(brief, formData, lang)
    const slug = formData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) || 'brief'
    downloadFile(md, `${slug}-brief.md`)
  }

  const cb = brief.campaignBrief
  const cv = brief.copyVariants
  const ec = brief.editorialCalendar
  const hb = brief.hashtagBundle

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <button onClick={onBack} className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 hover:text-oxblood-500 dark:hover:text-gold-400 transition-colors mb-8">
        <ArrowLeft size={12} />
        {t.brief.back}
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border-t-2 border-oxblood-500 dark:border-gold-400 pt-8 mb-12">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono mb-3">
              {formData.businessName} · {formData.industry}
            </div>
            <h2 className="text-display text-4xl md:text-6xl font-light leading-tight max-w-3xl">{cb.title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleExport} className="btn-secondary"><Download size={12} />{t.brief.output.export}</button>
            <button onClick={onReset} className="btn-secondary"><RotateCcw size={12} />{t.brief.output.new}</button>
          </div>
        </div>
      </motion.div>

      <div className="border-b border-ink-400/20 dark:border-cream-100/15 mb-12">
        <div className="flex flex-wrap -mb-px">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-2 px-5 py-4 text-xs uppercase tracking-wider transition-colors ${isActive ? 'text-oxblood-500 dark:text-gold-400' : 'text-ink-400/60 dark:text-cream-100/50 hover:text-ink-600 dark:hover:text-cream-100'}`}>
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && <motion.div layoutId="briefActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-oxblood-500 dark:bg-gold-400" />}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {activeTab === 'brief' && (
            <div className="grid md:grid-cols-12 gap-x-10 gap-y-12">
              <Block label={t.brief.output.objective} num="01" className="md:col-span-7">
                <p className="text-display text-2xl md:text-3xl font-light leading-snug">{cb.objective}</p>
              </Block>
              <Block label={t.brief.output.audience} num="02" className="md:col-span-5">
                <p className="text-base leading-relaxed text-ink-400 dark:text-cream-100/80 italic">"{cb.audienceInsight}"</p>
              </Block>
              <Block label={t.brief.output.keyMessage} num="03" className="md:col-span-12">
                <p className="text-display text-3xl md:text-5xl font-light leading-tight border-l-2 border-oxblood-500 dark:border-gold-400 pl-6 italic">"{cb.keyMessage}"</p>
              </Block>
              <Block label={t.brief.output.valueProps} num="04" className="md:col-span-6">
                <ul className="space-y-3">
                  {cb.valueProps.map((v, i) => (
                    <li key={i} className="flex gap-3 text-base">
                      <span className="text-oxblood-500 dark:text-gold-400 font-mono text-xs mt-1.5">0{i + 1}</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </Block>
              <Block label={t.brief.output.kpis} num="05" className="md:col-span-6">
                <ul className="space-y-3">
                  {cb.kpis.map((k, i) => (
                    <li key={i} className="flex gap-3 text-base">
                      <span className="text-oxblood-500 dark:text-gold-400">→</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </Block>
              <Block label={t.brief.output.risks} num="06" className="md:col-span-12">
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cb.risks.map((r, i) => (
                    <li key={i} className="border border-ink-400/15 dark:border-cream-100/10 p-4 text-sm leading-relaxed bg-ink-400/[0.02] dark:bg-cream-100/[0.02]">{r}</li>
                  ))}
                </ul>
              </Block>
              {brief.industryContext && (
                <Block label={lang === 'ro' ? 'Context industrie (Wikipedia)' : 'Industry context (Wikipedia)'} num="07" className="md:col-span-12">
                  <div className="bg-ink-400/[0.03] dark:bg-cream-100/[0.03] p-6 border-l-2 border-ink-400/20 dark:border-cream-100/15">
                    <p className="text-sm leading-relaxed text-ink-400 dark:text-cream-100/70 mb-3">{brief.industryContext.extract}</p>
                    {brief.industryContext.url && (
                      <a href={brief.industryContext.url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider text-oxblood-500 dark:text-gold-400 hover:underline">
                        Wikipedia →
                      </a>
                    )}
                  </div>
                </Block>
              )}
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {cv.map((v, i) => {
                const fullText = `${v.headline}\n\n${v.body}\n\n→ ${v.cta}`
                const id = `copy-${i}`
                return (
                  <motion.article key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative border border-ink-400/15 dark:border-cream-100/10 p-6 md:p-8 bg-cream-100/40 dark:bg-ink-500/40 group hover:border-oxblood-500/40 dark:hover:border-gold-400/40 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-oxblood-500 dark:text-gold-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <button onClick={() => handleCopy(fullText, id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-ink-400/5 dark:hover:bg-cream-100/5">
                        {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-2">{v.label}</div>
                    <h3 className="text-display text-2xl md:text-3xl font-light leading-tight mb-6">{v.headline}</h3>
                    <p className="text-sm leading-relaxed text-ink-400 dark:text-cream-100/70 mb-8">{v.body}</p>
                    <div className="pt-6 border-t border-ink-400/10 dark:border-cream-100/10">
                      <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-2">CTA</div>
                      <div className="font-mono text-sm">→ {v.cta}</div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-3">
              {ec.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="grid grid-cols-12 gap-4 md:gap-6 py-6 border-b border-ink-400/10 dark:border-cream-100/10 hover:bg-ink-400/[0.02] dark:hover:bg-cream-100/[0.02] transition-colors px-2 -mx-2">
                  <div className="col-span-12 md:col-span-1">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-1">Day</div>
                    <div className="text-display text-3xl md:text-4xl font-light text-oxblood-500 dark:text-gold-400">{String(d.day).padStart(2, '0')}</div>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-1">Platform</div>
                    <div className="text-sm font-medium">{d.platform}</div>
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-1">Format</div>
                    <div className="text-sm font-mono">{d.format}</div>
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400/50 dark:text-cream-100/40 mb-1">{d.theme}</div>
                    <div className="text-sm leading-relaxed text-ink-400 dark:text-cream-100/80">{d.content}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {[
                { key: 'primary', label: lang === 'ro' ? 'Principale' : 'Primary', tags: hb.primary },
                { key: 'niche', label: 'Niche', tags: hb.niche },
                { key: 'broad', label: lang === 'ro' ? 'Reach larg' : 'Broad reach', tags: hb.broad },
                { key: 'trending', label: 'Trending', tags: hb.trending },
              ].map((group, gi) => {
                const tagsText = (group.tags || []).map(tg => '#' + tg).join(' ')
                return (
                  <motion.div key={group.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: gi * 0.1 }} className="group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-oxblood-500 dark:text-gold-400 font-mono">{String(gi + 1).padStart(2, '0')}</span>
                        <h3 className="text-display text-xl italic">{group.label}</h3>
                      </div>
                      <button onClick={() => handleCopy(tagsText, group.key)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5">
                        {copiedId === group.key ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(group.tags || []).map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 text-sm bg-cream-100 dark:bg-ink-500 border border-ink-400/10 dark:border-cream-100/10 font-mono">#{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function Block({ label, num, children, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">{num}</span>
        <div className="h-px flex-1 bg-ink-400/15 dark:bg-cream-100/10" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">{label}</span>
      </div>
      {children}
    </div>
  )
}
