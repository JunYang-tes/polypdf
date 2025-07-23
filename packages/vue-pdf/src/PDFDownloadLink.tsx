import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  type SlotsType,
  type VNode,
} from 'vue'
import { generatePdf } from 'polypdf-core'

export interface PDFDownloadLinkProps {
  fileName?: string
  class?: string
}

export const PDFDownloadLink = defineComponent<PDFDownloadLinkProps>(
  (props, { slots }) => {
    const containerRef = ref<HTMLElement | null>(null)
    const pdfUrl = ref<string | null>(null)
    const loading = ref(true)

    onMounted(() => {
      const doc = containerRef.value?.children?.[0]
      if (doc) {
        generatePdf(doc as HTMLElement, {
          onBlob: (blob) => {
            loading.value = false
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
    return () => {
      return (
        <>
          <div ref={containerRef} style="display: none">
            {slots?.doc?.()}
          </div>
          {loading.value ? (
            slots?.loading?.()
          ) : (
            <a
              class={props.class}
              href={pdfUrl.value!}
              download={props.fileName || 'download.pdf'}
            >
              {slots?.download?.() || 'Download'}
            </a>
          )}
        </>
      )
    }
  },
  {
    props: {
      fileName: String,
      class: String,
    },
    slots: Object as SlotsType<{
      doc?: () => VNode | VNode[]
      loading?: () => VNode | VNode[]
      download?: () => VNode | VNode[]
    }>,
  }
)
