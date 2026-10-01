"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

// --- КОМПОНЕНТ ЛУНЫ ---
function Moon({ radius, distance, speed }: { radius: number; distance: number; speed: number }) {
  const orbitRef = useRef<THREE.Group>(null);
  const moonTexture = useTexture("/textures/moon.jpg");

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={orbitRef}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={moonTexture} roughness={1} />
      </mesh>
    </group>
  );
}

// --- КОМПОНЕНТ МКС ---
function ISS({ distance, speed }: { distance: number; speed: number }) {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // МКС летит по орбите значительно быстрее Луны
    if (orbitRef.current) orbitRef.current.rotation.y += delta * speed;
  });

  return (
    // Наклоняем орбиту МКС, чтобы она летала не строго по экватору
    <group ref={orbitRef} rotation={[Math.PI / 6, 0, 0]}>
      <group position={[distance, 0, 0]}>
        {/* Основной модуль (Металлический цилиндр) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Солнечные панели (Синие пластины) */}
        <mesh>
          <boxGeometry args={[0.08, 0.01, 0.25]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// --- ГЛАВНЫЙ КОМПОНЕНТ ПЛАНЕТЫ ---
type PlanetProps = {
  data: PlanetData;
  isPaused: boolean;
  showOrbit: boolean;
  setHoveredPlanet: (name: string | null) => void;
  onPlanetClick: (data: PlanetData, position: THREE.Vector3) => void;
};

export default function Planet({ data, isPaused, showOrbit, setHoveredPlanet, onPlanetClick }: PlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const texture = useTexture(data.textureMap);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (orbitRef.current && !isPaused) {
      orbitRef.current.rotation.y += delta * data.speed;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2; 
    }
    
    if (materialRef.current) {
      const targetIntensity = hovered ? 0.3 : 0;
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        delta * 5
      );
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (planetRef.current) {
      const worldPosition = new THREE.Vector3();
      planetRef.current.getWorldPosition(worldPosition);
      onPlanetClick(data, worldPosition);
    }
  };

  return (
    <group ref={orbitRef}>
      
      {showOrbit && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* ЛОКАЛЬНАЯ ГРУППА ПЛАНЕТЫ */}
      <group position={[data.distance, 0, 0]}>
        
        <mesh 
          ref={planetRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setHoveredPlanet(data.name); document.body.style.cursor = "pointer"; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setHoveredPlanet(null); document.body.style.cursor = "auto"; }}
          onClick={handleClick}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial ref={materialRef} map={texture} emissive="white" emissiveIntensity={0} />
          
          {hovered && (
            <Html distanceFactor={25} position={[0, data.radius + 0.8, 0]} center zIndexRange={[100, 0]}>
              <div className="bg-black/60 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md pointer-events-none text-sm animate-pulse">
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

        {/* --- ЛУНА --- */}
        {/* Радиус Луны примерно в 4 раза меньше Земли, дистанция отнесена подальше */}
        {data.hasMoon && (
          <Moon radius={data.radius * 0.27} distance={data.radius + 2.5} speed={0.8} />
        )}

        {/* --- МКС --- */}
        {/* МКС летит очень низко над поверхностью и гораздо быстрее */}
        {data.hasISS && (
          <ISS distance={data.radius + 0.2} speed={2.5} />
        )}
        
      </group>
    </group>
  );
}