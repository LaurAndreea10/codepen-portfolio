import { motion } from 'framer-motion'
import { ArrowRight, FileText, Image as ImageIcon, Search, Github } from 'lucide-react'

const TOOL_ICONS = {
  brief: FileText,
  mood: ImageIcon,
  competitor: Search,
}

export default function Home({ t, onSelectTool }) {
  return (
    <>
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute left-2 top-20 hidden lg:flex flex-col gap-3 text-[10px] font-mono text-ink-400/30 dark:text-cream-100/20">
          <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
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
            className="text-display text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tight font-light"
          >
            {t.hero.title}<br />
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
            <a href="#tools" className="btn-primary group">
              <span>{t.hero.cta}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

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

      {/* Tools grid */}
      <section id="tools" className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-ink-400/10 dark:border-cream-100/10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16 flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">§ 01</span>
              <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
            </div>
            <h2 className="text-display text-4xl md:text-6xl font-light">
              {t.tools.heading}<span className="text-oxblood-500 dark:text-gold-400">.</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-ink-400/10 dark:bg-cream-100/10">
          {['brief', 'mood', 'competitor'].map((toolKey, i) => {
            const tool = t.tools[toolKey]
            const Icon = TOOL_ICONS[toolKey]
            return (
              <motion.button
                key={toolKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => onSelectTool(toolKey)}
                className="bg-cream-50 dark:bg-ink-700 p-8 md:p-10 text-left group hover:bg-cream-100 dark:hover:bg-ink-600 transition-colors min-h-[320px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">
                    №{String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon size={18} className="text-ink-400/60 dark:text-cream-100/50 group-hover:text-oxblood-500 dark:group-hover:text-gold-400 transition-colors" />
                </div>

                <h3 className="text-display text-2xl md:text-3xl font-light mb-3 leading-tight">
                  {tool.name}
                </h3>

                <p className="text-display italic text-base text-oxblood-500 dark:text-gold-400 mb-6">
                  {tool.tagline}
                </p>

                <p className="text-sm text-ink-400 dark:text-cream-100/70 leading-relaxed mb-8 flex-1">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-ink-400/10 dark:border-cream-100/10">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-ink-400/50 dark:text-cream-100/40">
                    {tool.api}
                  </span>
                  <span className="flex items-center gap-2 text-xs uppercase tracking-wider group-hover:gap-3 transition-all">
                    {tool.cta}
                    <ArrowRight size={12} />
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Case Study Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t border-ink-400/10 dark:border-cream-100/10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">{t.caseStudy.eyebrow}</span>
          </div>
          <h2 className="text-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] max-w-4xl">
            {t.caseStudy.heading}{' '}
            <span className="italic text-oxblood-500 dark:text-gold-400">{t.caseStudy.headingAccent}</span>
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink-400 dark:text-cream-100/70">
            {t.caseStudy.intro.split('*').map((part, i) =>
              i % 2 === 1 ? <em key={i} className="not-italic font-display italic text-oxblood-500 dark:text-gold-400">{part}</em> : <span key={i}>{part}</span>
            )}
          </p>
        </motion.div>

        {/* Problem statement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-12 gap-x-10 gap-y-6 mb-20 pb-16 border-b border-ink-400/10 dark:border-cream-100/10"
        >
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">↳</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">
                {t.caseStudy.problemLabel}
              </span>
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-display text-2xl md:text-3xl font-light leading-snug">
              {t.caseStudy.problem}
            </p>
          </div>
        </motion.div>

        {/* Challenges grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">§</span>
            <div className="w-12 h-px bg-oxblood-500 dark:bg-gold-400" />
            <h3 className="text-display text-2xl italic">{t.caseStudy.challengesLabel}</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-ink-400/10 dark:bg-cream-100/10">
            {[t.caseStudy.challenge1, t.caseStudy.challenge2, t.caseStudy.challenge3].map((ch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-cream-50 dark:bg-ink-700 p-8 md:p-10 flex flex-col"
              >
                <div className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400 mb-6">
                  № {ch.num}
                </div>
                <h4 className="text-display text-2xl md:text-3xl font-light leading-tight mb-6">
                  {ch.title}
                </h4>
                <p className="text-sm leading-relaxed text-ink-400 dark:text-cream-100/70 flex-1">
                  {ch.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-12 gap-x-10 gap-y-8 mb-20"
        >
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">§</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400/60 dark:text-cream-100/50 font-mono">
                {t.caseStudy.lessonsLabel}
              </span>
            </div>
          </div>
          <div className="md:col-span-9 space-y-6">
            {t.caseStudy.lessons.map((lesson, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-5 pb-6 border-b border-ink-400/10 dark:border-cream-100/10 last:border-0"
              >
                <span className="text-display italic text-3xl font-light text-oxblood-500 dark:text-gold-400 leading-none flex-shrink-0">
                  0{i + 1}
                </span>
                <p className="text-base md:text-lg leading-relaxed">
                  {lesson}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t-2 border-oxblood-500 dark:border-gold-400 pt-12"
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] font-mono text-oxblood-500 dark:text-gold-400">↳</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-oxblood-500 dark:text-gold-400 font-mono">
              {t.caseStudy.metricsLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-400/10 dark:bg-cream-100/10 mb-12">
            {t.caseStudy.metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-cream-50 dark:bg-ink-700 p-6 md:p-8"
              >
                <div className="text-display text-4xl md:text-5xl lg:text-6xl font-light leading-none mb-3 text-oxblood-500 dark:text-gold-400">
                  {metric.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400/60 dark:text-cream-100/50 font-mono">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>

          <a
            href="https://github.com/LaurAndreea10/brief-studio/blob/main/CASE_STUDY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-wider hover:gap-4 transition-all group"
          >
            <Github size={14} />
            <span>{t.caseStudy.readFull}</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>
    </>
  )
}
