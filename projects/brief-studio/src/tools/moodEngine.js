// Mood Board engine
// Uses Unsplash Source — public, no key, no rate limits
// Format: https://source.unsplash.com/{size}/?{keywords}

// Industry → keyword library for visual searches
const INDUSTRY_KEYWORDS = {
  'F&B': ['coffee', 'cafe-interior', 'pastry', 'food-photography', 'minimal-table', 'breakfast'],
  'Beauty & Wellness': ['skincare', 'wellness', 'spa', 'natural-cosmetics', 'self-care', 'minimal-bathroom'],
  'Fashion': ['fashion-editorial', 'streetwear', 'minimal-outfit', 'fashion-detail', 'style', 'wardrobe'],
  'Tech & SaaS': ['minimal-desk', 'workspace', 'macbook', 'modern-office', 'tech-aesthetic', 'productivity'],
  'Educație': ['library', 'study-desk', 'books', 'learning', 'minimal-notebook', 'university'],
  'Education': ['library', 'study-desk', 'books', 'learning', 'minimal-notebook', 'university'],
  'E-commerce': ['packaging', 'unboxing', 'product-shot', 'minimal-product', 'retail', 'shopping'],
  'Servicii': ['handshake', 'office-meeting', 'professional', 'workspace', 'consultation', 'business'],
  'Services': ['handshake', 'office-meeting', 'professional', 'workspace', 'consultation', 'business'],
  'Altele': ['minimal', 'aesthetic', 'lifestyle', 'modern', 'design', 'art'],
  'Other': ['minimal', 'aesthetic', 'lifestyle', 'modern', 'design', 'art'],
}

const AESTHETIC_MODIFIERS = {
  'Minimalist': ['white', 'minimal', 'clean', 'negative-space'],
  'Maximalist': ['vibrant', 'colorful', 'pattern', 'bold'],
  'Vintage': ['vintage', 'retro', 'analog', 'nostalgic'],
  'Futuristic': ['futuristic', 'neon', 'cyber', 'tech'],
  'Organic': ['nature', 'botanical', 'earth-tones', 'organic'],
  'Industrial': ['industrial', 'concrete', 'metal', 'raw'],
  'Pastel': ['pastel', 'soft', 'pink', 'dreamy'],
  'Monochrome': ['black-and-white', 'monochrome', 'grayscale', 'noir'],
}

// Pre-defined palettes per aesthetic — research-backed
const PALETTES = {
  'Minimalist': [
    { name: 'Cream', hex: '#F5EFE4' },
    { name: 'Stone', hex: '#D6CFC2' },
    { name: 'Charcoal', hex: '#2A2724' },
    { name: 'Accent', hex: '#6B1D2A' },
    { name: 'White', hex: '#FBF8F3' },
  ],
  'Maximalist': [
    { name: 'Electric', hex: '#FF3366' },
    { name: 'Lemon', hex: '#FFD60A' },
    { name: 'Cobalt', hex: '#0040FF' },
    { name: 'Mint', hex: '#00D4AA' },
    { name: 'Black', hex: '#0A0A0A' },
  ],
  'Vintage': [
    { name: 'Mustard', hex: '#C8963E' },
    { name: 'Rust', hex: '#A8443B' },
    { name: 'Olive', hex: '#6B7340' },
    { name: 'Cream', hex: '#EDE0C8' },
    { name: 'Sepia', hex: '#3E2C1C' },
  ],
  'Futuristic': [
    { name: 'Neon Pink', hex: '#FF006E' },
    { name: 'Electric Blue', hex: '#00F5FF' },
    { name: 'Deep Space', hex: '#0A0E27' },
    { name: 'Chrome', hex: '#C0C5CE' },
    { name: 'Acid', hex: '#CCFF00' },
  ],
  'Organic': [
    { name: 'Moss', hex: '#5A6E3F' },
    { name: 'Bark', hex: '#6B4423' },
    { name: 'Sand', hex: '#D4B896' },
    { name: 'Sage', hex: '#9CAF88' },
    { name: 'Stone', hex: '#8B7E6F' },
  ],
  'Industrial': [
    { name: 'Concrete', hex: '#7C7E7F' },
    { name: 'Steel', hex: '#48494B' },
    { name: 'Rust', hex: '#A35728' },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Off-white', hex: '#E8E5DE' },
  ],
  'Pastel': [
    { name: 'Blush', hex: '#FFD4D4' },
    { name: 'Mint', hex: '#C8E6C9' },
    { name: 'Lavender', hex: '#D7C4E5' },
    { name: 'Butter', hex: '#FFF3C4' },
    { name: 'Sky', hex: '#C5E1F0' },
  ],
  'Monochrome': [
    { name: 'Black', hex: '#000000' },
    { name: 'Dark', hex: '#2A2A2A' },
    { name: 'Mid', hex: '#7C7C7C' },
    { name: 'Light', hex: '#D4D4D4' },
    { name: 'White', hex: '#FFFFFF' },
  ],
}

