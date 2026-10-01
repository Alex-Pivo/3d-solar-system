"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";


// --- ГЛАВНЫЙ КОМПОНЕНТ ПЛАНЕТЫ ---
type PlanetProps = {
  data: PlanetData;
  showOrbit: boolean;
  timeRef: React.MutableRefObject<number>; // Ссылка на глобальное время симуляции
  setHoveredPlanet: (name: string | null) => void;
  onPlanetClick: (data: PlanetData, position: THREE.Vector3) => void;
};

// Константа эпохи J2000 (1 января 2000)
const J2000_TIMESTAMP = 946728000000;

export default function Planet({ data, showOrbit, timeRef, setHoveredPlanet, onPlanetClick }: PlanetProps) {
  const planetGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(data.textureMap);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (planetGroupRef.current) {
      // Вычисляем, сколько дней прошло в нашей симуляции с 2000 года
      const daysSinceJ2000 = (timeRef.current - J2000_TIMESTAMP) / (1000 * 60 * 60 * 24);
      
      // Формула текущего угла орбиты
      const currentAngle = data.startAngle + (daysSinceJ2000 / data.period) * (Math.PI * 2);

      // Перемещаем группу планеты по орбите
      planetGroupRef.current.position.x = Math.cos(currentAngle) * data.distance;
      planetGroupRef.current.position.z = Math.sin(currentAngle) * data.distance;
    }

    // Вращение самой планеты вокруг своей оси
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

const handleClick = (e: any) => {
    e.stopPropagation();
    if (planetGroupRef.current) {
      const worldPosition = new THREE.Vector3();
      planetGroupRef.current.getWorldPosition(worldPosition);
      onPlanetClick(data, worldPosition);
    }
  };

  return (
    <group>
      
      {showOrbit && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* ЛОКАЛЬНАЯ ГРУППА ПЛАНЕТЫ */}
      <group ref={planetGroupRef}>
        
        <mesh 
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setHoveredPlanet(data.name); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
          onClick={handleClick}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial map={texture} />
          
          {hovered && (
            <Html distanceFactor={25} position={[0, data.radius + 0.8, 0]} center zIndexRange={[100, 0]}>
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                {data.name}
              </div>
            </Html>
          )}
        </mesh>

        {/* --- КОЛЬЦА --- */}
        {data.hasRings && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.radius * 1.4, data.radius * 2.5, 64]} />
            <meshStandardMaterial color="#d4c5b0" side={THREE.DoubleSide} transparent opacity={0.6} roughness={0.8} />
          </mesh>
        )}
       
        
      </group>
    </group>
  );
}