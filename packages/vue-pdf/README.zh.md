# Vue PDF 库

这是一个 Vue 库，用于通过基于组件的方法创建 PDF 文档，类似于 @react-pdf/renderer。

## 安装

```bash
npm install vuejs-pdf
```

## 用法

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


## 组件

该库导出以下组件：

- `Document` - PDF 文档的根组件
- `Page` - 表示 PDF 文档中的一页
- `View` - 其他组件的容器
- `Text` - 用于显示文本
- `Image` - 用于显示图像
- `Link` - 用于创建超链接
- `Note` - 用于向 PDF 添加注释
- `Svg` - SVG 元素的容器
- `Rect`, `Circle`, `Line`, `Path`, `G`, `LinearGradient`, `Stop`, `Defs` - SVG 元素
- `PDFViewer` - 用于在浏览器中预览 PDF 的组件
- `PDFDownloadLink` - 用于下载 PDF 的组件

这些组件的props和@react-pdf/renderer里面的组件props基本是一样的。可以参考[components](https://react-pdf.org/components) 和 [svg](https://react-pdf.org/svg)
