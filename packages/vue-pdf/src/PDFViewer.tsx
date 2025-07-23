import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  type VNodeRef,
} from 'vue'
import { generatePdf } from 'polypdf-core'
import type { Style } from '@react-pdf/types'

export interface PDFViewerProps {
  width?: number | string
  height?: number | string
  style?: Style | Style[]
  class?: string
  innerRef?: VNodeRef
  showToolbar?: boolean
}

export const PDFViewer = defineComponent({
  name: 'PDFViewer',
  props: {
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: '100vh',
    },
    style: {
      type: [Object, Array],
      default: () => ({}),
    },
    class: {
      type: String,
      default: '',
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const containerRef = ref<HTMLElement | null>(null)
    const pdfUrl = ref<string | null>(null)

    onMounted(() => {
      const doc = containerRef.value?.children?.[0]
      if (doc) {
        generatePdf(doc as HTMLElement, {
          onBlob: (blob) => {
            if (pdfUrl.value) {
              URL.revokeObjectURL(pdfUrl.value)
            }
            if (blob) {
              const url = URL.createObjectURL(blob)
              pdfUrl.value = url
            }
          },
        })
      }
    })

    onUnmounted(() => {
      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value)
      }
    })

    // Merge styles with props
    const getIframeStyle = () => {
      const baseStyle = {
        width: props.width,
        height: props.height,
      }

      // Merge with passed style prop
      if (Array.isArray(props.style)) {
        return Object.assign(baseStyle, ...props.style)
      } else {
        return Object.assign(baseStyle, props.style)
      }
    }

    // Handle toolbar visibility
    const getIframeSrc = () => {
      if (pdfUrl.value) {
        const toolbarParam = props.showToolbar ? '#toolbar=1' : '#toolbar=0'
        return `${pdfUrl.value}${toolbarParam}`
      }
      return ''
    }

    return () => {
      return (
        <>
          <div ref={containerRef} style={{ display: 'none' }}>
            {slots.default?.()}
          </div>
          {pdfUrl.value && (
            <iframe
              src={getIframeSrc()}
              style={getIframeStyle()}
              class={props.class}
            />
          )}
        </>
      )
    }
  },
})
