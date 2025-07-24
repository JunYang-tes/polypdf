import FontStore from '@react-pdf/font'
import type { DocumentNode } from '@react-pdf/layout'
export declare const omitNils: (object: any) => {
  [k: string]: unknown
}
declare const fontStore: FontStore
export declare const pdf: (document: DocumentNode) => {
  toBlob: () => Promise<Blob>
}
export declare function generatePdf(
  el: HTMLElement,
  hooks: {
    onStart?: () => void
    onBlob?: (blob: Blob) => void
    onError?: (error: unknown) => void
  }
): {
  dispose(): void
}
export { fontStore as Font }
