import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, ExternalLink, Eye, EyeOff } from 'lucide-react'

export default function BriefForm({ t, onSubmit, isLoading, apiKey, setApiKey }) {
  const [step, setStep] = useState(1)
  const [showKey, setShowKey] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    industry: t.form.industry.options[0],
    audience: '',
    tone: [t.form.tone.options[0]],
    platforms: [t.form.platforms.options[0]],
    goal: t.form.goals.options[0],
    duration: t.form.duration.options[2],
    budget: '',
  })

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }))

  const toggleArray = (field, value) => {
    setFormData(p => {
      const arr = p[field]
      return {
        ...p,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      }
    })
  }

  const canProceed = () => {
    if (step === 1) return apiKey.startsWith('sk-ant-') && formData.businessName.trim() && formData.businessType.trim()
    if (step === 2) return formData.audience.trim() && formData.tone.length > 0
    if (step === 3) return formData.platforms.length > 0
    return false
  }

  const handleSubmit = () => {
    if (canProceed()) onSubmit(formData)
  }

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <section id="form-section" className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-400/60 dark:text-cream-100/50">
          <span>{t.form.step}</span>
          <span className="text-display text-2xl text-oxblood-500 dark:text-gold-400 italic">{step}</span>
          <span>/ {t.form.of}</span>
          <span>3</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`h-px transition-all duration-500 ${
                n <= step
                  ? 'w-12 bg-oxblood-500 dark:bg-gold-400'
                  : 'w-6 bg-ink-400/20 dark:bg-cream-100/15'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-display text-4xl md:text-5xl font-light mb-12">
              {t.form.title1}
              <span className="text-oxblood-500 dark:text-gold-400">.</span>
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
                  {t.form.apiKey.label}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t.form.apiKey.placeholder}
                    className="input-field font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(s => !s)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-ink-400/50 dark:text-cream-100/40 hover:text-ink-600 dark:hover:text-cream-100"
                    aria-label={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <p className="text-xs text-ink-400/60 dark:text-cream-100/40">
                    {t.form.apiKey.help}
                  </p>
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-oxblood-500 dark:text-gold-400 hover:underline inline-flex items-center gap-1"
                  >
                    {t.form.apiKey.getKey} <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
                  {t.form.businessName.label}
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                  placeholder={t.form.businessName.placeholder}
                  className="input-field text-display text-2xl"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
                  {t.form.businessType.label}
                </label>
                <textarea
                  value={formData.businessType}
                  onChange={(e) => update('businessType', e.target.value)}
                  placeholder={t.form.businessType.placeholder}
                  rows={2}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-4 font-mono">
                  {t.form.industry.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.form.industry.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update('industry', opt)}
                      className={`chip ${formData.industry === opt ? 'chip-active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-display text-4xl md:text-5xl font-light mb-12">
              {t.form.title2}
              <span className="text-oxblood-500 dark:text-gold-400">.</span>
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
                  {t.form.audience.label}
                </label>
                <textarea
                  value={formData.audience}
                  onChange={(e) => update('audience', e.target.value)}
                  placeholder={t.form.audience.placeholder}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-4 font-mono">
                  {t.form.tone.label} <span className="text-ink-400/40 dark:text-cream-100/30 normal-case tracking-normal">— multi-select</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.form.tone.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleArray('tone', opt)}
                      className={`chip ${formData.tone.includes(opt) ? 'chip-active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-display text-4xl md:text-5xl font-light mb-12">
              {t.form.title3}
              <span className="text-oxblood-500 dark:text-gold-400">.</span>
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-4 font-mono">
                  {t.form.platforms.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.form.platforms.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleArray('platforms', opt)}
                      className={`chip ${formData.platforms.includes(opt) ? 'chip-active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-4 font-mono">
                  {t.form.goals.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.form.goals.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update('goal', opt)}
                      className={`chip ${formData.goal === opt ? 'chip-active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-4 font-mono">
                  {t.form.duration.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.form.duration.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update('duration', opt)}
                      className={`chip ${formData.duration === opt ? 'chip-active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-ink-400/70 dark:text-cream-100/50 mb-3 font-mono">
                  {t.form.budget.label}
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  placeholder={t.form.budget.placeholder}
                  className="input-field"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={12} />
          {t.form.back}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(s => Math.min(3, s + 1))}
            disabled={!canProceed()}
            className="btn-primary"
          >
            {t.form.next}
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isLoading}
            className="btn-primary group"
          >
            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            {isLoading ? t.form.generating : t.form.generate}
          </button>
        )}
      </div>
    </section>
  )
}
