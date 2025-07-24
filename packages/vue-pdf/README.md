# Vue PDF Library

This is a Vue library for creating PDF documents using a component-based approach, similar to @react-pdf/renderer.

## Installation

```bash
npm install vuejs-pdf
```

## Usage

### PDFViewer

```vue
<script setup>
import { Document, Page, Text, View, PDFViewer } from 'vuejs-pdf'
</script>

<template>
  <PDFViewer>
    <Document>
      <Page>
        <Text>Hello,World</Text>
      </Page>
    </Document>
  </PDFViewer>
</template>
```

### PDFDownloadLink

```vue
<script setup>
import { Document, Page, Text, View, PDFDownloadLink } from 'vuejs-pdf'
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
</template>
```


## Components

The library exports the following components:

- `Document` - The root component for a PDF document
- `Page` - Represents a page in the PDF document
- `View` - A container for other components
- `Text` - For displaying text
- `Image` - For displaying images
- `Link` - For creating hyperlinks
- `Note` - For adding notes to the PDF
- `Svg` - Container for SVG elements
- `Rect`, `Circle`, `Line`, `Path`, `G`, `LinearGradient`, `Stop`, `Defs` - SVG elements
- `PDFViewer` - Component for previewing the PDF in the browser
- `PDFDownloadLink` - Component for downloading the PDF

The props of these components are basically the same as the component props in @react-pdf/renderer. You can refer to [components](https://react-pdf.org/components) and [svg](https://react-pdf.org/svg)