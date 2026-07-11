// Retail price estimates for the "You save $X" price-slash.
// TUNABLE: these are illustrative store-price ballparks, no seller input.
// Dylan sets the real numbers. Keyword match refines the per-category floor.

const CATEGORY_RETAIL: Record<string, number> = {
  uniform: 80,
  sport: 45,
  spirit: 40,
  alumni: 40,
}

const KEYWORD_RETAIL: Array<[RegExp, number]> = [
  [/blazer|sport ?coat|suit|jacket/i, 120],
  [/sweater|cardigan|quarter.?zip|fleece/i, 65],
  [/pant|trouser|slack|khaki/i, 55],
  [/hoodie|sweatshirt|crewneck/i, 55],
  [/polo|oxford|dress shirt|button/i, 45],
  [/short/i, 40],
  [/gym|pe /i, 35],
  [/tie|belt/i, 25],
]

export function retailEstimate(itemType: string, category: string): number | null {
  for (const [re, price] of KEYWORD_RETAIL) {
    if (re.test(itemType)) return price
  }
  return CATEGORY_RETAIL[category] ?? null
}

// Returns the slash data only when the deal is real: a known retail ballpark
// and at least $10 saved. Otherwise show nothing rather than a weak chip.
export function priceSlash(
  price: number,
  itemType: string,
  category: string,
): { retail: number; save: number } | null {
  const retail = retailEstimate(itemType, category)
  if (retail === null) return null
  const save = retail - price
  if (save < 10) return null
  return { retail, save }
}
