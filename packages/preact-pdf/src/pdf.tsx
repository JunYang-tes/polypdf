import type {
  Bookmark,
  Orientation,
  PageLayout,
  PageMode,
  PageSize,
  PDFVersion,
  SourceObject,
  Style,
  SVGPresentationAttributes,
} from '@react-pdf/types'
import { props } from 'polypdf-core'
import {
  h,
  type ComponentChild,
  type ComponentFactory,
  type VNode,
} from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
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
  render?: (props: { pageNumber: number; subPageNumber: number }) => VNode<any>
}

export const View = createParentComp<ViewProps>('VIEW')

interface ParentProps<P> {
  children?: ComponentChild
  style?: any
  render?: any
}

function createParentComp<P extends Record<string, unknown>>(
  type: string
): ComponentFactory<P & ParentProps<P>> {
  return function P(props: P & ParentProps<P>) {
    const { children, style, render, ...others } = props
    const id = `page-${seqId()}`
    const [pageInfo, setPageInfo] = useState({
      pageNumber: 0,
      totalPages: 0,
      subPageNumber: 0,
      subPageTotalPages: 0,
    })

    const updatePageInfo = useCallback(
      (props: {
        pageNumber: number
        subPageNumber?: number
        totalPages?: number
        subPageTotalPages?: number
      }) => {
        setPageInfo((prev) => ({
          ...prev,
          pageNumber: props.pageNumber,
          totalPages: props.totalPages || prev.totalPages,
          subPageNumber: props.subPageNumber || 0,
          subPageTotalPages: props.subPageTotalPages || 0,
        }))
      },
      []
    )

    const counter = useMemo(() => {
      const s = style || {}
      setProps(`${id}-style`, s)
      setProps(`${id}-props`, others)
      if (render) {
        setProps(`${id}-render`, updatePageInfo)
      }
      return _seqId
    }, [style, others, render, updatePageInfo])

    useEffect(() => {
      return () => {
        removeProps(`${id}-style`)
        removeProps(`${id}-render`)
        removeProps(`${id}-props`)
      }
    }, [id])

    const resolvedChildren = useMemo(() => {
      if (render) {
        return render(pageInfo)
      }
      return children
    }, [render, pageInfo, children])

    return h(
      'div',
      {
        'data-type': type,
        'data-counter': counter,
        'data-props': `${id}-props`,
        'data-style': `${id}-style`,
        'data-render': render ? `${id}-render` : undefined,
      },
      resolvedChildren
    )
  }
}

function createLeafComp<P extends { style?: any }>(
  type: string
): ComponentFactory<P> {
  return function P(props: P) {
    const { style, ...others } = props
    const id = `page-${seqId()}`

    const counter = useMemo(() => {
      const s = style || {}
      setProps(`${id}-style`, s)
      setProps(`${id}-props`, others)
      return _seqId
    }, [style, others])

    useEffect(() => {
      return () => {
        removeProps(`${id}-style`)
        removeProps(`${id}-props`)
      }
    }, [id])

    return h('div', {
      'data-type': type,
      'data-counter': counter,
      'data-props': `${id}-props`,
      'data-style': `${id}-style`,
    })
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
  }) => VNode<any>
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

export const Text = createParentComp<TextProps>('TEXT')

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

export interface SVGProps extends NodeProps, SVGPresentationAttributes {
  /**
   * Enables debug mode on page bounding box.
   * @see https://react-pdf.org/advanced#debugging
   */
  debug?: boolean
  width?: string | number
  height?: string | number
  viewBox?: string
  preserveAspectRatio?: string
}

export const Svg = createParentComp<SVGProps>('SVG')

export interface LineProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  x1: string | number
  x2: string | number
  y1: string | number
  y2: string | number
}
export const Line = createLeafComp<LineProps>('LINE')

export interface PolylineProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  points: string
}
export const Polyline = createLeafComp<PolylineProps>('POLYLINE')
export interface PolygonProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  points: string
}
export const Polygon = createLeafComp<PolygonProps>('POLYGON')

export interface PathProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  d: string
}
export const Path = createLeafComp<PathProps>('PATH')

export interface RectProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  x?: string | number
  y?: string | number
  width: string | number
  height: string | number
  rx?: string | number
  ry?: string | number
}
export const Rect = createLeafComp<RectProps>('RECT')

export interface CircleProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  cx?: string | number
  cy?: string | number
  r: string | number
}
export const Circle = createLeafComp<CircleProps>('CIRCLE')

export interface EllipseProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  cx?: string | number
  cy?: string | number
  rx: string | number
  ry: string | number
}
export const Ellipse = createLeafComp<EllipseProps>('ELLIPSE')

export interface TspanProps extends SVGPresentationAttributes {
  style?: never
  x?: string | number
  y?: string | number
}
export const Tspan = createParentComp<TspanProps>('TSPAN')

export interface GProps extends SVGPresentationAttributes {
  style?: Style
}
export const G = createParentComp<GProps>('G')

export interface StopProps {
  style?: never
  offset: string | number
  stopColor: string
  stopOpacity?: string | number
}
export const Stop = createLeafComp<StopProps>('STOP')

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefsProps {}
export const Defs = createParentComp<DefsProps>('DEFS')

export interface ClipPathProps {
  style?: never
  id?: string
}
export const ClipPath = createParentComp<ClipPathProps>('CLIP_PATH')

export interface LinearGradientProps {
  style?: never
  id: string
  x1?: string | number
  x2?: string | number
  y1?: string | number
  y2?: string | number
  xlinkHref?: string
  gradientTransform?: string
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
export const LinearGradient =
  createParentComp<LinearGradientProps>('LINEAR_GRADIENT')

export interface RadialGradientProps {
  style?: never
  id: string
  cx?: string | number
  cy?: string | number
  r?: string | number
  fx?: string | number
  fy?: string | number
  xlinkHref?: string
  gradientTransform?: string
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
export const RadialGradient =
  createParentComp<RadialGradientProps>('RADIAL_GRADIENT')
