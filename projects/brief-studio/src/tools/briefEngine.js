// Brief generator engine
// Uses intelligent templates + Wikipedia API for industry context
// Wikipedia REST API: https://en.wikipedia.org/api/rest_v1/

const WIKI_BASE = 'https://en.wikipedia.org/api/rest_v1'
const WIKI_BASE_RO = 'https://ro.wikipedia.org/api/rest_v1'

// Industry → Wikipedia search topic mapping
const INDUSTRY_TOPICS = {
  'F&B': 'Food and beverage industry',
  'Beauty & Wellness': 'Cosmetics industry',
  'Fashion': 'Fashion industry',
  'Tech & SaaS': 'Software as a service',
  'Educație': 'Education industry',
  'Education': 'Education industry',
  'E-commerce': 'E-commerce',
  'Servicii': 'Service industry',
  'Services': 'Service industry',
  'Altele': 'Marketing',
  'Other': 'Marketing',
}

// Fetch Wikipedia summary for industry context
export const fetchIndustryContext = async (industry, lang = 'en') => {
  const topic = INDUSTRY_TOPICS[industry] || 'Marketing'
  const base = lang === 'ro' ? WIKI_BASE_RO : WIKI_BASE
  try {
    const res = await fetch(`${base}/page/summary/${encodeURIComponent(topic)}`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page,
    }
  } catch {
    return null
  }
}

// === TEMPLATES ===
// Industry-specific value props library (built from real marketing knowledge)
const VALUE_PROPS = {
  ro: {
    'F&B': [
      'Ingrediente atent selectate, cu povești de proveniență',
      'Experiență senzorială completă — nu doar produs',
      'Comunitate construită în jurul ritualurilor zilnice',
      'Transparență completă în procesul de producție',
      'Inovație în meniu fără sacrificarea autenticității',
    ],
    'Beauty & Wellness': [
      'Formule clean, fără compromisuri pe ingrediente',
      'Rezultate vizibile susținute de testimoniale reale',
      'Educație inclusă — clienții învață, nu doar cumpără',
      'Sustenabilitate vizibilă în ambalaj și proces',
      'Personalizare adevărată, nu doar mass customization',
    ],
    'Fashion': [
      'Calitate premium la prețuri accesibile',
      'Estetică distinctă, recognoscibilă instant',
      'Producție etică și transparență radicală',
      'Versatilitate — piese care durează sezoane',
      'Limited drops care creează exclusivitate',
    ],
    'Tech & SaaS': [
      'Onboarding sub 5 minute, fără friction',
      'Suport real, oameni reali, nu chatboți',
      'Pricing transparent, fără surprize în factură',
      'Integrări native cu tool-urile pe care le folosești',
      'Performanță măsurabilă — ROI vizibil în 30 zile',
    ],
    'Educație': [
      'Rezultate practice, nu doar diplome decorative',
      'Mentori activi în industrie, nu doar profesori',
      'Comunitate care continuă după absolvire',
      'Curriculum updatat la ritmul industriei',
      'Suport individual, nu volum de masă',
    ],
    'E-commerce': [
      'Curația produsele, nu doar le vinzi',
      'Experiență de unboxing memorabilă',
      'Returnare easy, fără labirint birocratic',
      'Recomandări personalizate, nu spam',
      'Loyalty program care recompensează autentic',
    ],
    'Servicii': [
      'Răspuns rapid și predictibil',
      'Expertiză demonstrabilă cu case studies',
      'Pricing clar, fără cost-uri ascunse',
      'Procese transparente vizibile clientului',
      'Relații pe termen lung, nu tranzacții',
    ],
    'Altele': [
      'Diferențiere clară de competiție',
      'Calitate consistentă, nu hype temporar',
      'Comunitate autentică în jurul brandului',
      'Inovație orientată pe nevoi reale',
      'Storytelling care rezonează emoțional',
    ],
  },
  en: {
    'F&B': [
      'Carefully sourced ingredients with origin stories',
      'Complete sensory experience — not just product',
      'Community built around daily rituals',
      'Full transparency in production process',
      'Menu innovation without sacrificing authenticity',
    ],
    'Beauty & Wellness': [
      'Clean formulas with no compromises on ingredients',
      'Visible results backed by real testimonials',
      'Education included — clients learn, not just buy',
      'Visible sustainability in packaging and process',
      'True personalization, not mass customization',
    ],
    'Fashion': [
      'Premium quality at accessible prices',
      'Distinct aesthetic, instantly recognizable',
      'Ethical production and radical transparency',
      'Versatility — pieces that last seasons',
      'Limited drops creating exclusivity',
    ],
    'Tech & SaaS': [
      'Sub-5-minute onboarding, no friction',
      'Real support, real humans, no chatbots',
      'Transparent pricing, no billing surprises',
      'Native integrations with the tools you use',
      'Measurable performance — visible ROI in 30 days',
    ],
    'Education': [
      'Practical results, not decorative diplomas',
      'Active industry mentors, not just teachers',
      'Community that continues post-graduation',
      'Curriculum updated at industry pace',
      'Individual support, not mass volume',
    ],
    'E-commerce': [
      'You curate products, not just sell them',
      'Memorable unboxing experience',
      'Easy returns, no bureaucratic maze',
      'Personalized recommendations, not spam',
      'Loyalty program that authentically rewards',
    ],
    'Services': [
      'Fast and predictable response',
      'Demonstrable expertise with case studies',
      'Clear pricing, no hidden costs',
      'Transparent processes visible to client',
      'Long-term relationships, not transactions',
    ],
    'Other': [
      'Clear differentiation from competition',
      'Consistent quality, not temporary hype',
      'Authentic community around the brand',
      'Innovation oriented to real needs',
      'Storytelling that emotionally resonates',
    ],
  },
}

