import {
  createSignal,
  createEffect,
  onCleanup,
  children,
  type JSX,
} from 'solid-js'
import { generatePdf } from 'polypdf-core'

interface BlobProviderProps {
  document: JSX.Element
  children: (props: {
    blob: Blob | null
    url: string | null
    loading: boolean
    error: Error | null
  }) => JSX.Element
}

export const BlobProvider = (props: BlobProviderProps) => {
  let containerRef: HTMLDivElement | undefined

  const [blob, setBlob] = createSignal<Blob | null>(null)
  const [url, setUrl] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<Error | null>(null)

  createEffect(() => {
    if (!containerRef) return

    setLoading(true)
    setError(null)

    const doc = containerRef.firstChild as HTMLElement
    if (!doc) {
      console.warn('No document found.')
      return
    }

    const gen = generatePdf(doc, {
      onBlob: (generatedBlob) => {
        setBlob(generatedBlob)
        const currentUrl = url()
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }
        if (generatedBlob) {
          setUrl(URL.createObjectURL(generatedBlob))
        } else {
          setUrl(null)
        }
        setLoading(false)
      },
      onError: (err) => {
        setError(err)
        setLoading(false)
      },
    })

    onCleanup(() => {
      gen.dispose()
    })
  })

  onCleanup(() => {
    const u = url()
    if (u) {
      URL.revokeObjectURL(u)
    }
  })

  const resolvedChildren = children(() => {
    return props.children({
      blob: blob(),
      url: url(),
      loading: loading(),
      error: error(),
    })
  })

  return (
    <>
      <div ref={containerRef} style="display: none">
        {props.document}
      </div>
      {resolvedChildren}
    </>
  )
}
