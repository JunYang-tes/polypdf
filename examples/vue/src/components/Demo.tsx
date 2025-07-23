import { defineComponent } from 'vue'
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Rect,
  Circle,
  Line,
  Path,
  G,
  LinearGradient,
  Stop,
  Defs,
  Link,
  Note,
} from 'vue-pdf'

export const Demo = defineComponent(() => {
  return () => {
    return (
      <div>
        <PDFViewer>
          <Document title="Vue PDF Demo" author="Polypdf">
            {/* First page - Basic components */}
            <Page orientation="portrait" style={{ padding: 30 }}>
              <Text
                style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}
              >
                Vue PDF Components Demo
              </Text>

              {/* Basic Text with different styles */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Basic Text Components:
                </Text>
                <Text style={{ fontSize: 12, color: 'blue' }}>Blue text</Text>
                <Text
                  style={{ fontSize: 12, color: 'red', fontWeight: 'bold' }}
                >
                  Bold red text
                </Text>
                <Text style={{ fontSize: 12, fontStyle: 'italic' }}>
                  Italic text
                </Text>
              </View>

              {/* Text with render prop */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Dynamic Text:
                </Text>
                <Text
                  render={({
                    pageNumber,
                    totalPages,
                    subPageNumber,
                    subPageTotalPages,
                  }) => (
                    <span>
                      Page {pageNumber} of {totalPages} (Sub: {subPageNumber}/
                      {subPageTotalPages})
                    </span>
                  )}
                />
              </View>

              {/* Image component demos */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Image Components:
                </Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>
                  Base64 Image:
                </Text>
                <Image
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwZiIvPjwvc3ZnPg=="
                  style={{ width: 50, height: 50, marginBottom: 10 }}
                />
                <Text style={{ fontSize: 12, marginBottom: 5 }}>
                  URL Image (placeholder):
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#ccc',
                    marginBottom: 10,
                  }}
                />
              </View>

              {/* Link and Note components */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Other Components:
                </Text>
                <Link
                  src="https://example.com"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  <Text>This is a clickable link</Text>
                </Link>
                {/* <Note>This is a note component</Note> */}
              </View>
            </Page>

            {/* Second page - SVG components */}
            <Page style={{ padding: 30 }}>
              <Text
                style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}
              >
                SVG Components Demo
              </Text>

              {/* Basic SVG shapes */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Basic SVG Shapes:
                </Text>

                <Svg width={200} height={100} style={{ marginBottom: 10 }}>
                  <Defs>
                    <LinearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#0000ff" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>

                  {/* Rectangle */}
                  <Rect
                    x="10"
                    y="10"
                    width="50"
                    height="30"
                    fill="url(#grad1)"
                    stroke="#000"
                    strokeWidth="2"
                  />

                  {/* Circle */}
                  <Circle
                    cx="100"
                    cy="25"
                    r="15"
                    fill="#00ff00"
                    stroke="#000"
                    strokeWidth="2"
                  />

                  {/* Line */}
                  <Line
                    x1="130"
                    y1="10"
                    x2="180"
                    y2="40"
                    stroke="#ff0000"
                    strokeWidth="3"
                  />

                  {/* Path */}
                  <Path
                    d="M10,50 Q25,70 40,50 T70,50"
                    stroke="#0000ff"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Group with multiple elements */}
                  <G fill="#purple" stroke="#black" strokeWidth="1">
                    <Circle cx="150" cy="70" r="8" />
                    <Circle cx="165" cy="70" r="8" />
                    <Circle cx="180" cy="70" r="8" />
                  </G>
                </Svg>
              </View>

              {/* Complex SVG example */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Complex SVG Chart:
                </Text>

                <Svg width={250} height={150}>
                  <Defs>
                    <LinearGradient
                      id="chartGrad"
                      x1="0%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#1f77b4" stopOpacity="0.8" />
                      <Stop
                        offset="100%"
                        stopColor="#1f77b4"
                        stopOpacity="0.2"
                      />
                    </LinearGradient>
                  </Defs>

                  {/* Chart bars */}
                  <G>
                    <Rect
                      x="20"
                      y="100"
                      width="30"
                      height="40"
                      fill="url(#chartGrad)"
                    />
                    <Rect
                      x="60"
                      y="80"
                      width="30"
                      height="60"
                      fill="url(#chartGrad)"
                    />
                    <Rect
                      x="100"
                      y="60"
                      width="30"
                      height="80"
                      fill="url(#chartGrad)"
                    />
                    <Rect
                      x="140"
                      y="90"
                      width="30"
                      height="50"
                      fill="url(#chartGrad)"
                    />
                    <Rect
                      x="180"
                      y="70"
                      width="30"
                      height="70"
                      fill="url(#chartGrad)"
                    />
                  </G>

                  {/* Axis lines */}
                  <Line
                    x1="15"
                    y1="145"
                    x2="220"
                    y2="145"
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <Line
                    x1="15"
                    y1="145"
                    x2="15"
                    y2="50"
                    stroke="#333"
                    strokeWidth="2"
                  />
                </Svg>
              </View>
            </Page>

            {/* Third page - Advanced features */}
            <Page style={{ padding: 30 }}>
              <Text
                style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}
              >
                Advanced Features
              </Text>

              {/* Views with different layouts */}
              <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <View
                  style={{
                    flex: 1,
                    marginRight: 10,
                    backgroundColor: '#f0f0f0',
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 5,
                    }}
                  >
                    Left Column
                  </Text>
                  <Text style={{ fontSize: 10 }}>
                    This is content in the left column with flex layout.
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    backgroundColor: '#e0e0e0',
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 5,
                    }}
                  >
                    Right Column
                  </Text>
                  <Text style={{ fontSize: 10 }}>
                    This is content in the right column.
                  </Text>
                </View>
              </View>

              {/* Text with orphans and widows */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Text with Typography Controls:
                </Text>
                <Text
                  style={{ fontSize: 12, lineHeight: 1.5 }}
                  orphans={2}
                  widows={2}
                >
                  This is a longer paragraph that demonstrates the orphans and
                  widows properties. These properties help control how text
                  breaks across pages and prevents awkward line breaks. The
                  orphans property specifies the minimum number of lines that
                  must be left at the bottom of a page, while widows specifies
                  the minimum number of lines that must appear at the top of a
                  page.
                </Text>
              </View>

              {/* Fixed component demo */}
              <View
                fixed
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: '#ffffcc',
                  padding: 5,
                  border: '1px solid #cccc00',
                }}
              >
                <Text style={{ fontSize: 8 }}>Fixed Header</Text>
              </View>

              {/* Page break demo */}
              <View>
                <Text style={{ fontSize: 16, marginBottom: 10 }}>
                  Before page break
                </Text>
                <View break>
                  <Text style={{ fontSize: 16 }}>
                    This should appear on the next page
                  </Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    )
  }
})
