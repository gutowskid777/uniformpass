import { type SchoolTheme, scopedUrl, SITE_URL } from './schoolTheme'

// Paste-ready messages for a WhatsApp / Facebook parent group.
// Human, first-person, no slop. "..." or "." only, never an em-dash.

export function buyMessage(theme: SchoolTheme | null): string {
  if (theme) {
    const s = theme.shortName
    return `Buy and sell used ${s} uniforms with other ${s} families. No fees, no shipping, you just meet up locally. ${scopedUrl(theme.code)}`
  }
  return `Buy and sell used school uniforms with other families. No fees, no shipping, you just meet up locally. ${SITE_URL}`
}

export function sellMessage(theme: SchoolTheme | null): string {
  if (theme) {
    const s = theme.shortName
    return `Got a pile of outgrown ${s} uniforms? They pick it up, sell it for you, and send you half. You do nothing. ${scopedUrl(theme.code)}`
  }
  return `Got a pile of outgrown school uniforms? They pick it up, sell it for you, and send you half. You do nothing. ${SITE_URL}/sell-for-me`
}

export function listingMessage(opts: {
  id: string
  itemType: string
  price: number
  schoolShort: string
}): string {
  const priceLabel = opts.price === 0 ? 'Free' : `$${opts.price}`
  return `${priceLabel} for a ${opts.itemType} at ${opts.schoolShort}. No fees, you just meet up locally. ${SITE_URL}/listing/${opts.id}`
}
