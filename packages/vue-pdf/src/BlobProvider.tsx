import { defineComponent } from 'vue'

export const BlobProvider = defineComponent({
  name: 'BlobProvider',
  props: {},
  setup() {
    return () => <div>blob provider</div>
  },
})
