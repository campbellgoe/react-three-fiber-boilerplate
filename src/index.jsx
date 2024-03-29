import { StrictMode, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { OrbitControls, useGLTF  } from '@react-three/drei'

import "./tailwind.output.css";

import './styles.css'
useGLTF.preload('./models/shoe-draco.glb')
const Shoe = () => {
  const { nodes, materials } = useGLTF('/models/shoe-draco.glb')
  return (<group
      dispose={null}
    >
      <mesh geometry={nodes.shoe.geometry} material={materials.laces} />
      <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} />
      <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} />
      <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} />
      <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} />
      <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} />
      <mesh geometry={nodes.shoe_6.geometry} material={materials.band} />
      <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} />
    </group>
  )
}
const Scene = ({ color = 0x00ff00, vector = [0, 0, 0] } = {}) => {
  const boxMeshRef = useRef()
  const [newColor, setNewColor] = useState(color);
  useEffect(() => {
    setNewColor(color)
  }, [color])
  useEffect(() => {
    if (boxMeshRef.current) {
      boxMeshRef.current.position.x += vector[0]
      boxMeshRef.current.position.y += vector[1]
      boxMeshRef.current.position.z += vector[2]
      // boxMeshRef.current.
    }
  }, [vector])
  const [hovered, setHover] = useState(false)

  return (
    <>
      <mesh ref={boxMeshRef} scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
        <boxGeometry />
        <meshStandardMaterial color={newColor} emissive={0xffffff} emissiveIntensity={hovered ? 0.03 : 0} />
      </mesh>
      <ambientLight intensity={Math.PI * 0.1} />
      <pointLight position={[0, 1, 1]} />

    </>
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
  const [vector, setVector] = useState([0, 0, 0])
  useEffect(() => {
    const onDocumentKey = (e) => {
      console.log(e.code)
      const code = e.code
      const codeMap = {
        KeyW: [0, 0, -1],
        KeyS: [0, 0, 1],
        KeyA: [-1, 0, 0],
        KeyD: [1, 0, 0],
        KeyQ: [0, 1, 0],
        KeyE: [0, -1, 0],
      }
      if (code in codeMap) {
        const vector = codeMap[code]
        setVector(vector)
      } else {
        setVector([0, 0, 0])
      }

    }
    document.addEventListener('keydown', onDocumentKey)
    return () => {
      document.removeEventListener('keydown', onDocumentKey)
    }
  }, [])
  return <><input className="absolute z-50 right-0" type="color" value={stringColor} onChange={e => {
    color.current = colorStringToNumber(e.target.value)
    rerender()
  }} />
    <Canvas camera={{ position: [0, 0, 2] }}>
      <Perf position="top-left" />
      <Scene color={color.current} vector={vector} />
      <Shoe/>
      <OrbitControls />
    </Canvas>
  </>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)