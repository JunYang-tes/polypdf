<script setup lang="ts">
import { Demo,Doc } from './components/Demo'
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
} from 'vuejs-pdf'
import {defineComponent} from 'vue'


</script>

<template>
  <PDFDownloadLink fileName="hello-world.pdf">
    <template v-slot:loading>
        <span>Loading...</span>
    </template>
    <template v-slot:doc>
      <Doc />
    </template>
    <template v-slot:download>
      download hello-wolrd.pdf
    </template>
  </PDFDownloadLink>
  
  <Demo />
</template>

