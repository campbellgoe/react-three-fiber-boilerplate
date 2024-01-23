import { StrictMode, useEffect, useRef, useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './styles.css'

const Scene = ({ color = 0x00ff00 } = {}) => {
  const [newColor, setNewColor] = useState(color);
  useEffect(() => {
    setNewColor(color)
    // setNewColor((color + 0xff0000) % 0xffffff)
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

const App = () => {
  const color = useRef(0x00ff00)
  const stringColor = useMemo(() => '#'+color.current.toString(16), [color.current])
  console.log('string color:', stringColor)
  const rerender = useRerender()
  return <><input type="color" value={stringColor} onChange={e => {
    color.current = parseInt(e.target.value.replace('#', '0x'))
    rerender()
  }}/><code>Colour: {(color.current+"").replace('0x', '#')}</code>
   <Canvas camera={{ position: [0, 0, 2] }}>
      <Scene color={color.current} />
      </Canvas>
      </>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>
)