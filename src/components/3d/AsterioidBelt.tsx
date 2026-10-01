"use client";

import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AsteroidBelt({ count = 2000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const radius = 22 + Math.random() * 8; 
        
        const theta = Math.random() * Math.PI * 2; 
        
        const y = (Math.random() - 0.5) * 3; 

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        dummy.position.set(x, y, z);

        dummy.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        // Задаем случайный размер (от 0.05 до 0.2)
        const scale = Math.random() * 0.15 + 0.05;
        dummy.scale.set(scale, scale, scale);

        // Обновляем матрицу объекта и записываем её в нужный инстанс
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      
      // Даем команду Three.js обновить данные на видеокарте
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, dummy]);

  // Медленно вращаем весь пояс целиком вокруг Солнца
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    // args: [геометрия (передаем как дочерний элемент), материал, количество]
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* 1 - радиус, 0 - отсутствие сглаживания (low-poly эффект) */}
      <dodecahedronGeometry args={[1, 0]} />
      
      {/* Темно-серый, шершавый материал */}
      <meshStandardMaterial color="#666666" roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}