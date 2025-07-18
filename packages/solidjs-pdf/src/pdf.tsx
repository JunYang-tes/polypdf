import {
  type Node,
  type Bookmark,
  type Orientation,
  type PageLayout,
  type PageMode,
  type PageSize,
  type PDFVersion,
  type Style,
  type SourceObject,
} from '@react-pdf/types'
import {
  createMemo,
  createEffect,
  createSignal,
  type JSX,
  type ParentProps,
  splitProps,
  children,
  onCleanup,
} from 'solid-js'
import { props } from 'polypdf-core'
const { setProps, removeProps } = props

interface NodeProps {
  id?: string
  style?: Style | Style[]
  /**
   * Render component in all wrapped pages.
   * @see https://react-pdf.org/advanced#fixed-components
   */
  fixed?: boolean
  /**
   * Force the wrapping algorithm to start a new page when rendering the
   * element.
   * @see https://react-pdf.org/advanced#page-breaks
   */
  break?: boolean
  /**
   * Hint that no page wrapping should occur between all sibling elements following the element within n points
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  minPresenceAhead?: number
}

interface PageProps extends NodeProps {
  /**
   * Enable page wrapping for this page.
   * @see https://react-pdf.org/components#page-wrapping
   */
  wrap?: boolean
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean
  size?: PageSize
  orientation?: Orientation
  dpi?: number
  bookmark?: Bookmark
}

let _seqId = 0
const seqId = () => {
  return _seqId++
}

export interface ViewProps extends NodeProps {
  id?: string
  /**
   * Enable/disable page wrapping for element.
   * @see https://react-pdf.org/components#page-wrapping
   */
  wrap?: boolean
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean
  render?: (props: { pageNumber: number; subPageNumber: number }) => JSX.Element
}

export function View(props: ParentProps<ViewProps>) {
  const id = `view-${seqId()}`
  const [pageInfo, setPageInfo] = createSignal({
    pageNumber: 0,
    subPageNumber: 0,
  })
  const [local, others] = splitProps(props, ['children', 'style', 'render'])

  const collectPage = (props: {
    pageNumber: number
    subPageNumber: number
  }) => {
    setPageInfo((curr) => {
      if (
        curr.pageNumber !== props.pageNumber ||
        (props.subPageNumber != null &&
          curr.subPageNumber !== props.subPageNumber)
      ) {
        return {
          pageNumber: props.pageNumber,
          subPageNumber: props.subPageNumber,
        }
      } else {
        return curr
      }
    })
  }
  let counter = 0
  const update = createMemo(() => {
    const s = local.style || {}
    setProps(`${id}-style`, s)
    if (local.render) {
      setProps(`${id}-render`, collectPage)
    }
    const p = Object.fromEntries(
      Object.keys(others)
        //@ts-ignore
        .map((k) => [k, others[k]])
    )
    setProps(`${id}-props`, p)
    return counter++
  })

  const resolvedChildren = children(() => {
    if (local.render) {
      return local.render(pageInfo())
    }
    return local.children
  })

  onCleanup(() => {
    removeProps(`${id}-style`)
    removeProps(`${id}-render`)
    removeProps(`${id}-props`)
  })

  //@ts-ignore
  return (
    <div
      data-type="VIEW"
      data-counter={update()}
      data-render={`${id}-render`}
      data-props={`${id}-props`}
      data-style={`${id}-style`}
    >
      {
        //local.children
        resolvedChildren
      }
    </div>
  )
}

function createParentComp<P extends { style?: Style | Style[] }>(type: string) {
  return function P(props: ParentProps<P>) {
    const [local, others] = splitProps(props, ['children', 'style'])
    const id = `page-${seqId()}`
    const [pageInfo, setPageInfo] = createSignal({
      pageNumber: 0,
      subPageNumber: 0,
    })

    let _counter = 0
    const counter = createMemo(() => {
      const s = local.style || {}
      setProps(`${id}-style`, s)
      const p = Object.fromEntries(
        Object.keys(others)
          //@ts-ignore
          .map((k) => [k, others[k]])
      )
      setProps(`${id}-props`, p)
      return _counter
    })
    onCleanup(() => {
      removeProps(`${id}-style`)
      removeProps(`${id}-render`)
      removeProps(`${id}-props`)
    })

    //@ts-ignore
    return (
      <div
        data-type={type}
        data-counter={counter()}
        data-props={`${id}-props`}
        data-style={`${id}-style`}
      >
        {local.children}
      </div>
    )
  }
}

