"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Starfield({ count = 8000 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // useMemo гарантирует, что мы вычисляем массив только один раз при монтировании
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Генерируем звезды в огромной сфере вокруг Солнечной системы (радиус от 150 до 400)
      const r = 150 + Math.random() * 250;

      // Используем сферические координаты для равномерного распределения по объему
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      // Переводим сферические координаты в декартовы (x, y, z)
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  // Медленно вращаем всю небесную сферу, создавая эффект динамики
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        color="#ffffff"
        transparent
        opacity={0.8}
        // sizeAttenuation делает звезды меньше при отдалении камеры (эффект 3D-глубины)
        sizeAttenuation={true}
      />
    </points>
  );
}
