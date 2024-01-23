import { StrictMode, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import "./tailwind.output.css";

import './styles.css'

const Scene = ({ color = 0x00ff00 } = {}) => {
  const [newColor, setNewColor] = useState(color);
  useEffect(() => {
    setNewColor(color)
  }, [color])
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color={newColor} wireframe />
    </mesh>
  )
}

const useRerender = () => {
  const [tick, setTick] = useState(0)
  return () => setTick(tick + 1)
}
const colorStringToNumber = val => parseInt(val.replace('#', '0x'))
const colorNumberToString = val => '#' + val.toString(16)
const App = () => {
  const color = useRef(0x00ff00)
  const stringColor = useMemo(() => colorNumberToString(color.current), [color.current])
  const rerender = useRerender()
  return <><input className="absolute z-50" type="color" value={stringColor} onChange={e => {
    color.current = colorStringToNumber(e.target.value)
    rerender()
  }} />
    <Canvas camera={{ position: [0, 0, 2] }}>
      <Scene color={color.current} />
    </Canvas>
  </>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)