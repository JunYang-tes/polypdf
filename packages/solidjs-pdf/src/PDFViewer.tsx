import { Show, type JSX, type ParentProps } from 'solid-js'
import { BlobProvider } from './BlobProvider'

export interface PDFViewerProps {
  width?: number | string
  height?: number | string
  style?: string | JSX.CSSProperties
  className?: string
  showToolbar?: boolean
  loading?: JSX.Element
  error?: (error: unknown) => JSX.Element
}

export const PDFViewer = (props: ParentProps<PDFViewerProps>) => {
  return (
    <BlobProvider document={props.children}>
      {({ url, error }) => {
        if (error) {
          console.error('Failed to generate PDF:', error)
          return props.error ? props.error(error) : null
        }
        return (
          <Show when={url} fallback={props.loading}>
            <iframe
              src={props.showToolbar ? `${url}#toolbar=1` : url!}
              style={props.style}
            />
          </Show>
        )
      }}
    </BlobProvider>
  )
}