const KPI_TEMPLATES = {
  ro: {
    'Awareness': [
      'Reach organic: +{n}K impresii / lună',
      'Share of voice: {n}% în categorie',
      'Brand recall în studii calitative: {n}%',
      'Mențiuni earned media: {n} / lună',
    ],
    'Engagement': [
      'Engagement rate: {n}% (peste benchmark industrie)',
      'Saves & shares: +{n}% MoM',
      'DM-uri inițiate de utilizatori: {n} / săpt.',
      'Timp mediu pe pagina campaniei: {n}s',
    ],
    'Lead generation': [
      'Leads calificate: {n} / săpt.',
      'Cost per lead: sub {n} EUR',
      'Conversie newsletter signup: {n}%',
      'Lead-to-customer rate: {n}%',
    ],
    'Vânzări directe': [
      'ROAS: minim {n}x',
      'AOV creștere: +{n}%',
      'Conversie pe campanie: {n}%',
      'Customer acquisition cost: sub {n} EUR',
    ],
    'Loialitate': [
      'Repeat purchase rate: {n}%',
      'Net Promoter Score: minim {n}',
      'Customer lifetime value: +{n}% YoY',
      'Churn rate: sub {n}%',
    ],
  },
  en: {
    'Awareness': [
      'Organic reach: +{n}K impressions / month',
      'Share of voice: {n}% in category',
      'Brand recall in qualitative studies: {n}%',
      'Earned media mentions: {n} / month',
    ],
    'Engagement': [
      'Engagement rate: {n}% (above industry benchmark)',
      'Saves & shares: +{n}% MoM',
      'User-initiated DMs: {n} / week',
      'Average campaign page time: {n}s',
    ],
    'Lead generation': [
      'Qualified leads: {n} / week',
      'Cost per lead: under {n} EUR',
      'Newsletter signup conversion: {n}%',
      'Lead-to-customer rate: {n}%',
    ],
    'Direct sales': [
      'ROAS: minimum {n}x',
      'AOV increase: +{n}%',
      'Campaign conversion: {n}%',
      'Customer acquisition cost: under {n} EUR',
    ],
    'Loyalty': [
      'Repeat purchase rate: {n}%',
      'Net Promoter Score: minimum {n}',
      'Customer lifetime value: +{n}% YoY',
      'Churn rate: under {n}%',
    ],
  },
}

