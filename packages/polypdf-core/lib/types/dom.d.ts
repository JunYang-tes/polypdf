import type { DocumentNode } from '@react-pdf/layout'
export declare function toPdfDoc(el: HTMLElement): [
  DocumentNode,
  {
    isDynamic: boolean
  },
]
