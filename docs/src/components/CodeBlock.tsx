import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n/dict'
import type { CodeEntry } from '../content'
import './code-block.css'

/** Bloque de código pre-resaltado (Shiki en build) con botón de copiar. */
export function CodeBlock({ entry }: { entry: CodeEntry }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>()

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const onCopy = async () => {
    await navigator.clipboard.writeText(entry.code)
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="docs-code">
      <button type="button" className="docs-copy" onClick={onCopy}>
        {copied ? t.copied : t.copy}
      </button>
      {/* HTML generado por Shiki en build time a partir de archivos del repo. */}
      <div className="docs-code-scroll" dangerouslySetInnerHTML={{ __html: entry.html }} />
    </div>
  )
}
