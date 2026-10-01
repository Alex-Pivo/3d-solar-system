"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

const J2000_TIMESTAMP = 946728000000;
const EARTH_DISTANCE = 16;
const EARTH_PERIOD = 365.25;
const EARTH_START_ANGLE = 1.75;

export default function ISS({ timeRef, setHoveredPlanet, onPlanetClick, isFocused }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [issData, setIssData] = useState<any>(null);
  
  // Создаем локальную переменную для орбиты МКС
  const issOrbitAngle = useRef(0);

  const fetchISS = async () => {
    try {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      const data = await res.json();
      setIssData(data);
    } catch (e) {
      console.error("Ошибка API МКС", e);
    }
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const daysSinceJ2000 = (timeRef.current - J2000_TIMESTAMP) / (1000 * 60 * 60 * 24);
    
    // Земля всё еще движется
    const earthAngle = EARTH_START_ANGLE + (daysSinceJ2000 / EARTH_PERIOD) * (Math.PI * 2);
    const earthX = Math.cos(earthAngle) * EARTH_DISTANCE;
    const earthZ = Math.sin(earthAngle) * EARTH_DISTANCE;

    // ЕСЛИ НА МКС НЕ НАЖАЛИ - она летит. ЕСЛИ НАЖАЛИ - она застывает над Землей
    if (!isFocused) {
      issOrbitAngle.current += delta * 1.5;
    }
    
    const offsetX = Math.cos(issOrbitAngle.current) * 1.5;
    const offsetZ = Math.sin(issOrbitAngle.current) * 1.5;
    const offsetY = Math.sin(issOrbitAngle.current * 0.5) * 0.8; 

    groupRef.current.position.set(earthX + offsetX, offsetY, earthZ + offsetZ);
    
    if (!isFocused) groupRef.current.rotation.y += delta * 0.5;
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    fetchISS().then(() => {
      if (groupRef.current) {
        const worldPosition = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPosition);
        
        const mappedData: PlanetData = {
          id: "iss",
          name: "МКС",
          radius: 0.2, 
          distance: EARTH_DISTANCE,
          period: 0,
          startAngle: 0,
          textureMap: "",
          type: "ОРБИТАЛЬНАЯ СТАНЦИЯ",
          temp: "Внутри: 22 °C",
          desc: issData 
            ? `Прямо сейчас летит со скоростью ${Math.round(issData.velocity)} км/ч на высоте ${Math.round(issData.altitude)} км. Широта: ${issData.latitude.toFixed(2)}, Долгота: ${issData.longitude.toFixed(2)}.`
            : "Самый дорогой объект, построенный человечеством."
        };
        onPlanetClick(mappedData, worldPosition);
      }
    });
  };

  return (
    <group ref={groupRef} onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setHoveredPlanet("МКС"); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
    >
      <group scale={0.35}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.4, 0.02, 0.2]} />
          <meshStandardMaterial color="#1133ee" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry args={[0.4, 0.02, 0.2]} />
          <meshStandardMaterial color="#1133ee" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {hovered && (
        <Html distanceFactor={15} position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-blue-900/80 border border-blue-500 text-white px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap">
            МКС
          </div>
        </Html>
      )}
    </group>
  );
}