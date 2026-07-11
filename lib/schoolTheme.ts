// Per-school theming for the 3 beachhead schools. Front-end only, no DB migration.
// The school (color, monogram, name) is the hero: a scoped link re-dresses the app.
//
// DECISION FOR DYLAN: the hexes below are PLACEHOLDERS in the right family
// (SJR Green Knights = green + gold, Don Bosco Ironmen = dark green + silver,
// Bergen Catholic Crusaders = crimson + gold). Confirm the exact shades.
// SJR and Don Bosco are both green, so they are deliberately pushed apart:
// SJR = brighter forest green with GOLD, DBP = near-black pine with SILVER.

export type SchoolTheme = {
  code: string
  monogram: string
  shortName: string      // how a parent says it: "SJR"
  fullName: string       // marketing name: "St. Joseph Regional"
  dbName: string         // exact schools.name in the DB
  dbId: string           // schools.id in prod (name match is the fallback)
  town: string
  mascot: string
  primary: string        // the school color: hero band, patch, buttons
  primaryDark: string    // pressed / gradient end
  accent: string         // gold or silver: proof numbers, highlights
  accentInk: string      // readable text ON the accent
  wash: string           // very light tint for page sections
  ink: string            // dark text on the wash
}

export const SITE_URL = 'https://uniformpass.shop'

export const SCHOOL_THEMES: Record<string, SchoolTheme> = {
  sjr: {
    code: 'sjr',
    monogram: 'SJR',
    shortName: 'SJR',
    fullName: 'St. Joseph Regional',
    dbName: 'St. Joseph Regional High School',
    dbId: '2d1b3d72-d736-494a-b459-485cd2c13407',
    town: 'Montvale, NJ',
    mascot: 'Green Knights',
    primary: '#0E4D2C',
    primaryDark: '#093A20',
    accent: '#E3B23C',
    accentInk: '#3A2B06',
    wash: '#EDF4EF',
    ink: '#0A2E1B',
  },
  dbp: {
    code: 'dbp',
    monogram: 'DBP',
    shortName: 'Don Bosco',
    fullName: 'Don Bosco Prep',
    dbName: 'Don Bosco Prep',
    dbId: 'eb333a9c-e42e-4e42-a675-f6ea4b1b5c2a',
    town: 'Ramsey, NJ',
    mascot: 'Ironmen',
    primary: '#132E23',
    primaryDark: '#0C2018',
    accent: '#C7CFD6',
    accentInk: '#1B242B',
    wash: '#EDF1EF',
    ink: '#10241C',
  },
  bc: {
    code: 'bc',
    monogram: 'BC',
    shortName: 'Bergen Catholic',
    fullName: 'Bergen Catholic',
    dbName: 'Bergen Catholic High School',
    dbId: '2773881e-9063-4b78-acc6-87014eb73522',
    town: 'Oradell, NJ',
    mascot: 'Crusaders',
    primary: '#7A1E2D',
    primaryDark: '#5C1622',
    accent: '#E3B23C',
    accentInk: '#3A2B06',
    wash: '#F7EEEC',
    ink: '#4A1219',
  },
}

export const SCHOOL_CODES = ['sjr', 'dbp', 'bc'] as const

export function getTheme(code: string | null | undefined): SchoolTheme | null {
  if (!code) return null
  return SCHOOL_THEMES[code.toLowerCase().trim()] || null
}

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/\bsaint\b/g, 'st').replace(/[.,'’\-]/g, '').replace(/\s+/g, ' ').trim()
}

export function themeForSchoolName(name: string | null | undefined): SchoolTheme | null {
  if (!name) return null
  const n = normalizeName(name)
  for (const t of Object.values(SCHOOL_THEMES)) {
    if (normalizeName(t.dbName) === n || normalizeName(t.fullName) === n) return t
  }
  return null
}

export function themeForSchoolId(id: string | null | undefined): SchoolTheme | null {
  if (!id) return null
  return Object.values(SCHOOL_THEMES).find(t => t.dbId === id) || null
}

// The link Dylan shares / the QR target: short, human, school-scoped.
export function scopedPath(code: string): string {
  return `/s/${code}`
}

export function scopedUrl(code: string): string {
  return `${SITE_URL}${scopedPath(code)}`
}
