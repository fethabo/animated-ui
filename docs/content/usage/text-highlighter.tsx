import { TextHighlighter } from '@fethabo/animated-ui/text-highlighter'

export function Example() {
  return (
    <p>
      This word is{' '}
      <TextHighlighter shape="underline" color="#7c3aed">
        important
      </TextHighlighter>
      .
    </p>
  )
}
