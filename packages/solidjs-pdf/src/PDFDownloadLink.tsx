import { type Component, type JSX } from 'solid-js'
import { BlobProvider } from './BlobProvider'

interface PDFDownloadLinkProps {
  fileName: string
  document: JSX.Element
  class?: string
  style?: string | JSX.CSSProperties | undefined
  children?:
    | JSX.Element
    | ((props: { loading: boolean; error: unknown }) => JSX.Element)
}

export const PDFDownloadLink: Component<PDFDownloadLinkProps> = (props) => {
  return (
    <BlobProvider document={props.document}>
      {({ url, loading, error }) => {
        if (error) {
          console.error('Failed to generate PDF:', error)
        }

        const renderContent = () => {
          if (typeof props.children === 'function') {
            return props.children({
              loading,
              error,
            })
          }
          return props.children || 'Download'
        }

        return (
          <a
            href={!loading && url ? url : '#'}
            download={props.fileName}
            aria-disabled={loading}
            class={props.class}
            style={props.style}
          >
            {renderContent()}
          </a>
        )
      }}
    </BlobProvider>
  )
}
