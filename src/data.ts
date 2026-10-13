// Edit these to make the page yours.
export const PRICE = '$249'
export const SHIP_DATE = 'Spring 2027'
export const AUTHOR = { name: 'Saqib Niazi', url: 'https://github.com/saqib-niaxi' }

// Footer icons — leave a value empty to hide that icon.
export const SOCIALS = {
  github: 'https://github.com/saqib-niaxi',
  linkedin: '',
  email: '',
}

export type Variant = {
  name: string
  short: string
  desc: string
  body: string
  hi: string
  shade: string
  tip: string
  a: string
  b: string
}

// Colour finishes — switching one re-tints the product (CSS and 3D) and the whole page glow.
export const VARIANTS = {
  midnight: {
    name: 'Midnight Black', short: 'Midnight',
    desc: 'Matte graphite with a violet-to-cyan halo. The original.',
    body: '#1C1C25', hi: '#55556A', shade: '#060609', tip: '#26262F', a: '#7C5CFF', b: '#00E0FF',
  },
  arctic: {
    name: 'Arctic White', short: 'Arctic',
    desc: 'Ceramic white, cool blue glow. Disappears in a crowd.',
    body: '#E3E6EE', hi: '#FFFFFF', shade: '#8E95A6', tip: '#C9CED9', a: '#6F8CFF', b: '#8FF0FF',
  },
  violet: {
    name: 'Violet Haze', short: 'Violet',
    desc: 'Deep lavender with a magenta afterglow. Made to be seen.',
    body: '#6450D2', hi: '#BBAAFF', shade: '#24185E', tip: '#5442B5', a: '#A45CFF', b: '#FF6BD6',
  },
} satisfies Record<string, Variant>

export type VariantId = keyof typeof VARIANTS
export const VARIANT_IDS = Object.keys(VARIANTS) as VariantId[]
