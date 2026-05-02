# Case Study — Brief Studio

> A multi-tool marketing studio built on free public APIs.
> *Un studio de marketing multi-tool construit pe APIs publice gratuite.*

**Live:** [laurandreea10.github.io/brief-studio](https://laurandreea10.github.io/brief-studio/)
**Repo:** [github.com/LaurAndreea10/brief-studio](https://github.com/LaurAndreea10/brief-studio)
**Status:** Shipped · May 2026
**Stack:** React 18 · Vite 5 · Tailwind 3 · Framer Motion · Wikipedia API · REST Countries API

---

## 🇷🇴 Versiunea în Română

### Contextul

Cele mai multe portfolio pieces front-end sunt dashboards de admin sau clone de produse cunoscute. Voiam să construiesc ceva diferit: un produs care **rezolvă o problemă reală pentru utilizator final**, fără să depindă de servicii plătite sau API key-uri ascunse.

**Problema identificată:** small business owners nu au timp și nu au buget pentru agenții de marketing. Tool-urile existente (Jasper, Copy.ai) sunt $50-100/lună, cer cont și card, și produc copy generic care nu se diferențiază pe piața locală.

**Întrebarea:** poate un tool gratuit, fără cont, alimentat doar de APIs publice, să livreze o experiență comparabilă cu un AI plătit?

### Decizia de design

Am decis să construiesc nu un singur tool, ci **un studio cu 3 instrumente complementare** — pentru că un small business owner nu are nevoie doar de copy, ci și de inspirație vizuală și înțelegerea pieței.

| Tool | Întrebarea pe care o rezolvă | Sursa de date |
|---|---|---|
| **Brief Generator** | „Ce să postez și cum să-mi pozitionez brandul?" | Wikipedia + template library |
| **Mood Board** | „Cum vreau să arate brandul meu vizual?" | Unsplash (curated) |
| **Market Lens** | „Cine sunt competitorii și cum arată piața mea?" | Wikipedia + REST Countries |

### Arhitectura

```
┌─────────────────────────────────────────────┐
│  Browser (React SPA — Single Page App)      │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │  Brief   │ │   Mood   │ │   Market    │  │
│  │   Tool   │ │  Board   │ │    Lens     │  │
│  └────┬─────┘ └────┬─────┘ └──────┬──────┘  │
│       │            │              │         │
│       └────────────┴──────────────┘         │
│                    │                        │
│                    ▼                        │
│         Engines (logic per tool)            │
└────────────────────┼────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌──────────┐
   │Wikipedia│ │ Unsplash │ │   REST   │
   │   API   │ │   CDN    │ │Countries │
   └─────────┘ └──────────┘ └──────────┘
```

**Zero backend.** Toate request-urile pleacă direct din browser către APIs publice. Hosting pe GitHub Pages = $0/lună forever.

### Provocări tehnice și soluții

#### Provocarea #1: Cum simulezi „inteligența" fără AI?

**Problema:** un brief generic produs din template-uri ar fi vizibil mecanic. Dar AI-urile gratuite (Pollinations, etc.) sunt instabile sau cer key-uri.

**Soluția:** **Template intelligence** — am construit librării de value props research-based per industrie (8 industrii × 5 value props × 2 limbi = 80 de propoziții strategice scrise manual), KPI templates parametrizate (`+{n}% engagement` cu n din pool randomizat), și 3 structure-uri distincte de copy (emotional, direct, story-driven). Apoi am combinat asta cu context **real** din Wikipedia API despre industrie — astfel briefurile au și „muscle memory" strategic, și context factual.

**Rezultat:** outputurile arată ca briefurile produse de un junior strategist, nu ca template-uri completate cu autocomplete.

#### Provocarea #2: Pollinations API a închis tier-ul gratuit la mijlocul build-ului

**Ce s-a întâmplat:** primul plan era să folosesc `text.pollinations.ai` pentru AI text generation gratuit. Când am testat în timpul build-ului, am primit `Host not in allowlist`. Mi-am dat seama că serviciul migrase la `gen.pollinations.ai` cu API keys obligatorii.

**Soluția:** în loc să caut alt provider AI care s-ar putea închide la fel, am pivotat complet către APIs **rock-solid** care nu au close-uri de tier:
- Wikipedia → există de 24 ani, dezvoltat de Wikimedia Foundation, free forever
- REST Countries → open source, mirror multiple
- Unsplash CDN → photo URLs directe (fără API), folosesc license-ul lor public

**Lecție:** dacă proiectul tău depinde de un singur API gratuit, nu e un proiect — e un timer. Diversifică.

#### Provocarea #3: Mood board fără API key la Unsplash

**Problema:** Unsplash API necesită application + key. Pentru un proiect public open-source asta e friction inutil.

**Soluția:** am construit o **librărie curated de Photo IDs** — am ales manual 6 fotografii reprezentative per industrie, cu metadata-ul fotografului. URL-urile către CDN-ul Unsplash sunt publice (`images.unsplash.com/photo-{id}`), iar atribuirea către fotograf rămâne, conform Unsplash License. **48 de fotografii hand-picked** pentru calitate consistentă, fără randomness imprevizibil.

**Bonus:** load time mai rapid decât API call-uri live, pentru că URL-urile sunt cunoscute la build time.

### Decizii de UX care contează

**Editorial design language.** Am ales să nu fac „un alt SaaS dashboard" cu carduri și gradiente. Inspirația a venit din reviste editoriale — Fraunces ca display font (variable, cu opsz axis), layouts asimetrice cu line numbers (01-05), grain overlay subtilă, accent în oxblood (#6B1D2A) care evocă tipăritura clasică.

**Multi-stage loading.** În loc de un spinner generic, loading-ul afișează 3 stage-uri (`Analyzing → Composing → Finalizing`) cu check-marks progressive. Asta:
1. Dă feedback că ceva real se întâmplă (chiar dacă e parțial template logic)
2. Setează aștepta că outputul va fi complex (vine după 3 etape)
3. Dă tool-ului o senzație de craft, nu de instant magic

**Bilingv nativ.** RO și EN nu sunt traduceri — sunt scrise paralel, cu nuanțe specifice pieței. Când userul schimbă limba, până și tag-urile generate, exemplele de copy și KPI-urile sunt regenerate în limba respectivă cu format-uri locale (`ron-RO` vs `en-US` pentru numere).

### Metrici de impact

- **Bundle size:** 107 KB gzipped JS (sub limita de 200KB pentru first paint rapid pe 3G)
- **Cost lunar de operare:** $0 (GitHub Pages + APIs publice)
- **Time to first interactive output:** ~2-3 secunde (1.2s Wikipedia fetch + 800ms procesare + 300ms loading UX)
- **API key-uri necesare:** 0
- **Conturi necesare pentru utilizator:** 0
- **Limbi suportate nativ:** 2 (RO/EN)

### Ce am învățat

1. **Constraint-urile generează creativitate.** Limitarea „fără API keys" m-a forțat să gândesc template intelligence, ceea ce a produs outputs mai consistente decât un AI free ar fi produs.

2. **APIs publice sunt subutilizate.** Wikipedia REST API e o resursă incredibilă pentru context contextual, ignorată de majoritatea proiectelor pentru că e „prea simplă". REST Countries e perfectă pentru context geografic.

3. **Editorial design diferențiază.** Pe o piață de SaaS dashboards generice, un layout cu personalitate editorială iese în evidență instant la recruiters.

4. **Multi-API orchestration e o competență subapreciată.** Combinarea a 3 surse într-un workflow coerent e mai impresionantă tehnic decât o singură integrare API complexă.

5. **Pivoturi rapide salvează proiecte.** Când Pollinations s-a închis în mijlocul build-ului, am pivotat în 30 minute la o arhitectură mai bună. Atașamentul față de planul inițial e cel mai mare risc tehnic.

### Ce aș face diferit data viitoare

- **Storage local pentru briefuri generate** — momentan trebuie să descarci Markdown-ul, ar trebui să existe o galerie de istoric
- **Share link cu state encoded în URL** — pentru a putea trimite cuiva un brief generat fără să-l descarci
- **A/B testing pe template variants** — să văd care unghiuri de copy convertesc mai bine la engagement (ar necesita analytics, deci o decizie filozofică)
- **PWA cu offline support** — Wikipedia summaries pot fi cached, ar funcționa și fără net

---

## 🇬🇧 English Version

### Context

Most front-end portfolio pieces are admin dashboards or clones of well-known products. I wanted to build something different: a product that **solves a real problem for an end user**, without depending on paid services or hidden API keys.

**The problem identified:** small business owners don't have time and don't have budget for marketing agencies. Existing tools (Jasper, Copy.ai) are $50-100/month, require account and credit card, and produce generic copy that doesn't differentiate on local markets.

**The question:** can a free tool, no account, powered only by public APIs, deliver an experience comparable to a paid AI?

### The design decision

I decided to build not a single tool, but **a studio with 3 complementary tools** — because a small business owner needs not just copy, but also visual inspiration and market understanding.

| Tool | Question it solves | Data source |
|---|---|---|
| **Brief Generator** | "What should I post and how do I position my brand?" | Wikipedia + template library |
| **Mood Board** | "How do I want my brand to look visually?" | Unsplash (curated) |
| **Market Lens** | "Who are the competitors and what does my market look like?" | Wikipedia + REST Countries |

### Architecture

Zero backend. All requests go directly from the browser to public APIs. Hosted on GitHub Pages = $0/month forever.

### Technical challenges and solutions

#### Challenge #1: How do you simulate "intelligence" without AI?

**Problem:** a generic brief produced from templates would be visibly mechanical. But free AIs (Pollinations, etc.) are unstable or require keys.

**Solution: Template intelligence** — I built research-based value prop libraries per industry (8 industries × 5 value props × 2 languages = 80 strategic propositions written by hand), parametrized KPI templates (`+{n}% engagement` with n from a randomized pool), and 3 distinct copy structures (emotional, direct, story-driven). I then combined this with **real** context from Wikipedia API about the industry — so briefs have both strategic muscle memory and factual context.

**Result:** outputs look like briefs produced by a junior strategist, not templates filled in by autocomplete.

#### Challenge #2: Pollinations API closed its free tier mid-build

**What happened:** the first plan was to use `text.pollinations.ai` for free AI text generation. When I tested during the build, I got `Host not in allowlist`. I realized the service had migrated to `gen.pollinations.ai` with mandatory API keys.

**Solution:** instead of looking for another AI provider that could close the same way, I pivoted completely to **rock-solid APIs** with no tier closures:
- Wikipedia → exists for 24 years, developed by Wikimedia Foundation, free forever
- REST Countries → open source, multiple mirrors
- Unsplash CDN → direct photo URLs (no API), using their public license

**Lesson:** if your project depends on a single free API, it's not a project — it's a timer. Diversify.

#### Challenge #3: Mood board without Unsplash API key

**Problem:** Unsplash API requires application + key. For a public open-source project that's unnecessary friction.

**Solution:** I built a **curated library of Photo IDs** — manually selected 6 representative photos per industry, with photographer metadata. URLs to Unsplash CDN are public (`images.unsplash.com/photo-{id}`), and photographer attribution stays per Unsplash License. **48 hand-picked photos** for consistent quality, no unpredictable randomness.

**Bonus:** faster load time than live API calls, because URLs are known at build time.

### UX decisions that matter

**Editorial design language.** I chose not to make "another SaaS dashboard" with cards and gradients. Inspiration came from editorial magazines — Fraunces as display font (variable, with opsz axis), asymmetric layouts with line numbers (01-05), subtle grain overlay, oxblood accent (#6B1D2A) evoking classic print.

**Multi-stage loading.** Instead of a generic spinner, loading shows 3 stages (`Analyzing → Composing → Finalizing`) with progressive checkmarks. This:
1. Gives feedback that something real is happening (even if it's partly template logic)
2. Sets expectation that output will be complex (comes after 3 stages)
3. Gives the tool a sense of craft, not instant magic

**Native bilingual.** RO and EN aren't translations — they're written in parallel, with market-specific nuances. When user switches language, even generated tags, copy examples and KPIs are regenerated in that language with local formats (`ron-RO` vs `en-US` for numbers).

### Impact metrics

- **Bundle size:** 107 KB gzipped JS (under 200KB limit for fast first paint on 3G)
- **Monthly operating cost:** $0 (GitHub Pages + public APIs)
- **Time to first interactive output:** ~2-3 seconds (1.2s Wikipedia fetch + 800ms processing + 300ms loading UX)
- **API keys needed:** 0
- **Accounts needed for user:** 0
- **Languages supported natively:** 2 (RO/EN)

### What I learned

1. **Constraints generate creativity.** The "no API keys" limitation forced me to think template intelligence, which produced more consistent outputs than a free AI would have.

2. **Public APIs are underused.** Wikipedia REST API is an incredible resource for contextual context, ignored by most projects because it's "too simple." REST Countries is perfect for geographic context.

3. **Editorial design differentiates.** In a market of generic SaaS dashboards, a layout with editorial personality stands out instantly to recruiters.

4. **Multi-API orchestration is an underappreciated competency.** Combining 3 sources into a coherent workflow is more technically impressive than a single complex API integration.

5. **Fast pivots save projects.** When Pollinations closed mid-build, I pivoted in 30 minutes to a better architecture. Attachment to the original plan is the biggest technical risk.

### What I'd do differently next time

- **Local storage for generated briefs** — currently you have to download Markdown, there should be a history gallery
- **Share link with state encoded in URL** — to send someone a generated brief without downloading
- **A/B testing on template variants** — to see which copy angles convert better at engagement (would require analytics, so a philosophical decision)
- **PWA with offline support** — Wikipedia summaries can be cached, would work without net

---

## Skills demonstrated · Competențe demonstrate

| Front-end | Architecture | Product |
|---|---|---|
| React 18 (hooks, Suspense patterns) | Multi-API orchestration | UX writing (RO+EN) |
| Vite build optimization | Template intelligence design | Information architecture |
| Tailwind 3 (custom design tokens) | Component composition | Editorial design language |
| Framer Motion (page transitions) | State management without lib | Bilingual i18n strategy |
| Responsive layouts | Error handling & fallbacks | User research thinking |
| Accessibility considerations | Pivot management | Self-directed product scoping |

---

<p align="center">
  <strong>Brief Studio</strong> · Case Study · Vol. 01<br>
  <sub>Built by <a href="https://github.com/LaurAndreea10">Laura Andreea</a> · May 2026</sub>
</p>
