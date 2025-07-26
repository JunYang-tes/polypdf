import { type ComponentChild, type VNode } from 'preact'
import { BlobProvider } from './BlobProvider'

export interface PDFViewerProps {
  width?: number | string
  height?: number | string
  style?: VNode<any>['props']['style']
  className?: string
  showToolbar?: boolean
  children?: ComponentChild
  loading?: VNode<any>
  error?: (error: unknown) => VNode<any>
}

export const PDFViewer = (props: PDFViewerProps) => {
  return (
    <BlobProvider document={props.children as VNode<any>}>
      {({ url, loading, error }) => {
        if (loading) {
          return props.loading || null
        }
        if (error) {
          console.error('Failed to generate PDF:', error)
          return props.error ? props.error(error) : null
        }
        if (!url) {
          return null
        }
        return (
          <iframe
            src={props.showToolbar ? `${url}#toolbar=1` : url}
            style={props.style}
            className={props.className}
            width={props.width}
            height={props.height}
          />
        )
      }}
    </BlobProvider>
  )
}
