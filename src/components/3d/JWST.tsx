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

export default function JWST({ timeRef, setHoveredPlanet, onPlanetClick }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const daysSinceJ2000 = (timeRef.current - J2000_TIMESTAMP) / (1000 * 60 * 60 * 24);
    const earthAngle = EARTH_START_ANGLE + (daysSinceJ2000 / EARTH_PERIOD) * (Math.PI * 2);
    
    // Отодвинули чуть дальше от Земли, чтобы не пересекался с МКС (2.0 вместо 1.5)
    const l2Distance = EARTH_DISTANCE + 2.0; 
    
    groupRef.current.position.x = Math.cos(earthAngle) * l2Distance;
    groupRef.current.position.z = Math.sin(earthAngle) * l2Distance;
    
    groupRef.current.rotation.y = -earthAngle; 
  });

  const handleClick = async (e: any) => {
    e.stopPropagation();
    
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);

      let imgLink = "Фотография обрабатывается...";
      try {
        const res = await fetch("https://images-api.nasa.gov/search?q=james+webb&media_type=image");
        const data = await res.json();
        const firstItem = data.collection.items[0];
        if (firstItem) imgLink = `Последнее фото: ${firstItem.data[0].title}`;
      } catch (err) {
        console.error("JWST API Error", err);
      }

      const mappedData: PlanetData = {
        id: "jwst",
        name: "ДЖЕЙМС УЭББ (JWST)",
        radius: 0.3, 
        distance: EARTH_DISTANCE + 2.0,
        period: 0,
        startAngle: 0,
        textureMap: "",
        type: "КОСМИЧЕСКАЯ ОБСЕРВАТОРИЯ",
        temp: "Зеркала: -233 °C",
        desc: `Находится в точке Лагранжа L2, ЗА Землей, защищен от солнечного тепла огромным экраном. ${imgLink}`
      };
      onPlanetClick(mappedData, worldPosition);
    }
  };

  return (
    <group ref={groupRef} onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setHoveredPlanet("JWST"); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
    >
      {/* УМЕНЬШИЛИ МАСШТАБ И ПОВЕРНУЛИ */}
      <group scale={0.25} rotation={[0, Math.PI, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 6]} />
          <meshStandardMaterial color="#ffcc00" metalness={1} roughness={0.1} />
        </mesh>
        
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.4]} />
          <meshStandardMaterial color="#cda4de" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {hovered && (
        <Html distanceFactor={20} position={[0, 0.5, 0]} center>
          <div className="bg-purple-900/80 border border-purple-500 text-white px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap">
            ДЖЕЙМС УЭББ
          </div>
        </Html>
      )}
    </group>
  );
}