import { generatePdf } from 'polypdf-core'
import { type VNode } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

interface BlobProviderProps {
  document: VNode<any>
  children: (props: {
    blob: Blob | null
    url: string | null
    loading: boolean
    error: Error | null
  }) => VNode<any> | null
}

export const BlobProvider = (props: BlobProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    setLoading(true)
    setError(null)

    const doc = containerRef.current.firstChild as HTMLElement
    if (!doc) {
      console.warn('No document found.')
      return
    }

    const gen = generatePdf(doc, {
      onStart: () => {
        setLoading(true)
      },
      onBlob: (generatedBlob) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
        setUrl(URL.createObjectURL(generatedBlob))
        setBlob(generatedBlob)
        setLoading(false)
      },
      onError: (err) => {
        setError(err as Error)
        setLoading(false)
      },
    })

    return () => {
      gen.dispose()
    }
  }, [props.document])

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return (
    <>
      <div ref={containerRef} style={{ display: 'none' }}>
        {props.document}
      </div>
      {props.children({ blob, url, loading, error })}
    </>
  )
}
