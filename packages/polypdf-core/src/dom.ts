import type { DocumentNode, Node } from '@react-pdf/layout'
import { getProps } from './props.js'

const createNode = (type: Node['type'], { style, children, props }: any) => ({
  type,
  box: {},
  style: style || {},
  props: props || {},
  children: children,
})
const createTextInstance = (text: string) => ({
  type: 'TEXT_INSTANCE' as const,
  value: text,
})

type ReactNode = string | { type: string; props: any }
function toReactEl(node: Node): ReactNode {
  if (node.type === 'TEXT_INSTANCE') {
    return node.value
  }
  return {
    type: node.type,
    props: {
      style: node.style,
      children: (node.children ?? []).map(toReactEl),
      ...node.props,
    },
  }
}

function elToNode(el: HTMLElement, out: { isDynamic: boolean }): Node | null {
  const nodeType = el.getAttribute('data-type')
  const props = getProps(el.getAttribute('data-props') || '') || {}
  const style = getProps(el.getAttribute('data-style') || '') || {}
  const render = getProps(el.getAttribute('data-render') || '')
  if (nodeType == null) {
    return null
  }

  if (nodeType === 'TEXT_INSTANCE') {
    return createTextInstance(el.textContent ?? '')
  }
  const children = Array.from(el.children)
    .map((el) => elToNode(el as HTMLElement, out))
    .filter(Boolean)
  if (nodeType === 'TEXT' && el.children.length === 0) {
    children.push(createTextInstance(el.textContent ?? ''))
  }
  if (render) {
    out.isDynamic = true
  }
  const node = createNode(nodeType as any, {
    style,
    props: render
      ? {
          ...props,
          render(...args: any[]) {
            render(...args)
            return children.map(toReactEl)
          },
        }
      : props,
    children,
  })
  // @ts-ignore
  return node
}

export function toPdfDoc(
  el: HTMLElement
): [DocumentNode, { isDynamic: boolean }] {
  const type = el.getAttribute('data-type')
  if (type !== 'DOCUMENT') {
    throw new Error('root element must be PDFDOC')
  }
  const out = { isDynamic: false }
  const doc = elToNode(el, out)
  if (doc?.type !== 'DOCUMENT') {
    throw new Error('root element must be PDFDOC')
  }
  return [doc, out]
}