// Use picsum + lorem.space alternative: better — direct stable image URLs
// Strategy: use a curated list of Unsplash photo IDs with attribution
// This is more reliable than source.unsplash.com which has been deprecated

// Curated Unsplash photo collections per category (real photo IDs with attribution)
const CURATED_PHOTOS = {
  'F&B': [
    { id: 'ZdF4QJWWcsg', author: 'Annie Spratt', authorUrl: 'https://unsplash.com/@anniespratt' },
    { id: 'jpkfc5_d-DI', author: 'Christiana Rivers', authorUrl: 'https://unsplash.com/@christianarivers' },
    { id: 'V41PulGL1H0', author: 'Demi DeHerrera', authorUrl: 'https://unsplash.com/@demidh' },
    { id: 'A-fubu9QJxE', author: 'Petr Sevcovic', authorUrl: 'https://unsplash.com/@sevcovic23' },
    { id: 'dp8sUNNFRqs', author: 'Toa Heftiba', authorUrl: 'https://unsplash.com/@heftiba' },
    { id: '4_jhDO54BYg', author: 'Brooke Lark', authorUrl: 'https://unsplash.com/@brookelark' },
  ],
  'Beauty & Wellness': [
    { id: 'fmAFMtUcfrs', author: 'Content Pixie', authorUrl: 'https://unsplash.com/@contentpixie' },
    { id: 'hsPFuudRg5I', author: 'Kelly Sikkema', authorUrl: 'https://unsplash.com/@kellysikkema' },
    { id: 'A4wCTjUKVKc', author: 'Brooke Lark', authorUrl: 'https://unsplash.com/@brookelark' },
    { id: 'Vw3y2K-6k9k', author: 'Sincerely Media', authorUrl: 'https://unsplash.com/@sincerelymedia' },
    { id: 'dkLbgLAKIo8', author: 'Mathilde Langevin', authorUrl: 'https://unsplash.com/@mathildelangevin' },
    { id: 'pdMKDirf-vc', author: 'Anna Pelzer', authorUrl: 'https://unsplash.com/@annapelzer' },
  ],
  'Fashion': [
    { id: 'I_LgQ8JZFGE', author: 'Tamara Bellis', authorUrl: 'https://unsplash.com/@tamarabellis' },
    { id: 'NEJcmvLFcws', author: 'Tamara Bellis', authorUrl: 'https://unsplash.com/@tamarabellis' },
    { id: 'PZQiVD7lnoU', author: 'Sandro Schuh', authorUrl: 'https://unsplash.com/@sandroschuh' },
    { id: 'Imc-IoZDMXc', author: 'Hannah Morgan', authorUrl: 'https://unsplash.com/@hannahmorgan_' },
    { id: '6ywyo2qtaZ8', author: 'Thalia Tran', authorUrl: 'https://unsplash.com/@flossiest' },
    { id: 'M0AWNxnLaMw', author: 'Lily Banse', authorUrl: 'https://unsplash.com/@lvnatikk' },
  ],
  'Tech & SaaS': [
    { id: 'OqtafYT5kTw', author: 'Andrew Neel', authorUrl: 'https://unsplash.com/@andrewtneel' },
    { id: 'Rmy_DJ2Ub-w', author: 'Christopher Gower', authorUrl: 'https://unsplash.com/@cgower' },
    { id: '2EJCSULRwC8', author: 'Carl Heyerdahl', authorUrl: 'https://unsplash.com/@carlheyerdahl' },
    { id: 'wD1LRb9OeEo', author: 'Nathan Riley', authorUrl: 'https://unsplash.com/@nathananderson' },
    { id: 'bHlZX1D4I8g', author: 'Kelly Sikkema', authorUrl: 'https://unsplash.com/@kellysikkema' },
    { id: 'JKUTrJ4vK00', author: 'Kari Shea', authorUrl: 'https://unsplash.com/@karishea' },
  ],
  'Educație': [
    { id: 'sfL_QOnmy00', author: 'Tom Hermans', authorUrl: 'https://unsplash.com/@tomhermans' },
    { id: 'Oaqk7qqNh_c', author: 'Alex Block', authorUrl: 'https://unsplash.com/@alexblock' },
    { id: 'OQMZwNd3ThU', author: 'Kimberly Farmer', authorUrl: 'https://unsplash.com/@kimberlyfarmer' },
    { id: 'fH-FK2D11RQ', author: 'Susan Q Yin', authorUrl: 'https://unsplash.com/@syinq' },
    { id: 'OyCl7Y4y0Bk', author: 'Ben White', authorUrl: 'https://unsplash.com/@benwhitephotography' },
    { id: '5kZyD7xCkhQ', author: 'Cathryn Lavery', authorUrl: 'https://unsplash.com/@cathrynlavery' },
  ],
  'Education': [
    { id: 'sfL_QOnmy00', author: 'Tom Hermans', authorUrl: 'https://unsplash.com/@tomhermans' },
    { id: 'Oaqk7qqNh_c', author: 'Alex Block', authorUrl: 'https://unsplash.com/@alexblock' },
    { id: 'OQMZwNd3ThU', author: 'Kimberly Farmer', authorUrl: 'https://unsplash.com/@kimberlyfarmer' },
    { id: 'fH-FK2D11RQ', author: 'Susan Q Yin', authorUrl: 'https://unsplash.com/@syinq' },
    { id: 'OyCl7Y4y0Bk', author: 'Ben White', authorUrl: 'https://unsplash.com/@benwhitephotography' },
    { id: '5kZyD7xCkhQ', author: 'Cathryn Lavery', authorUrl: 'https://unsplash.com/@cathrynlavery' },
  ],
  'E-commerce': [
    { id: 'gMsnXqILjp4', author: 'Mediamodifier', authorUrl: 'https://unsplash.com/@mediamodifier' },
    { id: 'iusJ25iYu1c', author: 'Kelli McClintock', authorUrl: 'https://unsplash.com/@kelli_mcclintock' },
    { id: 'I-4lP4wlDLA', author: 'Joanna Kosinska', authorUrl: 'https://unsplash.com/@joannakosinska' },
    { id: 'b18TRXc8UPQ', author: 'Hello I\'m Nik', authorUrl: 'https://unsplash.com/@helloimnik' },
    { id: '5fNmWej4tAA', author: 'Paul Hanaoka', authorUrl: 'https://unsplash.com/@plhnk' },
    { id: 'gcsNOsPEXfs', author: 'Erol Ahmed', authorUrl: 'https://unsplash.com/@erol' },
  ],
  'Servicii': [
    { id: 'cckf4TsHAuw', author: 'Cytonn Photography', authorUrl: 'https://unsplash.com/@cytonn_photography' },
    { id: 'wBuPCQiweuA', author: 'Adeolu Eletu', authorUrl: 'https://unsplash.com/@adeolueletu' },
    { id: 'g1Kr4Ozfoac', author: 'LinkedIn Sales Solutions', authorUrl: 'https://unsplash.com/@linkedinsalesnavigator' },
    { id: 'kNSREmtaGOE', author: 'Krakenimages', authorUrl: 'https://unsplash.com/@krakenimages' },
    { id: 'OQMZwNd3ThU', author: 'Kimberly Farmer', authorUrl: 'https://unsplash.com/@kimberlyfarmer' },
    { id: 'p0j-mE6mGo4', author: 'Charles Forerunner', authorUrl: 'https://unsplash.com/@charlesforerunner' },
  ],
  'Services': [
    { id: 'cckf4TsHAuw', author: 'Cytonn Photography', authorUrl: 'https://unsplash.com/@cytonn_photography' },
    { id: 'wBuPCQiweuA', author: 'Adeolu Eletu', authorUrl: 'https://unsplash.com/@adeolueletu' },
    { id: 'g1Kr4Ozfoac', author: 'LinkedIn Sales Solutions', authorUrl: 'https://unsplash.com/@linkedinsalesnavigator' },
    { id: 'kNSREmtaGOE', author: 'Krakenimages', authorUrl: 'https://unsplash.com/@krakenimages' },
    { id: 'OQMZwNd3ThU', author: 'Kimberly Farmer', authorUrl: 'https://unsplash.com/@kimberlyfarmer' },
    { id: 'p0j-mE6mGo4', author: 'Charles Forerunner', authorUrl: 'https://unsplash.com/@charlesforerunner' },
  ],
  'Altele': [
    { id: 'Bd7gNnWJBkU', author: 'Jordan Madrid', authorUrl: 'https://unsplash.com/@jordanmadrid' },
    { id: 'qjnAnF0jIGk', author: 'Sincerely Media', authorUrl: 'https://unsplash.com/@sincerelymedia' },
    { id: 'iEEBWgY_6lA', author: 'Sergey Shmidt', authorUrl: 'https://unsplash.com/@bypaintbrush' },
    { id: 'AKw1nfdShyU', author: 'Ahmed Hasan', authorUrl: 'https://unsplash.com/@ahmedhasan_' },
    { id: 'AvqpKLHxYg8', author: 'Kelly Sikkema', authorUrl: 'https://unsplash.com/@kellysikkema' },
    { id: 'mEZ3PoFGs_k', author: 'Robert Bye', authorUrl: 'https://unsplash.com/@robertbye' },
  ],
  'Other': [
    { id: 'Bd7gNnWJBkU', author: 'Jordan Madrid', authorUrl: 'https://unsplash.com/@jordanmadrid' },
    { id: 'qjnAnF0jIGk', author: 'Sincerely Media', authorUrl: 'https://unsplash.com/@sincerelymedia' },
    { id: 'iEEBWgY_6lA', author: 'Sergey Shmidt', authorUrl: 'https://unsplash.com/@bypaintbrush' },
    { id: 'AKw1nfdShyU', author: 'Ahmed Hasan', authorUrl: 'https://unsplash.com/@ahmedhasan_' },
    { id: 'AvqpKLHxYg8', author: 'Kelly Sikkema', authorUrl: 'https://unsplash.com/@kellysikkema' },
    { id: 'mEZ3PoFGs_k', author: 'Robert Bye', authorUrl: 'https://unsplash.com/@robertbye' },
  ],
}

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export const generateMoodBoard = async ({ formData, onProgress }) => {
  if (onProgress) onProgress('analyzing')
  await new Promise(r => setTimeout(r, 400))

  if (onProgress) onProgress('composing')

  const industry = formData.industry
  const aesthetic = formData.aesthetic
  const photos = shuffle(CURATED_PHOTOS[industry] || CURATED_PHOTOS['Altele'] || CURATED_PHOTOS['Other']).slice(0, 6)
  const palette = PALETTES[aesthetic] || PALETTES['Minimalist']

  const images = photos.map(p => ({
    id: p.id,
    url: `https://images.unsplash.com/photo-${p.id}?auto=format&fit=crop&w=800&q=80`,
    thumbUrl: `https://images.unsplash.com/photo-${p.id}?auto=format&fit=crop&w=400&q=70`,
    largeUrl: `https://images.unsplash.com/photo-${p.id}?auto=format&fit=crop&w=1600&q=85`,
    author: p.author,
    authorUrl: p.authorUrl,
    sourceUrl: `https://unsplash.com/photos/${p.id}`,
  }))

  await new Promise(r => setTimeout(r, 600))
  if (onProgress) onProgress('finalizing')

  return {
    images,
    palette,
    industry,
    aesthetic,
    keywords: formData.keywords,
  }
}
