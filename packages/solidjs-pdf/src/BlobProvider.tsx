import { createSignal, createEffect, onCleanup, children } from 'solid-js'
import { generatePdf } from 'polypdf-core'

export const BlobProvider = (props) => {
  const [blob, setBlob] = createSignal<Blob | null>(null)
  const [url, setUrl] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal(null)

  const resolvedChildren = children(() => {
    const u = url()
    const l = loading()
    const e = error()
    return props.children({
      url: u,
      loading: l,
      error: e,
    })
  })

  createEffect(() => {
    setLoading(true)
    setError(null)
    const doc = props.document as HTMLElement
    const gen = generatePdf(doc, {
      onBlob: (blob) => {
        setBlob(blob)
        const u = url()
        if (u) {
          URL.revokeObjectURL(u)
        }
        setUrl(URL.createObjectURL(blob))
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

  return resolvedChildren
}
