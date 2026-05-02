// Anthropic API client for Brief Studio
// Uses the /v1/messages endpoint with structured JSON output

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

export const buildPrompt = (formData, lang) => {
  const langInstruction = lang === 'ro'
    ? 'Răspunde COMPLET în limba română. Toate textele, copy-urile, hashtag-urile (acolo unde sunt în română) trebuie să fie în română. Hashtag-urile pot include și termeni internaționali în engleză când e potrivit.'
    : 'Respond ENTIRELY in English. All text, copy, hashtags must be in English.'

  return `You are a senior marketing strategist working at a top creative agency. ${langInstruction}

Generate a complete marketing brief package based on this input:

BUSINESS DETAILS:
- Name: ${formData.businessName}
- Type: ${formData.businessType}
- Industry: ${formData.industry}

AUDIENCE & VOICE:
- Target audience: ${formData.audience}
- Tone of voice: ${formData.tone.join(', ')}

CAMPAIGN GOALS:
- Primary goal: ${formData.goal}
- Duration: ${formData.duration}
- Platforms: ${formData.platforms.join(', ')}
- Budget: ${formData.budget || 'Not specified'}

OUTPUT REQUIREMENTS:
You must respond with ONLY a valid JSON object (no markdown, no code fences, no preamble) following this exact schema:

{
  "campaignBrief": {
    "title": "Campaign name (creative, 3-6 words)",
    "objective": "1-2 sentences describing the strategic objective",
    "audienceInsight": "1-2 sentences with a sharp insight about the target audience",
    "keyMessage": "The single core message in 1 sentence",
    "valueProps": ["3-4 distinct value propositions, each 1 short phrase"],
    "kpis": ["4-5 measurable KPIs with target ranges"],
    "risks": ["2-3 strategic risks or considerations to watch"]
  },
  "copyVariants": [
    {
      "label": "Approach name (e.g. 'Emotional', 'Direct', 'Story-driven')",
      "headline": "Punchy headline, max 8 words",
      "body": "2-3 sentences of body copy",
      "cta": "Call to action, max 4 words"
    }
  ],
  "editorialCalendar": [
    {
      "day": 1,
      "platform": "Platform name from the input list",
      "format": "Post format (e.g. 'Carousel', 'Reel', 'Story', 'Photo', 'Newsletter')",
      "theme": "Theme/angle for this day",
      "content": "2-3 sentences describing the actual post content and approach"
    }
  ],
  "hashtagBundle": {
    "primary": ["5-7 main branded/campaign hashtags"],
    "niche": ["5-7 niche hashtags relevant to the audience"],
    "broad": ["5-7 broader reach hashtags"],
    "trending": ["3-5 currently relevant hashtags or evergreen trending ones"]
  }
}

IMPORTANT:
- Generate exactly 3 copy variants with distinct strategic angles
- Generate exactly 7 days for the editorial calendar
- Each day should use a DIFFERENT platform from the input (cycle through if more days than platforms)
- Hashtags must NOT include the # symbol (it's added by the UI)
- Be specific and actionable, never generic
- Match the tone of voice strictly
- Output ONLY the JSON object, nothing else`
}

export const generateBrief = async ({ apiKey, formData, lang, onProgress }) => {
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    throw new Error('INVALID_API_KEY')
  }

  const prompt = buildPrompt(formData, lang)

  if (onProgress) onProgress('analyzing')

  let response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    throw new Error('NETWORK')
  }

  if (response.status === 429) throw new Error('RATE_LIMIT')
  if (response.status === 401 || response.status === 403) throw new Error('INVALID_API_KEY')
  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.error('API error:', response.status, errText)
    throw new Error('GENERIC')
  }

  if (onProgress) onProgress('crafting')

  const data = await response.json()

  if (onProgress) onProgress('planning')

  // Extract text from content blocks
  const text = data.content
    ?.filter(block => block.type === 'text')
    ?.map(block => block.text)
    ?.join('\n') || ''

  if (onProgress) onProgress('finalizing')

  // Strip code fences if present, then parse
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    return parsed
  } catch (err) {
    // Try to find JSON object in the text
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch (e) {
        console.error('Parse error:', e, cleaned)
        throw new Error('PARSE')
      }
    }
    console.error('Parse error:', err, cleaned)
    throw new Error('PARSE')
  }
}
