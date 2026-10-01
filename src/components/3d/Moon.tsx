"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

const J2000_TIMESTAMP = 946728000000;
const EARTH_DISTANCE = 16;
const EARTH_PERIOD = 365.25;
const EARTH_START_ANGLE = 1.75;

const MOON_PERIOD = 27.32; 
const MOON_DISTANCE = 2.8; 

export default function Moon({ timeRef, setHoveredPlanet, onPlanetClick }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const moonTexture = useTexture("/textures/moon.jpg");

  useFrame(() => {
    if (!groupRef.current) return;
    
    const daysSinceJ2000 = (timeRef.current - J2000_TIMESTAMP) / (1000 * 60 * 60 * 24);
    
    const earthAngle = EARTH_START_ANGLE + (daysSinceJ2000 / EARTH_PERIOD) * (Math.PI * 2);
    const earthX = Math.cos(earthAngle) * EARTH_DISTANCE;
    const earthZ = Math.sin(earthAngle) * EARTH_DISTANCE;

    const moonAngle = (daysSinceJ2000 / MOON_PERIOD) * (Math.PI * 2);
    const offsetX = Math.cos(moonAngle) * MOON_DISTANCE;
    const offsetZ = Math.sin(moonAngle) * MOON_DISTANCE;

    groupRef.current.position.set(earthX + offsetX, 0, earthZ + offsetZ);
    groupRef.current.rotation.y = -moonAngle; 
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);
      
      const mappedData: PlanetData = {
        id: "moon",
        name: "ЛУНА",
        radius: 0.6, 
        distance: EARTH_DISTANCE,
        period: 0,
        startAngle: 0,
        textureMap: "",
        type: "ЕСТЕСТВЕННЫЙ СПУТНИК",
        temp: "От -173 °C до +127 °C",
        desc: "Единственный спутник Земли. Мы видим лишь одну её сторону благодаря синхронному вращению. Расстояние от Земли: ~384 400 км."
      };
      onPlanetClick(mappedData, worldPosition);
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setHoveredPlanet("Луна"); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
    >
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        {/* Применяем текстуру, как в твоем коде */}
        <meshStandardMaterial map={moonTexture} roughness={1} metalness={0} />
      </mesh>

      {hovered && (
        <Html distanceFactor={25} position={[0, 0.7, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-gray-800/80 border border-gray-500 text-white px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            ЛУНА
          </div>
        </Html>
      )}
    </group>
  );
}