import renderToPdf from '@react-pdf/render'
import layoutDocument from '@react-pdf/layout'
// @ts-ignore
import PDFDocument from '@react-pdf/pdfkit'
import FontStore from '@react-pdf/font'
import type { DocumentNode } from '@react-pdf/layout'
import { toPdfDoc } from './dom'

export const omitNils = (object: any) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  )

const fontStore = new FontStore()
const renderPDF = async (docNode: DocumentNode, compress?: boolean) => {
  const {
    pdfVersion,
    language,
    pageLayout,
    pageMode,
    title,
    author,
    subject,
    //@ts-ignore
    keyboards,
    creator = 'react-pdf',
    producer = 'react-pdf',
    creationDate = new Date(),
    modificationDate,
  } = docNode.props

  const ctx = new PDFDocument({
    compress,
    pdfVersion,
    lang: language,
    displayTitle: true,
    autoFirstPage: false,
    info: omitNils({
      Title: title,
      Author: author,
      Subject: subject,
      Keywords: keyboards,
      Creator: creator,
      Producer: producer,
      CreationDate: creationDate,
      ModificationDate: modificationDate,
    }),
  })
  // @ts-ignore
  const layout = await layoutDocument(docNode, fontStore)

  const fileStream = renderToPdf(ctx, layout)
  return { layout, fileStream }
}

export const pdf = (document: DocumentNode) => {
  const toBlob = async () => {
    const chunks: Uint8Array[] = []
    const { layout: _INTERNAL__LAYOUT__DATA_, fileStream: instance } =
      await renderPDF(document)

    return new Promise<Blob>((resolve, reject) => {
      instance.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk))
      })

      instance.on('end', () => {
        try {
          const blob = new Blob(chunks, { type: 'application/pdf' })
          //callOnRender({ blob, _INTERNAL__LAYOUT__DATA_ });
          resolve(blob)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  return {
    toBlob,
  }
}

export function generatePdf(
  el: HTMLElement,
  hooks: {
    onStart?: () => void
    onBlob?: (blob: Blob) => void
    onError?: (error: unknown) => void
  }
) {
  const gen = async () => {
    hooks.onStart?.()
    const [doc, out] = toPdfDoc(el)
    const blob = await pdf(doc).toBlob()
    if (hooks.onBlob) {
      hooks.onBlob(blob)
    }
    return out
  }

  const observer = new MutationObserver(async () => {
    observer.disconnect()
    await gen()
      .then(({ isDynamic }) => {
        if (isDynamic) {
          return gen()
        }
      })
      .catch((e) => hooks.onError?.(e))
    observer.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  })
  gen()
    .then(({ isDynamic }) => {
      if (isDynamic) {
        return gen()
      }
    })
    .catch((e) => hooks.onError?.(e))

  observer.observe(el, {
    attributes: true,
    childList: true,
    subtree: true,
  })
  return {
    dispose() {
      observer.disconnect()
    },
  }
}

export { fontStore as Font }
