export type PlanetData = {
  id: string;
  name: string;
  radius: number;
  distance: number;
  speed: number;
  textureMap: string;
  type?: string;
  temp?: string;
  desc?: string;
  hasRings?: boolean;
  hasMoon?: boolean;
  hasISS?: boolean;
};

export const planetsData: PlanetData[] = [
  {
    id: "mercury", 
    name: "Меркурий", 
    radius: 0.4, 
    distance: 6, 
    speed: 0.4, 
    textureMap: "/textures/mercury.jpg",
    type: "Каменистая планета", 
    temp: "от -173°C до 427°C",
    desc: "Ближайшая к Солнцу планета. Из-за отсутствия атмосферы она не может удерживать тепло, что приводит к экстремальным перепадам температур."
  },
  {
    id: "venus", 
    name: "Венера", 
    radius: 0.8, 
    distance: 11, 
    speed: 0.3, 
    textureMap: "/textures/venus.jpg",
    type: "Каменистая планета", 
    temp: "Около 462°C",
    desc: "Самая горячая планета в системе из-за крайне плотной атмосферы и мощного парникового эффекта. Вращается вокруг своей оси в обратном направлении."
  },
  {
    id: "earth", 
    name: "Земля", 
    radius: 1, 
    distance: 16, 
    speed: 0.25, 
    textureMap: "/textures/earth.jpg",
    type: "Каменистая планета (Обитаемая)", 
    temp: "В среднем 15°C",
    desc: "Единственный известный мир во Вселенной, где существует жизнь. Более 70% поверхности покрыто жидкой водой.",
    hasMoon: true,
    hasISS: true
  },
  {
    id: "mars", 
    name: "Марс", 
    radius: 0.6, 
    distance: 21, 
    speed: 0.2, 
    textureMap: "/textures/mars.jpg",
    type: "Каменистая планета", 
    temp: "от -153°C до 20°C",
    desc: "«Красная планета», получившая свой цвет из-за оксида железа на поверхности. Здесь находится Олимп — самый высокий вулкан в Солнечной системе."
  },
  {
    id: "jupiter", 
    name: "Юпитер", 
    radius: 2.2, 
    distance: 32, 
    speed: 0.1, 
    textureMap: "/textures/jupiter.jpg",
    type: "Газовый гигант", 
    temp: "Около -108°C",
    desc: "Крупнейшая планета системы. Представляет собой газовый шар без твердой поверхности, знаменитый Большим красным пятном — гигантским вековым штормом."
  },
  {
    id: "saturn", 
    name: "Сатурн", 
    radius: 1.8, 
    distance: 43, 
    speed: 0.07, 
    textureMap: "/textures/saturn.jpg",
    type: "Газовый гигант", 
    temp: "Около -139°C",
    desc: "Вторая по величине планета, знаменитая своей невероятно красивой и массивной системой колец, состоящих преимущественно из частиц льда и пыли.",
    hasRings: true
  },
  {
    id: "uranus", 
    name: "Уран", 
    radius: 1.4, 
    distance: 54, 
    speed: 0.05, 
    textureMap: "/textures/uranus.jpg",
    type: "Ледяной гигант", 
    temp: "Около -195°C",
    desc: "Уникален тем, что вращается практически «на боку» — ось его вращения сильно наклонена. Метан в атмосфере придает ему характерный бледно-голубой оттенок."
  },
  {
    id: "neptune", 
    name: "Нептун", 
    radius: 1.3, 
    distance: 65, 
    speed: 0.04, 
    textureMap: "/textures/neptune.jpg",
    type: "Ледяной гигант", 
    temp: "Около -201°C",
    desc: "Самая дальняя от Солнца планета. Отличается глубоким синим цветом и самыми сильными ветрами в Солнечной системе, скорость которых превышает 2000 км/ч."
  }
];