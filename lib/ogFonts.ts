// Real Inter weights for every ImageResponse (satori) route. The bundled
// default font has no true bold/black, and the shareable assets are exactly
// where "big is the brand" has to actually look big.

export async function loadOgFonts() {
  const [regular, bold, black] = await Promise.all([
    fetch(new URL('../app/fonts/inter-400.woff', import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL('../app/fonts/inter-700.woff', import.meta.url)).then(r => r.arrayBuffer()),
    fetch(new URL('../app/fonts/inter-900.woff', import.meta.url)).then(r => r.arrayBuffer()),
  ])
  return [
    { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Inter', data: black, weight: 900 as const, style: 'normal' as const },
  ]
}
