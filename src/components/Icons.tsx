import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const stroke = (children: ReactNode, size = 18) => (props: IconProps) => (
  <svg className="ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    {children}
  </svg>
)

const fill = (children: ReactNode, size = 14) => (props: IconProps) => (
  <svg className="icf" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
    {children}
  </svg>
)

export const ArrowRight = stroke(<path d="M5 12h14M13 6l6 6-6 6" />)
export const Menu = stroke(<path d="M4 9h16M4 15h16" />)
export const Close = stroke(<path d="M6 6l12 12M18 6L6 18" />)
export const Battery = stroke(<><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2" /><path d="M6 10v4M10 10v4" /></>, 32)
export const Wave = stroke(<path d="M3 12h1M7 8v8M11 4v16M15 8v8M19 11v2" />, 32)
export const Orbit = stroke(<><circle cx="12" cy="12" r="2.5" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="4" ry="10" /></>, 32)
export const Drop = stroke(<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />, 32)
export const Mail = stroke(<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 7l9 6 9-6" /></>)
export const LinkedIn = stroke(<><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" /></>)
export const GitHub = stroke(<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />)

export const Play = fill(<path d="M7 4v16l13-8z" />)
export const Pause = fill(<path d="M6 4h4v16H6zM14 4h4v16h-4z" />)
