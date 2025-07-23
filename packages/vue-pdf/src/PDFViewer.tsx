import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { generatePdf } from 'polypdf-core'

export const PDFViewer = defineComponent({
  name: 'PDFViewer',
  props: {},
  setup(props, { slots }) {
    const containerRef = ref<HTMLDivElement | null>(null)
    const pdfUrl = ref<string | null>(null)

    onMounted(() => {
      const doc = containerRef.value?.children?.[0]
      if (doc) {
        generatePdf(doc, {
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

    return () => {
      return (
        <>
          <div
            ref={containerRef}
            style={{ display: pdfUrl.value ? 'none' : 'block' }}
          >
            {slots.default?.()}
          </div>
          {pdfUrl.value && (
            <iframe
              src={pdfUrl.value}
              style={{ width: '100%', height: '100vh' }}
            />
          )}
        </>
      )
    }
  },
})
