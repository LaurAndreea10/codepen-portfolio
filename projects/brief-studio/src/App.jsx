import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import BriefTool from './views/BriefTool'
import MoodBoardTool from './views/MoodBoardTool'
import MarketLensTool from './views/MarketLensTool'

import { translations } from './i18n'
import { useTheme, useLanguage } from './hooks'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [lang, toggleLang] = useLanguage()
  const [view, setView] = useState('home') // home | brief | mood | competitor

  const t = translations[lang]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const goHome = () => setView('home')

  return (
    <div className="grain min-h-screen flex flex-col">
      <Header
        t={t}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        currentView={view}
        onHomeClick={goHome}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'home' && <Home t={t} onSelectTool={setView} />}
            {view === 'brief' && <BriefTool t={t} lang={lang} onBack={goHome} />}
            {view === 'mood' && <MoodBoardTool t={t} lang={lang} onBack={goHome} />}
            {view === 'competitor' && <MarketLensTool t={t} lang={lang} onBack={goHome} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer t={t} />
    </div>
  )
}
