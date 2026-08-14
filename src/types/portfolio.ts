export type PortfolioMeta = {
  title: string
  description: string
  author: string
  themeColor: string
  robots: string
  ogType: string
  ogTitle: string
  ogDescription: string
  ogImage?: string
  siteUrl?: string
}

export type NavItem = {
  label: string
  href: string
}

export type SkillItem = {
  name: string
  /** SVG path `d` for monochrome icon */
  iconD: string
  /** Projetos onde a tecnologia foi usada de verdade — prova em vez de autodeclaração. */
  usedIn?: string[]
}

export type SkillCategory = {
  category: string
  items: SkillItem[]
}

export type ProjectSlug = 'bellabot' | 'smart-key' | 'pontify' | 'origyn'

export type ProjectShape =
  | 'shape-bellabot'
  | 'shape-smartkey'
  | 'shape-pontify'
  | 'shape-origyn'

export type ProjectStatus =
  | 'Em produção'
  | 'Em desenvolvimento'
  | 'Concluído'

export type ProjectGalleryImage = {
  src: string
  alt: string
  caption?: string
}

export type ProjectFeature = {
  title: string
  description: string
}

export type ProjectChallenge = {
  title: string
  description: string
}

export type ProjectResult = {
  value: string
  label: string
}

export type ProjectStackGroup = {
  category: string
  items: string[]
}

export type ProjectDetail = {
  tagline: string
  year: string
  status: ProjectStatus
  /** Onde o projeto nasceu e para quem. */
  context: string
  /** O problema concreto que existia antes. */
  problem: string
  /** O que foi construído para resolver. */
  solution: string
  features: ProjectFeature[]
  /** Decisões técnicas em bullets curtos. */
  architecture: string[]
  challenges: ProjectChallenge[]
  results?: ProjectResult[]
  gallery: ProjectGalleryImage[]
  stack: ProjectStackGroup[]
  repoUrl?: string
  liveUrl?: string
}

export type Project = {
  slug: ProjectSlug
  title: string
  role: string
  highlight?: string
  description: string
  tech: string[]
  color: string
  shapeClass: ProjectShape
  imageSrc?: string
  /** Opacidade do screenshot no card (0–1). Padrão CSS: 0.35 */
  imageOpacity?: number
  detail: ProjectDetail
}

export type TimelineEntry = {
  year: string
  title: string
  description: string
  /** Empresa ou instituição — recrutador procura por isso. */
  organization?: string
  /** Cargo formal exercido no período. */
  role?: string
  /** Período legível, ex: "Jan 2026 a hoje". */
  period?: string
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
    /** CTA destacado na navbar. */
    navCta: NavItem
  }
  navigation: NavItem[]
  hero: {
    greeting: string
    /** Lines rendered inside one semantic `h1` */
    nameLines: [string, string]
    subtitle: string
    description: string
    portraitSrc: string
    portraitWebpSrc?: string
    portraitAlt: string
    portraitFallbackSrc: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    /** Selo de disponibilidade exibido acima do nome. */
    availability?: string
    /** Cidade e modelo de trabalho. */
    location?: string
    /** Caminho do CV em PDF dentro de `public/`. */
    cvHref?: string
    cvLabel?: string
    scrollLabel?: string
  }
  about: {
    sectionNumber: string
    sectionTitle: string
    codeLines: string[]
    paragraphs: { text: string; highlights?: string[] }[]
    stats: { value: number; label: string; suffix?: string }[]
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
    /** Link wa.me já formatado. */
    whatsappHref?: string
    whatsappLabel?: string
    availability?: string
    responseTime?: string
    cvHref?: string
    cvLabel?: string
  }
  preloaderLogs: string[]
}
