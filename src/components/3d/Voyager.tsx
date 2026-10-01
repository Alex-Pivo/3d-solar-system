"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

export default function Voyager({ setHoveredPlanet, onPlanetClick }: any) {
  const groupRef = useRef<THREE.Group>(null);

  const VOYAGER_DISTANCE = 180; 
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);

      const baseDate = new Date("2024-01-01").getTime();
      const secondsPassed = (Date.now() - baseDate) / 1000;
      const currentDistanceMln = (24300000000 + (secondsPassed * 17)) / 1000000;
      
      const mappedData: PlanetData = {
        id: "voyager",
        name: "ВОЯДЖЕР-1",
        radius: 0.5, 
        distance: VOYAGER_DISTANCE,
        period: 0,
        startAngle: 0,
        textureMap: "",
        type: "АВТОМАТИЧЕСКИЙ ЗОНД",
        temp: "-270 °C",
        // Мы вставили HTML-тег <img> прямо в описание!
        desc: `Самый далекий рукотворный объект. Летит со скоростью 17 км/с на расстоянии ${currentDistanceMln.toFixed(2)} млн км от Земли. В 1990 году зонд обернулся и сделал последнюю фотографию нашего дома — знаменитую «Pale Blue Dot» (Бледно-голубая точка). Земля на ней — всего лишь пиксель.<br/><br/><img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Pale_Blue_Dot.png" alt="Pale Blue Dot" class="w-full mt-2 rounded border border-white/20" />`
      };
      onPlanetClick(mappedData, worldPosition);
    }
  };

  return (
    <group ref={groupRef} position={[VOYAGER_DISTANCE, 5, 20]} onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHoveredPlanet("Вояджер-1"); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
    >
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#dddddd" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.3, 0.1, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.2} />
      </mesh>

      {/* Уменьшили distanceFactor до 15 и сделали шрифт мельче (text-[9px]) */}
      <Html distanceFactor={15} position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
        <div className="bg-gray-900/80 border border-gray-500 text-white px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
          ВОЯДЖЕР-1
        </div>
      </Html>
    </group>
  );
}