const RISKS = {
  ro: [
    'Mesajul poate părea generic dacă nu se diferențiază clar de competiție pe execuție',
    'Necesită consistență în post-uri — abandonarea după 2 săptămâni anulează tot momentum-ul',
    'Audiența țintă este disputată — ai nevoie de un unghi distinct, nu de prezență brută',
    'Riscul de over-promising în copy — under-promise & over-deliver e mai sigur',
    'Algorithmic dependency — diversifică între platforme ca să reduci riscul',
    'Burnout creativ după prima lună — pregătește un content bank în avans',
  ],
  en: [
    'The message may seem generic without clear competitive differentiation in execution',
    'Requires consistency — abandoning after 2 weeks cancels all momentum',
    'The target audience is contested — you need a distinct angle, not just presence',
    'Risk of over-promising in copy — under-promise & over-deliver is safer',
    'Algorithmic dependency — diversify across platforms to reduce risk',
    'Creative burnout after the first month — prepare a content bank in advance',
  ],
}

const COPY_VARIANTS = {
  ro: {
    emotional: {
      label: 'Emoțional',
      headline: ({ name, audience }) => `${name}. Pentru cei care simt diferența.`,
      body: ({ name, businessType, audience }) => `${name} nu e doar ${businessType}. E o pauză. Un ritual. Un mic moment care îți aparține în mijlocul zilei. Pentru ${audience}, am construit ceva diferit.`,
      cta: 'Descoperă',
    },
    direct: {
      label: 'Direct',
      headline: ({ name }) => `${name}. Mai bine. Punct.`,
      body: ({ name, businessType, valueProps }) => `${valueProps[0]}. ${valueProps[1]}. ${name} oferă ce alți ${businessType} promit, dar nu livrează.`,
      cta: 'Vezi diferența',
    },
    story: {
      label: 'Story-driven',
      headline: ({ name }) => `Povestea din spatele ${name}.`,
      body: ({ name, audience }) => `Am început cu o întrebare simplă: ce ar ajuta cu adevărat ${audience}? Răspunsul ne-a luat un an de iterații. Astăzi, ${name} este rezultatul.`,
      cta: 'Citește povestea',
    },
  },
  en: {
    emotional: {
      label: 'Emotional',
      headline: ({ name }) => `${name}. For those who feel the difference.`,
      body: ({ name, businessType, audience }) => `${name} isn't just ${businessType}. It's a pause. A ritual. A small moment that belongs to you in the middle of the day. For ${audience}, we built something different.`,
      cta: 'Discover',
    },
    direct: {
      label: 'Direct',
      headline: ({ name }) => `${name}. Better. Period.`,
      body: ({ name, businessType, valueProps }) => `${valueProps[0]}. ${valueProps[1]}. ${name} delivers what other ${businessType} promise but don't deliver.`,
      cta: 'See the difference',
    },
    story: {
      label: 'Story-driven',
      headline: ({ name }) => `The story behind ${name}.`,
      body: ({ name, audience }) => `We started with a simple question: what would actually help ${audience}? The answer took us a year of iteration. Today, ${name} is the result.`,
      cta: 'Read the story',
    },
  },
}

