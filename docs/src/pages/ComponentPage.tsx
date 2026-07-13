import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { componentBySlug, components } from '../registry'
import { codeFor, demoModules, proseFor, propsFor } from '../content'
import type { CodeEntry, DemoModule, ProseEntry } from '../content'
import { useLang, useT } from '../i18n/dict'
import { CodeBlock } from '../components/CodeBlock'
import { PropsTable } from '../components/PropsTable'
import './component-page.css'

type Tab = 'usage' | 'example'

function useAsync<T>(factory: () => Promise<T>, deps: unknown[]): T | undefined {
  const [value, setValue] = useState<T>()
  useEffect(() => {
    let cancelled = false
    setValue(undefined)
    factory().then((v) => {
      if (!cancelled) setValue(v)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return value
}

export function ComponentPage() {
  const { slug } = useParams()
  const lang = useLang()
  const t = useT()
  const entry = componentBySlug(slug)
  const [tab, setTab] = useState<Tab>('usage')

  const prose = useAsync<ProseEntry | undefined>(
    () => (entry ? proseFor(entry.slug, lang) : Promise.resolve(undefined)),
    [entry?.slug, lang],
  )
  const code = useAsync<{ example?: CodeEntry; usage?: CodeEntry }>(
    () => (entry ? codeFor(entry.slug) : Promise.resolve({})),
    [entry?.slug],
  )

  // Demo lazy: solo se descarga el módulo de esta vista. `demoLayout` se lee
  // del módulo cargado; el componente se envuelve en React.lazy.
  const loader = entry ? demoModules[`./demos/${entry.slug}.tsx`] : undefined
  const Demo = useMemo(
    () => (loader ? lazy(loader as () => Promise<{ default: ComponentType }>) : null),
    [loader],
  )
  const demoMeta = useAsync<DemoModule | undefined>(
    () => (loader ? (loader() as Promise<DemoModule>) : Promise.resolve(undefined)),
    [loader],
  )
  const demoFlow = demoMeta?.demoLayout === 'flow'

  useEffect(() => {
    setTab('usage')
    window.scrollTo(0, 0)
  }, [slug])

  if (!entry) {
    return (
      <main>
        <h1>{t.notFoundTitle}</h1>
        <p>{t.notFoundBody}</p>
      </main>
    )
  }

  const index = components.findIndex((c) => c.slug === entry.slug)
  const prev = components[index - 1]
  const next = components[index + 1]
  const props = propsFor(entry.slug, lang)
  const activeCode = tab === 'usage' ? code?.usage : code?.example

  return (
    <main className="docs-component">
      <header className="docs-component-head">
        <p className="docs-crumb">{t.categories[entry.category]}</p>
        <h1>{prose?.title ?? entry.name}</h1>
        {prose && <p className="docs-lead">{prose.description}</p>}
      </header>

      {Demo && (
        <section
          aria-label={t.demo}
          className={demoFlow ? 'docs-demo docs-demo--flow' : 'docs-demo'}
        >
          <Suspense fallback={<div className="docs-demo-loading" />}>
            <Demo />
          </Suspense>
        </section>
      )}

      {code && (code.usage || code.example) && (
        <section>
          <h2>{t.examples}</h2>
          <div className="docs-tabs" role="tablist">
            {code.usage && (
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'usage'}
                className={tab === 'usage' ? 'active' : ''}
                onClick={() => setTab('usage')}
              >
                {t.usageTab}
              </button>
            )}
            {code.example && (
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'example'}
                className={tab === 'example' ? 'active' : ''}
                onClick={() => setTab('example')}
              >
                {t.standaloneTab}
              </button>
            )}
          </div>
          {activeCode && <CodeBlock entry={activeCode} />}
        </section>
      )}

      {props.length > 0 && (
        <section>
          <h2>{t.props}</h2>
          <PropsTable props={props} />
        </section>
      )}

      {/* Prosa: características, CSS custom properties, limitaciones. */}
      {prose && (
        <section
          className="docs-prose"
          dangerouslySetInnerHTML={{ __html: prose.html }}
        />
      )}

      <nav className="docs-pager">
        {prev ? (
          <Link to={`/${lang}/components/${prev.slug}`}>← {prev.name}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/${lang}/components/${next.slug}`}>{next.name} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
