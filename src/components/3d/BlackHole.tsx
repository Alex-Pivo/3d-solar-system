"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BlackHole() {
  const horizontalDiskRef = useRef<THREE.Points>(null);
  const haloGroupRef = useRef<THREE.Group>(null);
  const haloMeshRef = useRef<THREE.Points>(null);

  // 1. Главный горизонтальный аккреционный диск
  const [diskPositions, diskColors] = useMemo(() => {
    const count = 20000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 2.6 + Math.random() * 5.0; 
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.1;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      const mix = 1 - (radius - 2.6) / 5.0;
      const color = new THREE.Color('#111111').lerp(
        new THREE.Color('#ffaa77'), 
        mix
      );

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  // 2. Оптическая иллюзия гравитационной линзы (Гало - теперь ПОЛНЫЙ круг)
  const [haloPositions, haloColors] = useMemo(() => {
    const count = 20000; // Немного увеличили количество частиц для плотности
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 2.05 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      
      // Рисуем кольцо в плоской проекции
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1; 

      // Убрали формулу с синусом! 
      // Теперь свечение равномерное по всему кругу и зависит только от того, насколько близко частица к центру
      const mix = 1 - (radius - 2.05) / 1.5;
      
      const color = new THREE.Color('#000000').lerp(
        new THREE.Color('#ffcc88'),
        mix
      );

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ camera }, delta) => {
    if (horizontalDiskRef.current) {
      horizontalDiskRef.current.rotation.y -= delta * 0.15;
    }
    
    // Гало всегда поворачивается точно в камеру
    if (haloGroupRef.current) {
      haloGroupRef.current.quaternion.copy(camera.quaternion);
      if (haloMeshRef.current) {
        haloMeshRef.current.rotation.z -= delta * 0.15;
      }
    }
  });

  return (
    <group>

      {/* Горизонт событий - Идеально черная сфера. Убрали оранжевую оболочку, чтобы цвет был чистым */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Настоящий аккреционный диск */}
      <group rotation={[0.1, 0, -0.1]}>
        <points ref={horizontalDiskRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[diskPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[diskColors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.03} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>

      {/* Фейковая гравитационная линза (Полное кольцо) */}
      <group ref={haloGroupRef}>
        <points ref={haloMeshRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[haloPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[haloColors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>
    </group>
  );
}