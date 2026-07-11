import { type SchoolTheme, scopedUrl, SITE_URL } from './schoolTheme'

// Paste-ready messages for a WhatsApp / Facebook parent group.
// Human, first-person, no slop. "..." or "." only, never an em-dash.

export function buyMessage(theme: SchoolTheme | null): string {
  if (theme) {
    const s = theme.shortName
    return `${s} families... found this instead of paying full price for uniforms. It's a spot to buy and sell used ${s} uniforms locally. No fees, no shipping, you just meet up. Worth a look before the next growth spurt. ${scopedUrl(theme.code)}`
  }
  return `Found this instead of paying full price for school uniforms. Parents buy and sell used uniforms locally... no fees, no shipping, you just meet up. Worth a look before the next growth spurt. ${SITE_URL}`
}

export function sellMessage(theme: SchoolTheme | null): string {
  if (theme) {
    const s = theme.shortName
    return `If you've got a pile of outgrown ${s} uniforms, this service picks them up, sells them for you, and you keep 50%. Zero effort on your end. Beats the donation bin. ${scopedUrl(theme.code)}`
  }
  return `If you've got a pile of outgrown school uniforms, this service picks them up, sells them for you, and you keep 50%. Zero effort on your end. Beats the donation bin. ${SITE_URL}/sell-for-me`
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
