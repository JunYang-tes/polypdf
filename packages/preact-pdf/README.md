# Preact PDF Library

This is a Preact library for creating PDF documents using a component-based approach, similar to @react-pdf/renderer.

## Installation

```bash
npm install preact-pdf
```

## Usage

### PDFViewer

```jsx
import { Document, Page, Text, View, PDFViewer } from 'preact-pdf';

const App = () => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <Document>
      <Page>
        <Text>Hello, World</Text>
      </Page>
    </Document>
  </PDFViewer>
);
```

### PDFDownloadLink

```jsx
import { Document, Page, Text, PDFDownloadLink } from 'preact-pdf';

const MyDoc = () => (
  <Document>
    <Page>
      <Text>Hello, World</Text>
    </Page>
  </Document>
);

const App = () => (
  <PDFDownloadLink document={<MyDoc />} fileName="document.pdf">
    {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
  </PDFDownloadLink>
);
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
- `BlobProvider` - Component to get the blob of the PDF

The props of these components are basically the same as the component props in @react-pdf/renderer. You can refer to [components](https://react-pdf.org/components) and [svg](https://react-pdf.org/svg)
