import { Link } from 'react-router-dom'
import { AnimatedBackground } from '@fethabo/animated-ui/animated-background'
import { SpotlightCard } from '@fethabo/animated-ui/spotlight-card'
import { ShinyText } from '@fethabo/animated-ui/shiny-text'
import { categories, componentsByCategory, components } from '../registry'
import { useLang, useT } from '../i18n/dict'
import { useSeo } from '../seo'
import './home-page.css'

/**
 * Home/galería. Dogfooding deliberado: el hero usa AnimatedBackground y las
 * cards de categoría son SpotlightCard — la docs es en sí misma una demo.
 */
export function HomePage() {
  const lang = useLang()
  const t = useT()

  useSeo({
    title: `animated-ui — ${t.siteTagline}`,
    description: t.homeHeroSubtitle,
    path: '',
    lang,
  })

  return (
    <main className="docs-home">
      <section className="docs-hero">
        <AnimatedBackground variant="aurora" className="docs-hero-bg" />
        <div className="docs-hero-inner">
          <h1>
            <ShinyText color="#e8e8f0" highlight="#7c3aed">{t.homeHeroTitle}</ShinyText>
          </h1>
          <p>{t.homeHeroSubtitle}</p>
          <p className="docs-hero-count">{t.homeComponentsCount(components.length)}</p>
        </div>
      </section>

      <section className="docs-gallery">
        {categories.map((category) => {
          const items = componentsByCategory(category)
          if (items.length === 0) return null
          return (
            <SpotlightCard key={category} className="docs-category-card">
              <h2>{t.categories[category]}</h2>
              <ul>
                {items.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/${lang}/components/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          )
        })}
      </section>
    </main>
  )
}
