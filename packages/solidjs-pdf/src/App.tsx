import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.png'
import viteLogo from '/vite.svg'
import './App.css'
import { PDFViewer } from './PDFViewer'
import {
  Document,
  Page,
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
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
        </Document>
      </PDFViewer>
    </>
  )
}

export default App
