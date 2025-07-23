# Vue PDF Library

This is a Vue library for creating PDF documents using a component-based approach, similar to React PDF.

## Installation

```bash
npm install vue-pdf
```

## Usage

```vue
<script setup>
import { Document, Page, Text, View } from 'vue-pdf'
</script>

<template>
  <Document>
    <Page>
      <Text>Hello World!</Text>
    </Page>
  </Document>
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
- `BlobProvider` - Component for getting the PDF as a blob

## Development

To build the library:

```bash
cd packages/vue-pdf
npm run build
```

To run the example:

```bash
cd examples/vue
npm run dev
```