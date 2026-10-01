"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

// Данные о Солнце для правой панели
const sunData: PlanetData = {
  id: "sun",
  name: "СОЛНЦЕ",
  radius: 2, // Установили 2, так как в твоей геометрии args={[2, 32, 32]}
  distance: 0, 
  period: 0,
  startAngle: 0,
  textureMap: "", 
  type: "ЖЕЛТЫЙ КАРЛИК (G2V)",
  temp: "Ядро: 15 млн °C",
  desc: "Центральная звезда нашей системы. Огромный раскаленный плазменный шар, внутри которого каждую секунду миллионы тонн водорода превращаются в гелий."
};

type SunProps = {
  setHoveredPlanet: (name: string | null) => void;
  onPlanetClick: (data: PlanetData, position: THREE.Vector3) => void;
};

export default function Sun({ setHoveredPlanet, onPlanetClick }: SunProps) {
  const texture = useTexture("/textures/sun.jpg");
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Легкое вращение для реалистичности
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (meshRef.current) {
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);
      onPlanetClick(sunData, worldPosition);
    }
  };

  return (
    <mesh 
      ref={meshRef}
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        setHovered(true); 
        setHoveredPlanet(sunData.name); 
        document.body.style.cursor = "pointer"; 
      }}
      onPointerOut={(e) => { 
        e.stopPropagation(); 
        setHovered(false); 
        setHoveredPlanet(null); 
        document.body.style.cursor = "auto"; 
      }}
    >
      <sphereGeometry args={[2, 32, 32]} />
      
      {/* Твой оригинальный материал */}
      <meshBasicMaterial 
        map={texture} 
        toneMapped={false}
        color={[2, 2, 2]} 
      />
      
      {/* Твой оригинальный свет */}
      <pointLight intensity={120} decay={1} distance={300} color="white" />

      {/* Ярлык при наведении мыши (появляется чуть выше сферы) */}
      {hovered && (
        <Html distanceFactor={25} position={[0, 2.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-orange-900/80 border border-orange-500 text-white px-3 py-1 rounded-full text-xs font-mono animate-pulse whitespace-nowrap shadow-[0_0_15px_rgba(255,165,0,0.5)]">
            {sunData.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}