import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import pkg from '../../../package.json'
import { categories, components } from '../registry'
import { useLang, useT } from '../i18n/dict'
import { persistLang, LANGS } from '../i18n/lang'
import './layout.css'

const REPO_URL = 'https://github.com/fethabo/animated-ui'

function Header() {
  const lang = useLang()
  const t = useT()
  const location = useLocation()

  return (
    <header className="docs-header">
      <Link to={`/${lang}`} className="docs-logo">
        <span className="docs-logo-mark">◆</span> animated-ui
        <span className="docs-version">v{pkg.version}</span>
      </Link>
      <span className="docs-tagline">{t.siteTagline}</span>
      <nav className="docs-header-actions">
        <div className="docs-lang-switch" role="group" aria-label="Language">
          {LANGS.map((code) => {
            // Cambia el prefijo de idioma conservando la vista actual.
            const rest = location.pathname.replace(/^\/(es|en)/, '')
            return (
              <NavLink
                key={code}
                to={`/${code}${rest}`}
                onClick={() => persistLang(code)}
                className={code === lang ? 'active' : ''}
              >
                {code.toUpperCase()}
              </NavLink>
            )
          })}
        </div>
        <a href={REPO_URL} target="_blank" rel="noreferrer" title={t.onGitHub}>
          GitHub ↗
        </a>
      </nav>
    </header>
  )
}

function Sidebar() {
  const lang = useLang()
  const t = useT()
  const { slug } = useParams()
  const [filter, setFilter] = useState('')

  const visible = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return components
    return components.filter(
      (c) => c.name.toLowerCase().includes(query) || c.slug.includes(query),
    )
  }, [filter])

  return (
    <aside className="docs-sidebar">
      <input
        type="search"
        className="docs-filter"
        placeholder={t.searchPlaceholder}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label={t.searchPlaceholder}
      />
      <nav>
        {categories.map((category) => {
          const items = visible.filter((c) => c.category === category)
          if (items.length === 0) return null
          return (
            <section key={category} className="docs-sidebar-group">
              <h3>{t.categories[category]}</h3>
              <ul>
                {items.map((c) => (
                  <li key={c.slug}>
                    <NavLink
                      to={`/${lang}/components/${c.slug}`}
                      className={c.slug === slug ? 'active' : ''}
                    >
                      {c.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </nav>
    </aside>
  )
}

export function Layout() {
  return (
    <div className="docs-shell">
      <Header />
      <div className="docs-body">
        <Sidebar />
        <div className="docs-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
