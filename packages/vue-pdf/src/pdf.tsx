import {
  defineComponent,
  onUnmounted,
  reactive,
  ref,
  watchEffect,
  type VNode,
} from 'vue'
import { props } from 'polypdf-core'
import type {
  Bookmark,
  Orientation,
  PageLayout,
  PageMode,
  PageSize,
  PDFVersion,
  Style,
  SourceObject,
  SVGPresentationAttributes,
} from '@react-pdf/types'
const { setProps, removeProps } = props

let idCounter = 0
const nextId = () => idCounter++

function createParentComp<P extends Record<string, any>>(
  type: string,
  propsNames: string[]
) {
  return defineComponent<P>(
    (props, { slots }) => {
      const id = nextId()
      const counter = ref(0)
      const pageInfo = reactive({
        pageNumber: 0,
        subPageNumber: 0,
      })
      const render = props['render']
      const updatePageInfo = (props: {
        pageNumber: number
        subPageNumber: number
      }) => {
        Object.assign(pageInfo, props)
      }

      watchEffect(() => {
        setProps(`${id}-style`, props.style || {})
        const otherProps = Object.fromEntries(
          propsNames
            .map((name) => [name, props[name]])
            .filter(([_name, value]) => value !== undefined)
        )
        otherProps.debug = props.debug
        setProps(`${id}-props`, otherProps || {})
        if (props['render']) {
          setProps(`${id}-render`, updatePageInfo)
        }
        counter.value++
      })
      onUnmounted(() => {
        removeProps(`${id}-style`)
        removeProps(`${id}-props`)
        removeProps(`${id}-render`)
      })

      return () => (
        <div
          data-counter={counter.value}
          data-type={type}
          data-props={`${id}-props`}
          data-style={`${id}-style`}
          data-render={`${id}-render`}
        >
          {render ? render(pageInfo) : slots.default?.()}
        </div>
      )
    },
    {
      props: [...propsNames, 'style', 'debug'],
    }
  )
}
function createLeafComp<P extends Record<string, any>>(
  type: string,
  propsNames: string[]
) {
  return defineComponent<P>(
    (props) => {
      const id = nextId()
      const counter = ref(0)
      watchEffect(() => {
        setProps(`${id}-style`, props.style || {})
        const otherProps = Object.fromEntries(
          propsNames
            .map((name) => [name, props[name]])
            .filter(([_name, value]) => value !== undefined)
        )
        otherProps.debug = props.debug
        setProps(`${id}-props`, otherProps || {})
        counter.value++
      })
      onUnmounted(() => {
        removeProps(`${id}-style`)
        removeProps(`${id}-props`)
      })
      return () => (
        <div
          data-counter={counter.value}
          data-type={type}
          data-props={`${id}-props`}
          data-style={`${id}-style`}
        />
      )
    },
    {
      props: [...propsNames, 'style', 'debug'],
    }
  )
}

interface NodeProps {
  id?: string
  style?: Style | Style[]
  fixed?: boolean
  break?: boolean
  minPresenceAhead?: number
}

const nodePropNames = ['id', 'fixed', 'break', 'minPresenceAhead']

interface PageProps extends NodeProps {
  wrap?: boolean
  debug?: boolean
  size?: PageSize
  orientation?: Orientation
  dpi?: number
  bookmark?: Bookmark
}

const pagePropNames = [
  ...nodePropNames,
  'wrap',
  'size',
  'orientation',
  'dpi',
  'bookmark',
]

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
  onRender?: (props: any) => any
}

const documentPropNames = [
  'title',
  'author',
  'subject',
  'creator',
  'keywords',
  'producer',
  'language',
  'creationDate',
  'modificationDate',
  'pdfVersion',
  'pageMode',
  'pageLayout',
  'onRender',
]

export const Document = createParentComp<DocumentProps>(
  'DOCUMENT',
  documentPropNames
)

export const Page = createParentComp<PageProps>('PAGE', pagePropNames)

export interface ViewProps extends NodeProps {
  wrap?: boolean
  debug?: boolean
  render?: (props: { pageNumber: number; subPageNumber: number }) => VNode
}

const viewPropNames = [...nodePropNames, 'wrap', 'render']

export const View = createParentComp<ViewProps>('VIEW', viewPropNames)

export interface TextProps extends NodeProps {
  wrap?: boolean
  debug?: boolean
  render?: (props: {
    pageNumber: number
    totalPages: number
    subPageNumber: number
    subPageTotalPages: number
  }) => VNode
  orphans?: number
  widows?: number
}

const textPropNames = [...nodePropNames, 'wrap', 'render', 'orphans', 'widows']

export const Text = createParentComp<TextProps>('TEXT', textPropNames)

