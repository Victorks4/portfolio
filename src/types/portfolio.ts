export type PortfolioMeta = {
  title: string
  description: string
  author: string
  themeColor: string
  robots: string
  ogType: string
  ogTitle: string
  ogDescription: string
}

export type NavItem = {
  label: string
  href: string
}

export type SkillItem = {
  name: string
  /** SVG path `d` for monochrome icon */
  iconD: string
}

export type SkillCategory = {
  category: string
  items: SkillItem[]
}

export type Project = {
  title: string
  role: string
  description: string
  tech: string[]
  link: string
  color: string
  shapeClass: 'shape-bellabot' | 'shape-smartkey' | 'shape-mecnexa' | 'shape-pontify'
}

export type TimelineEntry = {
  year: string
  title: string
  description: string
}

export type SocialNetwork = 'github' | 'linkedin'

export type SocialLink = {
  label: string
  href: string
  network: SocialNetwork
}

export type Portfolio = {
  meta: PortfolioMeta
  brand: {
    navLogo: string
    footerWatermark: string
    loaderBrand: string
  }
  navigation: NavItem[]
  hero: {
    greeting: string
    /** Lines rendered inside one semantic `h1` */
    nameLines: [string, string]
    subtitle: string
    description: string
    portraitSrc: string
    portraitAlt: string
    portraitFallbackSrc: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
  }
  about: {
    sectionNumber: string
    sectionTitle: string
    codeLines: string[]
    paragraphs: { text: string; highlights?: string[] }[]
    stats: { value: number; label: string }[]
  }
  skills: {
    sectionNumber: string
    sectionTitle: string
    categories: SkillCategory[]
  }
  projects: {
    sectionNumber: string
    sectionTitle: string
    items: Project[]
  }
  timeline: {
    sectionNumber: string
    sectionTitle: string
    entries: TimelineEntry[]
  }
  contact: {
    sectionNumber: string
    titleLine1: string
    titleLine2Outline: string
    email: string
    socials: SocialLink[]
    footerCopyright: string
    footerTechNote: string
  }
  preloaderLogs: string[]
}
