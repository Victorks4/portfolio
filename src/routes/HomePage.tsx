import { Helmet } from 'react-helmet-async'
import { useMemo } from 'react'
import { portfolio } from '../data/portfolio'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Skills } from '../components/sections/Skills'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import { Timeline } from '../components/sections/Timeline'
import { ContactSection } from '../components/sections/ContactSection'
import { usePortfolioAnimations } from '../hooks/usePortfolioAnimations'
import { useShellContext } from '../hooks/useShellContext'
import { absoluteUrl } from '../utils/siteUrl'

export function HomePage() {
  const { introReady, morphApiRef } = useShellContext()

  usePortfolioAnimations({ introReady, morphApiRef })

  const structuredData = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            name: portfolio.meta.author,
            url: portfolio.meta.siteUrl,
            email: portfolio.contact.email,
            jobTitle: 'Desenvolvedor Full Stack',
            address: portfolio.hero.location
              ? {
                  '@type': 'PostalAddress',
                  addressLocality: portfolio.hero.location,
                }
              : undefined,
            sameAs: portfolio.contact.socials.map((s) => s.href),
          },
          {
            '@type': 'WebSite',
            name: portfolio.brand.loaderBrand,
            url: portfolio.meta.siteUrl,
            description: portfolio.meta.description,
          },
        ],
      }),
    [],
  )

  return (
    <>
      <Helmet>
        <title>{portfolio.meta.title}</title>
        <meta name="description" content={portfolio.meta.description} />
        <meta name="author" content={portfolio.meta.author} />
        <meta name="theme-color" content={portfolio.meta.themeColor} />
        <meta name="robots" content={portfolio.meta.robots} />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:type" content={portfolio.meta.ogType} />
        <meta property="og:title" content={portfolio.meta.ogTitle} />
        <meta
          property="og:description"
          content={portfolio.meta.ogDescription}
        />
        <meta property="og:url" content={absoluteUrl('/')} />
        {portfolio.meta.ogImage ? (
          <meta property="og:image" content={absoluteUrl(portfolio.meta.ogImage)} />
        ) : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={portfolio.meta.ogTitle} />
        <meta
          name="twitter:description"
          content={portfolio.meta.ogDescription}
        />
        {portfolio.meta.ogImage ? (
          <meta
            name="twitter:image"
            content={absoluteUrl(portfolio.meta.ogImage)}
          />
        ) : null}
        <script type="application/ld+json">{structuredData}</script>
      </Helmet>

      <Hero data={portfolio.hero} />
      <About data={portfolio.about} />
      <Skills data={portfolio.skills} />
      <ProjectGallery data={portfolio.projects} />
      <Timeline data={portfolio.timeline} />
      <ContactSection
        data={portfolio.contact}
        watermark={portfolio.brand.footerWatermark}
      />
    </>
  )
}
