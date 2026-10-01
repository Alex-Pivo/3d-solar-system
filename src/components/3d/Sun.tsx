"use client";

import { useTexture } from "@react-three/drei";

export default function Sun() {
  const texture = useTexture("/textures/sun.jpg");

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial 
        map={texture} 
        toneMapped={false}
        color={[2, 2, 2]} 
      />
      <pointLight intensity={120} decay={1} distance={300} color="white" />
    </mesh>
  );
}