const CALENDAR_TEMPLATES = {
  ro: [
    { format: 'Carousel', themePool: ['Behind-the-scenes', 'How-to / educațional', 'Story origin'] },
    { format: 'Reel', themePool: ['Day-in-the-life', 'Tutorial rapid', 'Trending audio adaptat'] },
    { format: 'Story', themePool: ['Q&A cu audiența', 'Poll: alegere produs', 'Sneak peek'] },
    { format: 'Photo', themePool: ['Product shot editorial', 'User generated content', 'Lifestyle context'] },
    { format: 'Live', themePool: ['Discuție cu un specialist', 'Lansare produs', 'AMA cu fondatorul'] },
    { format: 'Carousel', themePool: ['Testimoniale clienți', 'Mit vs. realitate', 'Top 5 lista'] },
    { format: 'Newsletter', themePool: ['Recapitulare săptămână', 'Insight industrie', 'Ofertă exclusivă'] },
  ],
  en: [
    { format: 'Carousel', themePool: ['Behind-the-scenes', 'How-to / educational', 'Origin story'] },
    { format: 'Reel', themePool: ['Day-in-the-life', 'Quick tutorial', 'Adapted trending audio'] },
    { format: 'Story', themePool: ['Audience Q&A', 'Poll: product choice', 'Sneak peek'] },
    { format: 'Photo', themePool: ['Editorial product shot', 'User generated content', 'Lifestyle context'] },
    { format: 'Live', themePool: ['Specialist discussion', 'Product launch', 'Founder AMA'] },
    { format: 'Carousel', themePool: ['Customer testimonials', 'Myth vs. reality', 'Top 5 list'] },
    { format: 'Newsletter', themePool: ['Week recap', 'Industry insight', 'Exclusive offer'] },
  ],
}

// === GENERATOR ===
const pick = (arr, n = 1) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const fillKpi = (template) => {
  return template.replace(/\{n\}/g, () => {
    const ranges = [3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100]
    return pick(ranges)
  })
}

