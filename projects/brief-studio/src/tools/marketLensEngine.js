// Market Lens engine
// Wikipedia REST API + REST Countries API
// Both fully public, no key required

const WIKI_BASE_EN = 'https://en.wikipedia.org/api/rest_v1'
const WIKI_BASE_RO = 'https://ro.wikipedia.org/api/rest_v1'
const REST_COUNTRIES = 'https://restcountries.com/v3.1'

// Search Wikipedia for a topic
const searchWikipedia = async (query, lang = 'en') => {
  const base = lang === 'ro' ? WIKI_BASE_RO : WIKI_BASE_EN
  try {
    const res = await fetch(`${base}/page/summary/${encodeURIComponent(query)}`)
    if (!res.ok) {
      // Try search API as fallback
      const searchUrl = lang === 'ro'
        ? `https://ro.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`
        : `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`
      const searchRes = await fetch(searchUrl)
      if (!searchRes.ok) return null
      const searchData = await searchRes.json()
      const firstResult = searchData[1]?.[0]
      if (!firstResult) return null

      // Now fetch summary for that result
      const summaryRes = await fetch(`${base}/page/summary/${encodeURIComponent(firstResult)}`)
      if (!summaryRes.ok) return null
      return await summaryRes.json()
    }
    return await res.json()
  } catch {
    return null
  }
}

// Get related topics via Wikipedia "related" API
const getRelated = async (title, lang = 'en') => {
  const base = lang === 'ro' ? WIKI_BASE_RO : WIKI_BASE_EN
  try {
    const res = await fetch(`${base}/page/related/${encodeURIComponent(title)}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.pages || []).slice(0, 6).map(p => ({
      title: p.titles?.normalized || p.title,
      extract: p.extract,
      thumbnail: p.thumbnail?.source,
      url: `https://${lang === 'ro' ? 'ro' : 'en'}.wikipedia.org/wiki/${encodeURIComponent(p.titles?.canonical || p.title)}`,
    }))
  } catch {
    return []
  }
}

// Get country data from REST Countries
const getCountryData = async (codeOrName) => {
  if (!codeOrName) return null
  try {
    // Try by code first (2 or 3 letters)
    const isCode = codeOrName.length <= 3
    const endpoint = isCode
      ? `${REST_COUNTRIES}/alpha/${codeOrName.toUpperCase()}`
      : `${REST_COUNTRIES}/name/${encodeURIComponent(codeOrName)}?fullText=false`
    const res = await fetch(`${endpoint}?fields=name,capital,population,region,subregion,languages,currencies,flags,cca2`)
    if (!res.ok) return null
    const data = await res.json()
    const country = Array.isArray(data) ? data[0] : data
    if (!country) return null

    return {
      name: country.name?.common || codeOrName,
      capital: country.capital?.[0] || '—',
      population: country.population,
      region: country.region,
      subregion: country.subregion,
      languages: country.languages ? Object.values(country.languages).slice(0, 3).join(', ') : '—',
      currencies: country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ') : '—',
      flag: country.flags?.svg || country.flags?.png,
      code: country.cca2,
    }
  } catch {
    return null
  }
}

export const fetchMarketLens = async ({ brand, country, lang, onProgress }) => {
  if (onProgress) onProgress('analyzing')

  const promises = [
    searchWikipedia(brand, lang),
    country ? getCountryData(country) : Promise.resolve(null),
  ]

  const [wikiData, countryData] = await Promise.all(promises)

  if (onProgress) onProgress('composing')

  let related = []
  if (wikiData?.title) {
    related = await getRelated(wikiData.title, lang)
  }

  if (onProgress) onProgress('finalizing')

  if (!wikiData) {
    throw new Error('NOT_FOUND')
  }

  return {
    brand: {
      title: wikiData.title,
      description: wikiData.description,
      extract: wikiData.extract,
      thumbnail: wikiData.thumbnail?.source || wikiData.originalimage?.source,
      url: wikiData.content_urls?.desktop?.page,
    },
    related,
    country: countryData,
  }
}
