import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.png'
import viteLogo from '/vite.svg'
import './App.css'
import { PDFViewer } from './PDFViewer'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Line,
  Path,
  Rect,
  Circle,
  Ellipse,
  Tspan,
  G,
  Stop,
  Defs,
  ClipPath,
  LinearGradient,
  RadialGradient,
} from './pdf'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <PDFViewer>
        <Document>
          <Page>
            <Image src={solidLogo} />
            <Text>hello world</Text>
            <Svg width={200} height={200} debug>
              <Line fill="green" x1={0} y1={0} x2={100} y2={100} />
              <Path d="M10 10 H 90 V 90 H 10 L 10 10" fill="blue" />
              <Rect x={120} y={10} width={50} height={30} fill="red" />
              <Circle cx={50} cy={150} r={40} fill="purple" />
              <Ellipse cx={150} cy={150} rx={40} ry={20} fill="orange" />
              <G transform="translate(0, 180)">
                <Rect x={0} y={0} width={20} height={20} fill="gray" />
              </G>
              <Defs>
                <LinearGradient
                  id="myGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <Stop
                    offset="0%"
                    stopColor="rgb(255,255,0)"
                    stopOpacity="1"
                  />
                  <Stop
                    offset="100%"
                    stopColor="rgb(255,0,0)"
                    stopOpacity="1"
                  />
                </LinearGradient>
                <ClipPath id="myClip">
                  <Circle cx="100" cy="100" r="40" />
                </ClipPath>
              </Defs>
              <Rect
                x={0}
                y={0}
                width={100}
                height={100}
                fill="url(#myGradient)"
                clipPath="url(#myClip)"
              />
            </Svg>
          </Page>
          <Page>
            <View
              render={(props) => {
                return <Text>{props.pageNumber}</Text>
              }}
            />
            <Text>Hello</Text>
            <Text
              render={(props) => {
                return (
                  <Text>
                    {props.pageNumber}/{props.subPageNumber}/{props.totalPages}/
                    {props.subPageTotalPages}
                  </Text>
                )
              }}
            />
          </Page>
          <Page>
            <View
              render={(props) => {
                return <Text>{props.pageNumber}</Text>
              }}
            />
            <Text>Hello</Text>
            <Text
              render={(props) => {
                return (
                  <Text>
                    {props.pageNumber}/{props.subPageNumber}/{props.totalPages}/
                    {props.subPageTotalPages}
                  </Text>
                )
              }}
            />
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

export default App
