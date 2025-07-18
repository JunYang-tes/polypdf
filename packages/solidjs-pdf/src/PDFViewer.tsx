import { Show, type JSX, type ParentProps } from 'solid-js'
import { BlobProvider } from './BlobProvider'

export interface PDFViewerProps {
  width?: number | string
  height?: number | string
  style?: string | JSX.CSSProperties
  className?: string
  showToolbar?: boolean
}

export const PDFViewer = (props: ParentProps<PDFViewerProps>) => {
  return (
    <BlobProvider document={props.children}>
      {({ url }) => {
        return (
          <Show when={url} fallback={<div>Loading...{url}</div>}>
            <iframe
              src={props.showToolbar ? `${url}#toolbar=1` : url}
              style={props.style}
            />
          </Show>
        )
      }}
    </BlobProvider>
  )
}
