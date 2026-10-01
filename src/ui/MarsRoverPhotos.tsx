"use client";

import { useState, useEffect } from "react";

// Резервные данные
const FALLBACK_PHOTO = {
  img_src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg/800px-PIA16239_High-Resolution_Self-Portrait_by_Curiosity_Rover_Arm_Camera.jpg",
  sol: "RESERVE",
  earth_date: "2015-05-30",
  camera: { name: "MAHLI" }
};

export default function MarsRoverPhotos() {
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Получаем текущую дату
    const date = new Date();
    // 2. Отнимаем 3 дня назад (чтобы данные от марсохода точно успели дойти до серверов)
    date.setDate(date.getDate() - 3);
    // 3. Форматируем в нужный для API вид: YYYY-MM-DD
    const dynamicDate = date.toISOString().split('T')[0];

    // Подставляем динамическую дату в URL через шаблонную строку (обратные кавычки)
    fetch(`https://rovers.nebulum.one/api/v1/rovers/curiosity/photos?earth_date=${dynamicDate}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          // Берем первую фотографию из свежих
          setPhoto(data.photos[0]); 
        } else {
          // Если за этот день фоток нет, берем резервную
          setPhoto(FALLBACK_PHOTO);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Сервер недоступен. Загрузка резервных данных...", err.message);
        setPhoto(FALLBACK_PHOTO);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mt-4 border border-blue-500/30 bg-blue-900/10 p-4 rounded-lg flex items-center justify-center h-32 md:h-48 animate-pulse">
        <span className="text-[10px] md:text-xs font-mono text-blue-400 tracking-widest">
          УСТАНОВКА СВЯЗИ С CURIOSITY...
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 border border-white/10 bg-white/5 p-3 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
      
      {/* Декоративная линия */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-400 to-transparent opacity-50" />

      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <p className="text-[10px] md:text-xs text-green-400 font-mono tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          СВЯЗЬ УСТАНОВЛЕНА
        </p>
        <p className="text-[10px] md:text-xs text-gray-400 font-mono">
          SOL {photo.sol}
        </p>
      </div>
      
      <div className="relative w-full h-32 md:h-48 rounded overflow-hidden border border-white/5 bg-black">
        {/* Я убрал grayscale, теперь картинка будет такой, какая она есть в оригинале */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={photo.img_src} 
          alt="Mars Surface" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Легкий скан-эффект (блик) поверх фото */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-scan pointer-events-none" />
      </div>
      
      <div className="flex justify-between items-center pt-1">
        <p className="text-[9px] text-gray-500 font-mono uppercase">
          ДАТА: {photo.earth_date}
        </p>
        <p className="text-[9px] text-gray-400 font-mono uppercase text-right">
          КАМЕРА: {photo.camera.name}
        </p>
      </div>
    </div>
  );
}