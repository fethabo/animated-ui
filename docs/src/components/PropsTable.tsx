import { useT } from '../i18n/dict'
import type { PropDoc } from '../content'
import './props-table.css'

/** Renderiza descripciones con `código` inline (único markdown permitido en JSDoc). */
function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  const t = useT()
  return (
    <div className="docs-props-wrap">
      <table className="docs-props">
        <thead>
          <tr>
            <th>{t.propName}</th>
            <th>{t.propType}</th>
            <th>{t.propDefault}</th>
            <th>{t.propDescription}</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required && <span className="docs-required">{t.required}</span>}
              </td>
              <td>
                <code className="docs-type">{prop.type}</code>
              </td>
              <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : t.noDefault}</td>
              <td>
                <InlineCode text={prop.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
