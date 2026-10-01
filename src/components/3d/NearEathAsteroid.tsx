"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

type NearEarthAsteroidProps = {
  timeValue: number; // Добавили стейт времени из ползунка
  timeRef: React.MutableRefObject<number>;
  setHoveredPlanet: (name: string | null) => void;
  onPlanetClick: (data: PlanetData, position: THREE.Vector3) => void;
};

const J2000_TIMESTAMP = 946728000000;
const EARTH_DISTANCE = 16;
const EARTH_PERIOD = 365.25;
const EARTH_START_ANGLE = 1.75;

export default function NearEarthAsteroid({
  timeValue,
  timeRef,
  setHoveredPlanet,
  onPlanetClick,
}: NearEarthAsteroidProps) {
  const [neoData, setNeoData] = useState<any>(null);
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    // 1. Устанавливаем таймер, чтобы не спамить запросами при перетаскивании ползунка
    const debounceTimer = setTimeout(() => {
      // 2. Берем дату именно из ползунка (машины времени)
      const simDate = new Date(timeValue).toISOString().split("T")[0];

      // ВСТАВЬ СВОЙ КЛЮЧ ОТ NASA ВОТ СЮДА:
      fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${simDate}&end_date=${simDate}&api_key=XBhVep5tRevL0sNoEdZo3AoBB7xu3QR3u8GCXbx5`,
      )
        .then((res) => {
          if (!res.ok) throw new Error("API Error");
          return res.json();
        })
        .then((data) => {
          if (data.near_earth_objects && data.near_earth_objects[simDate]) {
            const dailyNeos = data.near_earth_objects[simDate];
            if (dailyNeos.length > 0) {
              const hazard = dailyNeos.find(
                (n: any) => n.is_potentially_hazardous_asteroid,
              );
              setNeoData(hazard || dailyNeos[0]);
            } else {
              setNeoData(null); // В этот день пусто
            }
          }
        })
        .catch((err) => console.error("NeoWs API error:", err));
    }, 800); // Запрос уйдет только если ползунок не двигали 0.8 секунд

    // 3. Очищаем таймер, если пользователь снова дернул ползунок
    return () => clearTimeout(debounceTimer);
  }, [timeValue]); // Эффект перезапускается каждый раз при изменении timeValue

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const daysSinceJ2000 =
      (timeRef.current - J2000_TIMESTAMP) / (1000 * 60 * 60 * 24);
    const earthAngle =
      EARTH_START_ANGLE + (daysSinceJ2000 / EARTH_PERIOD) * (Math.PI * 2);

    const earthX = Math.cos(earthAngle) * EARTH_DISTANCE;
    const earthZ = Math.sin(earthAngle) * EARTH_DISTANCE;

    const asteroidAngle = daysSinceJ2000 * 0.5;
    const offsetX = Math.cos(asteroidAngle) * 1.5;
    const offsetZ = Math.sin(asteroidAngle) * 1.5;

    groupRef.current.position.set(earthX + offsetX, 0.5, earthZ + offsetZ);

    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        2 + Math.sin(Date.now() * 0.005) * 1;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (groupRef.current && neoData) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);

      const sizeMeters = Math.round(
        neoData.estimated_diameter.meters.estimated_diameter_max,
      );
      const missDistMlnKm = (
        neoData.close_approach_data[0].miss_distance.kilometers / 1000000
      ).toFixed(2);
      const speedKmH = parseFloat(
        neoData.close_approach_data[0].relative_velocity.kilometers_per_hour,
      ).toFixed(0);

      // === ДИНАМИЧЕСКОЕ СКЛОНЕНИЕ ВРЕМЕНИ ===
      const todayStr = new Date().toISOString().split("T")[0];
      const simDateStr = new Date(timeValue).toISOString().split("T")[0];

      let actionVerb = "Пролетает сегодня";
      if (simDateStr < todayStr) actionVerb = "Пролетал";
      else if (simDateStr > todayStr) actionVerb = "Пролетит";

      const mappedData: PlanetData = {
        id: "neo",
        name: neoData.name.replace("(", "").replace(")", ""),
        radius: 0.2,
        distance: EARTH_DISTANCE,
        period: 0,
        startAngle: 0,
        textureMap: "",
        type: neoData.is_potentially_hazardous_asteroid
          ? "⚠️ ОПАСНЫЙ ОБЪЕКТ"
          : "ОКОЛОЗЕМНЫЙ АСТЕРОИД",
        temp: "Неизвестно",
        desc: `Диаметр: около ${sizeMeters} метров. ${actionVerb} мимо Земли на расстоянии ${missDistMlnKm} млн км. Скорость: ${speedKmH} км/ч.`,
      };

      onPlanetClick(mappedData, worldPosition);
    }
  };

  // Пока данные грузятся или если в этот день астероидов нет - ничего не рендерим
  if (!neoData) return null;

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredPlanet(neoData.name);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setHoveredPlanet(null);
          document.body.style.cursor = "auto";
        }}
      >
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#ff2222"
          emissive="#ff0000"
          roughness={0.8}
        />
      </mesh>

      {hovered && (
        <Html
          distanceFactor={25}
          position={[0, 0.4, 0]}
          center
          zIndexRange={[100, 0]}
        >
          <div className="bg-red-900/80 border border-red-500 text-white px-3 py-1 rounded-full text-xs font-mono animate-pulse whitespace-nowrap">
            {neoData.name}
          </div>
        </Html>
      )}
    </group>
  );
}