export interface BaseImageProps extends NodeProps {
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

const imagePropNames = [...nodePropNames, 'cache', 'src', 'source']

export const Image = createLeafComp<ImageProps>('IMAGE', imagePropNames)
export const Link = createLeafComp('LINK', [])
export const Note = createLeafComp('NOTE', [])
export const Canvas = createLeafComp('CANVAS', [])

export interface SVGProps extends NodeProps, SVGPresentationAttributes {
  debug?: boolean
  width?: string | number
  height?: string | number
  viewBox?: string
  preserveAspectRatio?: string
}

const svgPropNames = [
  ...nodePropNames,
  'width',
  'height',
  'viewBox',
  'preserveAspectRatio',
  'fill',
  'stroke',
  'strokeWidth',
  'opacity',
]

export const Svg = createParentComp<SVGProps>('SVG', svgPropNames)

export interface LineProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  x1: string | number
  x2: string | number
  y1: string | number
  y2: string | number
}

const linePropNames = [
  'x1',
  'x2',
  'y1',
  'y2',
  'fill',
  'stroke',
  'strokeWidth',
  'opacity',
]

export const Line = createLeafComp<LineProps>('LINE', linePropNames)

export interface PolylineProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  points: string
}

const polylinePropNames = ['points', 'fill', 'stroke', 'strokeWidth', 'opacity']

export const Polyline = createLeafComp<PolylineProps>(
  'POLYLINE',
  polylinePropNames
)

export interface PolygonProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  points: string
}

const polygonPropNames = ['points', 'fill', 'stroke', 'strokeWidth', 'opacity']

export const Polygon = createLeafComp<PolygonProps>('POLYGON', polygonPropNames)

export interface PathProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  d: string
}

const pathPropNames = ['d', 'fill', 'stroke', 'strokeWidth', 'opacity']

export const Path = createLeafComp<PathProps>('PATH', pathPropNames)

export interface RectProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  x?: string | number
  y?: string | number
  width: string | number
  height: string | number
  rx?: string | number
  ry?: string | number
}

const rectPropNames = [
  'x',
  'y',
  'width',
  'height',
  'rx',
  'ry',
  'fill',
  'stroke',
  'strokeWidth',
  'opacity',
]

export const Rect = createLeafComp<RectProps>('RECT', rectPropNames)

export interface CircleProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  cx?: string | number
  cy?: string | number
  r: string | number
}

const circlePropNames = [
  'cx',
  'cy',
  'r',
  'fill',
  'stroke',
  'strokeWidth',
  'opacity',
]

export const Circle = createLeafComp<CircleProps>('CIRCLE', circlePropNames)

export interface EllipseProps extends SVGPresentationAttributes {
  style?: SVGPresentationAttributes
  cx?: string | number
  cy?: string | number
  rx: string | number
  ry: string | number
}

const ellipsePropNames = [
  'cx',
  'cy',
  'rx',
  'ry',
  'fill',
  'stroke',
  'strokeWidth',
  'opacity',
]

export const Ellipse = createLeafComp<EllipseProps>('ELLIPSE', ellipsePropNames)

export interface TspanProps extends SVGPresentationAttributes {
  style?: never
  x?: string | number
  y?: string | number
}

const tspanPropNames = ['x', 'y', 'fill', 'stroke', 'strokeWidth', 'opacity']

export const Tspan = createParentComp<TspanProps>('TSPAN', tspanPropNames)

export interface GProps extends SVGPresentationAttributes {
  style?: Style
}

const gPropNames = ['fill', 'stroke', 'strokeWidth', 'opacity']

export const G = createParentComp<GProps>('G', gPropNames)

export interface StopProps {
  style?: never
  offset: string | number
  stopColor: string
  stopOpacity?: string | number
}

const stopPropNames = ['offset', 'stopColor', 'stopOpacity']

export const Stop = createLeafComp<StopProps>('STOP', stopPropNames)

export interface DefsProps {}

export const Defs = createParentComp<DefsProps>('DEFS', [])

export interface ClipPathProps {
  style?: never
  id?: string
}

const clipPathPropNames = ['id']

export const ClipPath = createParentComp<ClipPathProps>(
  'CLIP_PATH',
  clipPathPropNames
)

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

const linearGradientPropNames = [
  'id',
  'x1',
  'x2',
  'y1',
  'y2',
  'xlinkHref',
  'gradientTransform',
  'gradientUnits',
]

export const LinearGradient = createParentComp<LinearGradientProps>(
  'LINEAR_GRADIENT',
  linearGradientPropNames
)

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

const radialGradientPropNames = [
  'id',
  'cx',
  'cy',
  'r',
  'fx',
  'fy',
  'xlinkHref',
  'gradientTransform',
  'gradientUnits',
]

export const RadialGradient = createParentComp<RadialGradientProps>(
  'RADIAL_GRADIENT',
  radialGradientPropNames
)
