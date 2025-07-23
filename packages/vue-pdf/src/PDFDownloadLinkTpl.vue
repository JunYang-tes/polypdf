<script setup lang="ts">
    import { ref,useTemplateRef } from 'vue';
    const container = useTemplateRef('container');
    const loading = ref(false);
</script>
<template>
    <slot ref="container"  name="doc"></slot>
    <slot
        name="loading" />
    <a 
        v-if="!loading"
        class="pdf-download-link"
        href="#">
        <slot name="link-text">Download PDF</slot>
    </a>

</template>
