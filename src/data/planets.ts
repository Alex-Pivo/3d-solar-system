export type PlanetData = {
  id: string;
  name: string;
  radius: number;
  distance: number;
  period: number; // Период обращения в земных днях
  startAngle: number; // Начальный угол орбиты (в радианах)
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
    period: 88,
    startAngle: 4.4,
    textureMap: "/textures/mercury.jpg",
    type: "Каменистая планета",
    temp: "от -173°C до 427°C",
    desc: "Ближайшая к Солнцу планета. Не имеет атмосферы.",
  },
  {
    id: "venus",
    name: "Венера",
    radius: 0.8,
    distance: 11,
    period: 225,
    startAngle: 3.17,
    textureMap: "/textures/venus.jpg",
    type: "Каменистая планета",
    temp: "Около 462°C",
    desc: "Самая горячая планета в системе из-за плотной атмосферы.",
  },
  {
    id: "earth",
    name: "Земля",
    radius: 1,
    distance: 16,
    period: 365.25,
    startAngle: 1.75,
    textureMap: "/textures/earth.jpg",
    type: "Каменистая (Обитаемая)",
    temp: "15°C",
    desc: "Единственный известный мир с жизнью.",
    hasMoon: true,
    hasISS: true,
  },
  {
    id: "mars",
    name: "Марс",
    radius: 0.6,
    distance: 21,
    period: 687,
    startAngle: 6.2,
    textureMap: "/textures/mars.jpg",
    type: "Каменистая планета",
    temp: "от -153°C до 20°C",
    desc: "Красная планета с высочайшим вулканом Олимп.",
  },
  {
    id: "jupiter",
    name: "Юпитер",
    radius: 2.2,
    distance: 32,
    period: 4332,
    startAngle: 0.6,
    textureMap: "/textures/jupiter.jpg",
    type: "Газовый гигант",
    temp: "-108°C",
    desc: "Крупнейшая планета системы. Защищает Землю от астероидов.",
  },
  {
    id: "saturn",
    name: "Сатурн",
    radius: 1.8,
    distance: 44,
    period: 10759,
    startAngle: 0.87,
    textureMap: "/textures/saturn.jpg",
    type: "Газовый гигант",
    temp: "-139°C",
    desc: "Планета с самой яркой и сложной системой колец.",
    hasRings: true,
  },
  {
    id: "uranus",
    name: "Уран",
    radius: 1.2,
    distance: 58,
    period: 30688,
    startAngle: 5.46,
    textureMap: "/textures/uranus.jpg",
    type: "Ледяной гигант",
    temp: "-197°C",
    desc: "Вращается «на боку», ось наклонена почти на 98 градусов.",
  },
  {
    id: "neptune",
    name: "Нептун",
    radius: 1.1,
    distance: 72,
    period: 60182,
    startAngle: 5.32,
    textureMap: "/textures/neptune.jpg",
    type: "Ледяной гигант",
    temp: "-201°C",
    desc: "Самая далекая планета, известная сверхсильными ветрами.",
  },
];
