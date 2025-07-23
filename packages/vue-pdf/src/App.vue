<script setup lang="ts">
import { ref } from 'vue'
import {PDFViewer} from './PDFViewer'
import {Document,Page,View,Text} from './pdf' 
import {Demo} from './Demo'

const gap = ref(1);
const orientation = ref('landscape');

const toggleOrientation = () => {
  orientation.value = orientation.value === 'landscape' ? 'portrait' : 'landscape';
}
</script>

<template>
  <Demo />
  <!-- <div> -->
  <!--   <label for="gap-slider">Gap: {{ gap }}px</label> -->
  <!--   <input id="gap-slider" type="range" min="0" max="50" v-model.number="gap" /> -->
  <!--   <button @click="toggleOrientation">Toggle Orientation (Current: {{ orientation }})</button> -->
  <!-- </div> -->
  
  <!-- <PDFViewer> -->
  <!--   <Document> -->
  <!--     <Page -->
  <!--         :orientation="orientation" -->
  <!--         :style="{flexDirection: 'row', gap: `${gap}px`}" -->
  <!--     > -->
  <!--     <Text>Text</Text> -->
  <!--     <View> -->
  <!--       <Text>Hello</Text> -->
  <!--     </View> -->
  <!--     <View> -->
  <!--       <Text>World</Text> -->
  <!--     </View> -->
  <!--     </Page> -->
  <!--   </Document> -->
  <!-- </PDFViewer> -->
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