function createLeafComp<P extends { style?: Style | Style[] }>(type: string) {
  return function P(props: P) {
    const [local, others] = splitProps(props, ['style'])
    const id = `page-${seqId()}`
    const [pageInfo, setPageInfo] = createSignal({
      pageNumber: 0,
      subPageNumber: 0,
    })

    let _counter = 0
    const counter = createMemo(() => {
      const s = local.style || {}
      setProps(`${id}-style`, s)
      const p = Object.fromEntries(
        Object.keys(others)
          //@ts-ignore
          .map((k) => [k, others[k]])
      )
      setProps(`${id}-props`, p)
      return _counter
    })
    onCleanup(() => {
      removeProps(`${id}-style`)
      removeProps(`${id}-props`)
    })

    //@ts-ignore
    return (
      <div
        data-type={type}
        data-counter={counter()}
        data-props={`${id}-props`}
        data-style={`${id}-style`}
      ></div>
    )
  }
}

export const Page = createParentComp<PageProps>('PAGE')

export interface OnRenderProps {
  blob?: Blob
}

export interface DocumentProps {
  style?: Style | Style[]
  title?: string
  author?: string
  subject?: string
  creator?: string
  keywords?: string
  producer?: string
  language?: string
  creationDate?: Date
  modificationDate?: Date
  pdfVersion?: PDFVersion
  pageMode?: PageMode
  pageLayout?: PageLayout
  onRender?: (props: OnRenderProps) => any
}
export const Document = createParentComp<DocumentProps>('DOCUMENT')

export interface TextProps extends NodeProps {
  id?: string
  /**
   * Enable/disable page wrapping for element.
   * @see https://react-pdf.org/components#page-wrapping
   */
  wrap?: boolean
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean
  render?: (props: {
    pageNumber: number
    totalPages: number
    subPageNumber: number
    subPageTotalPages: number
  }) => JSX.Element
  /**
   * Override the default hyphenation-callback
   * @see https://react-pdf.org/fonts#registerhyphenationcallback
   */
  //hyphenationCallback?: HyphenationCallback;
  /**
   * Specifies the minimum number of lines in a text element that must be shown at the bottom of a page or its container.
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  orphans?: number
  /**
   * Specifies the minimum number of lines in a text element that must be shown at the top of a page or its container..
   * @see https://react-pdf.org/advanced#orphan-&-widow-protection
   */
  widows?: number
}

export function Text(props: ParentProps<TextProps>) {
  const id = `text-${seqId()}`
  const [pageInfo, setPageInfo] = createSignal({
    pageNumber: 0,
    totalPages: 0,
    subPageNumber: 0,
    subPageTotalPages: 0,
  })
  const [local, others] = splitProps(props, ['children', 'style', 'render'])

  const collectPage = (props: {
    pageNumber: 0
    totalPages: 0
    subPageNumber: 0
    subPageTotalPages: 0
  }) => {
    setPageInfo((curr) => {
      if (
        curr.pageNumber !== props.pageNumber ||
        (props.totalPages != null && curr.totalPages !== props.totalPages) ||
        (props.subPageNumber != null &&
          curr.subPageNumber !== props.subPageNumber) ||
        (props.subPageTotalPages != null &&
          curr.subPageTotalPages !== props.subPageTotalPages)
      ) {
        return {
          ...props,
        }
      } else {
        return curr
      }
    })
  }

  let _counter = 0
  const counter = createMemo(() => {
    const s = local.style || {}
    setProps(`${id}-style`, s)
    if (local.render) {
      setProps(`${id}-render`, collectPage)
    }
    const p = Object.fromEntries(
      Object.keys(others)
        //@ts-ignore
        .map((k) => [k, others[k]])
    )
    setProps(`${id}-props`, p)
    return _counter++
  })

  const resolvedChildren = children(() => {
    if (local.render) {
      return local.render(pageInfo())
    }
    return local.children
  })

  onCleanup(() => {
    removeProps(`${id}-style`)
    removeProps(`${id}-render`)
    removeProps(`${id}-props`)
  })

  return (
    <div
      data-type="TEXT"
      data-counter={counter()}
      data-render={`${id}-render`}
      data-props={`${id}-props`}
      data-style={`${id}-style`}
    >
      {
        //@ts-ignore
        resolvedChildren
      }
    </div>
  )
}

export interface BaseImageProps extends NodeProps {
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean
  cache?: boolean
}

export interface ImageWithSrcProp extends BaseImageProps {
  src: SourceObject
}

export interface ImageWithSourceProp extends BaseImageProps {
  source: SourceObject
}

export type ImageProps = ImageWithSrcProp | ImageWithSourceProp

export const Image = createLeafComp<ImageProps>('IMAGE')
export const Link = createLeafComp('LINK')
export const Note = createLeafComp('NOTE')
export const Canvas = createLeafComp('CANVAS')
