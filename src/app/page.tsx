"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import Sun from "@/components/3d/Sun";
import Planet from "@/components/3d/Planet";
import AsteroidBelt from "@/components/3d/AsterioidBelt";
import { planetsData, PlanetData } from "@/data/planets";
import Starfield from "@/components/3d/Starfield";

export default function Home() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [displayedName, setDisplayedName] = useState<string>("");
  const [activePlanet, setActivePlanet] = useState<PlanetData | null>(null);

  // Новые стейты для тумблеров
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showHabitableZone, setShowHabitableZone] = useState<boolean>(false);

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (hoveredPlanet) setDisplayedName(hoveredPlanet);
  }, [hoveredPlanet]);

const focusOnPlanet = (planet: PlanetData, position: THREE.Vector3) => {
    setActivePlanet(planet);
    setHoveredPlanet(null);
    
    if (cameraControlsRef.current) {
      // Проверяем, мобильное ли это устройство (меньше 768px - брейкпоинт 'md' в Tailwind)
      const isMobile = window.innerWidth < 768;
      
      // Позиция камеры: на мобилках отдаляемся чуть дальше (коэффициент 8), чтобы планета не была слишком огромной
      const camX = position.x + (isMobile ? 0 : planet.radius * 2);
      const camY = position.y + planet.radius * (isMobile ? 2 : 1);
      const camZ = position.z + planet.radius * (isMobile ? 8 : 5);
      
      // Точка фокуса (target):
      // На мобилках смещаем фокус ВНИЗ (чтобы планета оказалась ВЕРХУ экрана)
      // На десктопе смещаем фокус ВПРАВО (чтобы планета оказалась СЛЕВА экрана)
      const targetX = position.x + (isMobile ? 0 : planet.radius * 1.5);
      const targetY = position.y - (isMobile ? planet.radius * 2 : 0);
      const targetZ = position.z;

      cameraControlsRef.current.setLookAt(camX, camY, camZ, targetX, targetY, targetZ, true);
    }
  };

  // Возврат к глобальному виду
  const resetView = () => {
    setActivePlanet(null);
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(0, 30, 80, 0, 0, 0, true);
    }
  };

  return (
    <main className="w-full h-screen relative overflow-hidden">
      {/* Верхний парящий заголовок (скрывается, если выбрана планета) */}
      <div
        className={`absolute top-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center ${hoveredPlanet && !activePlanet ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <h1 className="text-4xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
          {displayedName}
        </h1>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent mt-2 opacity-50" />
      </div>

      {/* Sci-Fi панель информации справа */}
     <div className={`absolute z-20 bg-black/60 backdrop-blur-xl border-white/10 flex flex-col transition-transform duration-700 ease-in-out overflow-y-auto
        /* МОБИЛЬНЫЙ СТИЛЬ: Внизу, высота 60%, скругленные края, выезжает снизу */
        bottom-0 left-0 w-full h-[60vh] border-t rounded-t-3xl p-6 pb-12
        /* ДЕСКТОПНЫЙ СТИЛЬ: Справа, на всю высоту, прямые углы, выезжает справа */
        md:top-0 md:bottom-auto md:right-0 md:left-auto md:w-1/3 md:h-full md:border-t-0 md:border-l md:rounded-none md:p-8 md:justify-center
        
        /* Логика анимации (стейты открыто/закрыто) */
        ${activePlanet 
          ? 'translate-y-0 md:translate-x-0' 
          : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }
      `}>
        {activePlanet && (
          <div className="text-white flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">{activePlanet.name}</h2>
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] md:text-xs font-mono tracking-widest text-blue-300 border border-blue-500/30">
                {activePlanet.type}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed border-l-2 border-blue-500 pl-4">
              {activePlanet.desc}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/5">
                <p className="text-[10px] md:text-xs text-gray-400 font-mono mb-1">ТЕМПЕРАТУРА</p>
                <p className="font-bold text-sm md:text-base">{activePlanet.temp}</p>
              </div>
              <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/5">
                <p className="text-[10px] md:text-xs text-gray-400 font-mono mb-1">РАДИУС</p>
                <p className="font-bold text-sm md:text-base">{activePlanet.radius * 6371} км</p>
              </div>
            </div>

            <button 
              onClick={resetView}
              // На мобилке кнопка на всю ширину для удобного тапа пальцем, на десктопе — по контенту
              className="mt-4 md:mt-8 w-full md:w-auto self-start px-8 py-4 md:py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-blue-500 hover:text-white transition-colors"
            >
              Вернуться на орбиту
            </button>
          </div>
        )}
      </div>

      {/* Панель управления HUD (Тумблеры) */}
      <div
        className={`absolute bottom-8 left-8 z-20 flex flex-col gap-3 transition-opacity duration-500 ${activePlanet ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <p className="text-xs font-mono text-gray-500 tracking-widest mb-1">
          СИСТЕМНЫЕ СЛОИ
        </p>

        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className={`px-4 py-2 text-xs font-mono tracking-widest text-left border backdrop-blur-sm transition-all duration-300 flex justify-between items-center w-48
            ${showOrbits ? "bg-white/10 border-white text-white" : "bg-black/40 border-white/10 text-gray-500"}`}
        >
          <span>ОРБИТЫ</span>
          <span
            className={`w-2 h-2 rounded-full ${showOrbits ? "bg-white" : "bg-gray-700"}`}
          />
        </button>

        <button
          onClick={() => setShowHabitableZone(!showHabitableZone)}
          className={`px-4 py-2 text-xs font-mono tracking-widest text-left border backdrop-blur-sm transition-all duration-300 flex justify-between items-center w-48
            ${showHabitableZone ? "bg-green-900/30 border-green-500 text-green-400" : "bg-black/40 border-white/10 text-gray-500"}`}
        >
          <span>ЖИЛАЯ ЗОНА</span>
          <span
            className={`w-2 h-2 rounded-full ${showHabitableZone ? "bg-green-500" : "bg-gray-700 shadow-[0_0_10px_rgba(34,197,94,0.8)]"}`}
          />
        </button>
      </div>

      <Canvas camera={{ position: [0, 30, 80], fov: 45 }}>
        <CameraControls
          ref={cameraControlsRef}
          minDistance={10}
          maxDistance={200}
          enabled={!activePlanet}
        />
        <ambientLight intensity={0.5} />

        <Suspense fallback={null}>
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          </EffectComposer>

          <Starfield count={10000} />

          <Sun />
          <AsteroidBelt count={6000} />

          {/* Обитаемая зона (охватывает орбиту Земли) */}
          {showHabitableZone && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[13, 19, 128]} />
              <meshBasicMaterial
                color="#22c55e"
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {planetsData.map((planet) => (
            <Planet
              key={planet.id}
              data={planet}
              isPaused={!!activePlanet}
              showOrbit={showOrbits} // <--- Передаем пропс
              setHoveredPlanet={setHoveredPlanet}
              onPlanetClick={focusOnPlanet}
            />
          ))}
        </Suspense>
      </Canvas>
    </main>
  );
}
