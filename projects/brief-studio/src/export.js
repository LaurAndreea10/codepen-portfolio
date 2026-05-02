export const briefToMarkdown = (brief, formData, lang) => {
  const t = lang === 'ro'
    ? { title: '# Marketing Brief', objective: 'Obiectiv', insight: 'Audience insight', key: 'Mesaj cheie', vp: 'Propuneri de valoare', kpi: 'KPI', risks: 'Riscuri', copy: 'Copy Variants', variant: 'Varianta', headline: 'Headline', body: 'Body', cta: 'CTA', calendar: 'Calendar Editorial', day: 'Ziua', platform: 'Platformă', format: 'Format', theme: 'Tema', content: 'Conținut', hashtags: 'Hashtags', primary: 'Principale', niche: 'Niche', broad: 'Reach larg', trending: 'Trending', generated: 'Generat cu Brief Studio' }
    : { title: '# Marketing Brief', objective: 'Objective', insight: 'Audience insight', key: 'Key message', vp: 'Value props', kpi: 'KPIs', risks: 'Risks', copy: 'Copy Variants', variant: 'Variant', headline: 'Headline', body: 'Body', cta: 'CTA', calendar: 'Editorial Calendar', day: 'Day', platform: 'Platform', format: 'Format', theme: 'Theme', content: 'Content', hashtags: 'Hashtags', primary: 'Primary', niche: 'Niche', broad: 'Broad', trending: 'Trending', generated: 'Generated with Brief Studio' }

  const cb = brief.campaignBrief || {}
  let md = `${t.title}\n\n## ${cb.title || ''}\n\n`
  md += `**${formData.businessName}** — ${formData.industry} | ${formData.duration} | ${formData.platforms.join(', ')}\n\n---\n\n`
  md += `### ${t.objective}\n${cb.objective}\n\n`
  md += `### ${t.insight}\n${cb.audienceInsight}\n\n`
  md += `### ${t.key}\n> ${cb.keyMessage}\n\n`
  md += `### ${t.vp}\n${(cb.valueProps || []).map(v => `- ${v}`).join('\n')}\n\n`
  md += `### ${t.kpi}\n${(cb.kpis || []).map(k => `- ${k}`).join('\n')}\n\n`
  md += `### ${t.risks}\n${(cb.risks || []).map(r => `- ${r}`).join('\n')}\n\n---\n\n`

  md += `## ${t.copy}\n\n`
  ;(brief.copyVariants || []).forEach((v, i) => {
    md += `### ${t.variant} ${i + 1} — ${v.label}\n\n**${t.headline}:** ${v.headline}\n\n${v.body}\n\n**${t.cta}:** \`${v.cta}\`\n\n`
  })
  md += '---\n\n'

  md += `## ${t.calendar}\n\n| ${t.day} | ${t.platform} | ${t.format} | ${t.theme} |\n|---|---|---|---|\n`
  ;(brief.editorialCalendar || []).forEach(d => {
    md += `| ${d.day} | ${d.platform} | ${d.format} | ${d.theme} |\n`
  })
  md += '\n'
  ;(brief.editorialCalendar || []).forEach(d => {
    md += `**${t.day} ${d.day}** — ${d.platform}\n${d.content}\n\n`
  })
  md += '---\n\n'

  const hb = brief.hashtagBundle || {}
  md += `## ${t.hashtags}\n\n`
  md += `**${t.primary}:** ${(hb.primary || []).map(h => '#' + h).join(' ')}\n\n`
  md += `**${t.niche}:** ${(hb.niche || []).map(h => '#' + h).join(' ')}\n\n`
  md += `**${t.broad}:** ${(hb.broad || []).map(h => '#' + h).join(' ')}\n\n`
  md += `**${t.trending}:** ${(hb.trending || []).map(h => '#' + h).join(' ')}\n\n`
  md += `---\n\n*${t.generated} — ${new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US')}*\n`

  return md
}

export const downloadFile = (content, filename, type = 'text/markdown;charset=utf-8') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const downloadPaletteSVG = (palette, filename = 'palette.svg') => {
  const w = 200
  const h = 100
  const total = palette.length
  let rects = ''
  palette.forEach((c, i) => {
    rects += `<rect x="${i * w}" y="0" width="${w}" height="${h}" fill="${c.hex}"/>
<text x="${i * w + 10}" y="${h - 30}" font-family="monospace" font-size="11" fill="${getContrast(c.hex)}">${c.name}</text>
<text x="${i * w + 10}" y="${h - 14}" font-family="monospace" font-size="10" fill="${getContrast(c.hex)}" opacity="0.7">${c.hex}</text>`
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w * total} ${h}" width="${w * total}" height="${h}">${rects}</svg>`
  downloadFile(svg, filename, 'image/svg+xml')
}

const getContrast = (hex) => {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = rgb & 0xff
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch { return false }
}
