import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setStoredValue = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) { console.error(err) }
  }, [key, value])

  return [value, setStoredValue]
}

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('brief-studio-theme', 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return [theme, () => setTheme(t => t === 'light' ? 'dark' : 'light')]
}

export const useLanguage = () => {
  const [lang, setLang] = useLocalStorage('brief-studio-lang', 'ro')
  return [lang, () => setLang(l => l === 'ro' ? 'en' : 'ro')]
}
