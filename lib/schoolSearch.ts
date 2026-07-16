import type { School } from './supabase'

// Fuzzy school matching so parents find their school however they type it:
// "saint joseph" / "st. joseph" / "sjr" all hit St. Joseph Regional, "aha" hits
// Academy of Holy Angels, "bosco" hits Don Bosco, etc.

// Nicknames that acronyms/name-substring won't catch on their own.
// Keys are matched after normalize(), so write them however reads best.
const ALIASES: Record<string, string[]> = {
  'st. joseph regional high school': ['sjr', 'st joes', 'st joe', 'joes'],
  'bergen catholic high school': ['bc', 'bergen'],
  'don bosco prep': ['dbp', 'bosco'],
  'academy of holy angels': ['aha', 'holy angels', 'angels'],
  'immaculate heart academy': ['iha', 'immaculate heart'],
  'paramus catholic high school': ['pc', 'paramus catholic'],
  'seton hall prep': ['shp', 'seton'],
  "saint peter's prep": ['spp', 'st peters', 'peters', 'peters prep'],
  'delbarton school': ['delbarton'],
  'pope john xxiii high school': ['pope john', 'pj'],
  'mary help of christians academy': ['mhc', 'mary help'],
  'albertus magnus high school': ['albertus', 'magnus'],
  'st. anthony school': ['st ants', 'ants'],
}

const ACRONYM_STOPWORDS = new Set(['of', 'the', 'and', 'at', 'high', 'school'])

// lowercase, saint→st, drop punctuation, collapse whitespace
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bsaint\b/g, 'st')
    .replace(/[.,'’\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function acronym(name: string): string {
  return normalize(name)
    .split(' ')
    .filter(t => t && !ACRONYM_STOPWORDS.has(t))
    .map(t => t[0])
    .join('')
}

// The lookup is keyed by the NORMALIZED name, because that's what we compare
// against. Keying off the raw strings above silently missed every entry whose
// name carried punctuation ("st. joseph..." normalizes to "st joseph...").
const ALIAS_LOOKUP: Record<string, string[]> = Object.fromEntries(
  Object.entries(ALIASES).map(([name, aliases]) => [normalize(name), aliases]),
)

export function searchSchools(schools: School[], query: string): School[] {
  const nq = normalize(query)
  if (!nq) return schools
  const nqTight = nq.replace(/\s+/g, '')
  return schools.filter(s => {
    const nName = normalize(s.name)
    if (nName.includes(nq)) return true
    const acr = acronym(s.name)
    if (nqTight.length >= 2 && acr.startsWith(nqTight)) return true
    const aliases = ALIAS_LOOKUP[nName] || []
    return aliases.some(a => normalize(a).includes(nq))
  })
}
