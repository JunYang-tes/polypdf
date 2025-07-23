<script setup lang="ts">
import { Demo } from './components/Demo'
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
} from 'vue-pdf'
import {defineComponent} from 'vue'
import {Test} from './Test'


</script>

<template>
  <PDFDownloadLink fileName="hello-world.pdf">
    <template v-slot:loading>
        <span>Loading...</span>
    </template>
    <template v-slot:doc>
        <Document>
          <Page>
            <Text>Hello World</Text>
          </Page>
        </Document>
    </template>
    <template v-slot:download>
      download hello-wolrd.pdf
    </template>
  </PDFDownloadLink>
  
  <Demo />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