export const generateBrief = async ({ formData, lang, onProgress }) => {
  if (onProgress) onProgress('analyzing')

  // Fetch industry context from Wikipedia
  const industryKey = formData.industry
  const industryContext = await fetchIndustryContext(industryKey, lang)

  // Small delay for UX
  await new Promise(r => setTimeout(r, 600))
  if (onProgress) onProgress('composing')

  const langKey = lang
  const valueProps = pick(VALUE_PROPS[langKey][industryKey] || VALUE_PROPS[langKey]['Altele'] || VALUE_PROPS[langKey]['Other'], 4)

  const goalKey = formData.goal
  const kpiPool = KPI_TEMPLATES[langKey][goalKey] || KPI_TEMPLATES[langKey]['Awareness']
  const kpis = pick(kpiPool, 4).map(fillKpi)

  const risks = pick(RISKS[langKey], 3)

  // Build campaign title
  const titleTemplates = lang === 'ro'
    ? [`${formData.businessName} — ${pick(['Reimaginat', 'Redefinit', 'Așa cum trebuia', 'Diferit', 'Aproape de tine'])}`,
       `${pick(['Capitolul', 'Volumul', 'Episodul'])} ${pick(['Nou', 'Următor', 'I'])}: ${formData.businessName}`,
       `Pentru cei care aleg ${formData.businessName}`]
    : [`${formData.businessName} — ${pick(['Reimagined', 'Redefined', 'As it should be', 'Different', 'Close to you'])}`,
       `${pick(['Chapter', 'Volume', 'Episode'])} ${pick(['New', 'Next', 'I'])}: ${formData.businessName}`,
       `For those who choose ${formData.businessName}`]

  // Objective
  const objective = lang === 'ro'
    ? `Poziționarea ${formData.businessName} ca alegere preferată pentru ${formData.audience.split(',')[0].trim()} pe segmentul ${industryKey.toLowerCase()}, cu focus pe ${goalKey.toLowerCase()} pe parcursul a ${formData.duration}.`
    : `Positioning ${formData.businessName} as the preferred choice for ${formData.audience.split(',')[0].trim()} in the ${industryKey.toLowerCase()} segment, with focus on ${goalKey.toLowerCase()} over ${formData.duration}.`

  // Audience insight (uses industry context if available)
  const audienceInsight = lang === 'ro'
    ? `${formData.audience} caută mai mult decât funcționalitate — caută afiliere. Nu cumpără un produs, cumpără apartenența la un grup care alege bine. Brandurile câștigătoare în această categorie sunt cele care fac alegerea să pară inevitabilă, nu argumentată.`
    : `${formData.audience} look for more than functionality — they look for affiliation. They don't buy a product, they buy belonging to a group that chooses well. Winning brands in this category make the choice feel inevitable, not argued.`

  // Key message
  const keyMessage = lang === 'ro'
    ? `${formData.businessName} ${pick(['nu este pentru toată lumea — este pentru tine.', 'există pentru cei care nu se mulțumesc cu „suficient de bun".', 'transformă rutina în ritual.'])}`
    : `${formData.businessName} ${pick(['isn\'t for everyone — it\'s for you.', 'exists for those who don\'t settle for "good enough".', 'turns routine into ritual.'])}`

  // Copy variants
  const copyContext = {
    name: formData.businessName,
    businessType: industryKey.toLowerCase(),
    audience: formData.audience.split(',')[0].trim(),
    valueProps,
  }
  const copyVariants = ['emotional', 'direct', 'story'].map(key => {
    const t = COPY_VARIANTS[langKey][key]
    return {
      label: t.label,
      headline: t.headline(copyContext),
      body: t.body(copyContext),
      cta: t.cta,
    }
  })

  // Editorial calendar (7 days)
  const platforms = formData.platforms.length > 0 ? formData.platforms : ['Instagram']
  const calendarTemplates = CALENDAR_TEMPLATES[langKey]
  const editorialCalendar = calendarTemplates.map((tpl, i) => {
    const platform = platforms[i % platforms.length]
    const theme = pick(tpl.themePool)
    const content = lang === 'ro'
      ? `${theme} pentru ${formData.businessName}. Format ${tpl.format.toLowerCase()} adaptat la ${platform}, cu focus pe ${formData.tone[0]?.toLowerCase() || 'autentic'} și call-to-action subtil. Estimat 60-90 minute de producție.`
      : `${theme} for ${formData.businessName}. ${tpl.format} format adapted for ${platform}, focused on ${formData.tone[0]?.toLowerCase() || 'authentic'} tone with subtle call-to-action. Estimated 60-90 min production.`
    return {
      day: i + 1,
      platform,
      format: tpl.format,
      theme,
      content,
    }
  })

  // Hashtags
  const businessSlug = formData.businessName.replace(/[^a-zA-Z0-9]/g, '')
  const industrySlug = industryKey.replace(/[^a-zA-Z0-9]/g, '')
  const hashtagBundle = {
    primary: [businessSlug, `${businessSlug}Stories`, `${businessSlug}Life`, `Cu${businessSlug}`, `${businessSlug}Moments`].slice(0, 5),
    niche: [`${industrySlug}Romania`, `Local${industrySlug}`, `${industrySlug}Lovers`, `Best${industrySlug}`, `${industrySlug}Daily`, `Independent${industrySlug}`].slice(0, 6),
    broad: ['SmallBusiness', 'SupportLocal', 'MadeWithLove', 'Quality', 'Authentic', 'Handcrafted', 'Community'].slice(0, 6),
    trending: ['ThatGirl', 'CleanGirl', 'Aesthetic', 'DailyMoment', 'WeekendVibes'].slice(0, 5),
  }

  if (onProgress) onProgress('finalizing')
  await new Promise(r => setTimeout(r, 400))

  return {
    campaignBrief: {
      title: pick(titleTemplates),
      objective,
      audienceInsight,
      keyMessage,
      valueProps,
      kpis,
      risks,
    },
    copyVariants,
    editorialCalendar,
    hashtagBundle,
    industryContext, // attached for transparency
  }
}
