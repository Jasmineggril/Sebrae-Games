export type CropType = "milho" | "soja" | "cafe" | "cana" | "mandioca";

export interface CropDef {
  name: string;
  emoji: string;
  color: string;
  color2: string;
  growthTime: number;
  sellPrice: number;
  seedCost: number;
  xpReward: number;
  unlockLevel: number;
  fichaTitle: string;
  fichaFact: string;
  fichaStat: string;
}

export const CROPS: Record<CropType, CropDef> = {
  milho: {
    name: "Milho", emoji: "🌽", color: "#f5c518", color2: "#e8a000",
    growthTime: 20, sellPrice: 30, seedCost: 10, xpReward: 12, unlockLevel: 1,
    fichaTitle: "Milho — O Rei das Lavouras",
    fichaFact: "O Brasil produziu 137 milhões de toneladas em 2023, sendo o 2º maior exportador mundial. O milho é a base da alimentação de 8 bilhões de pessoas.",
    fichaStat: "🇧🇷 2º maior exportador · 137 mi ton/ano",
  },
  soja: {
    name: "Soja", emoji: "🫛", color: "#6dbf3e", color2: "#4a9a20",
    growthTime: 15, sellPrice: 20, seedCost: 8, xpReward: 8, unlockLevel: 1,
    fichaTitle: "Soja — Grão de Ouro Verde",
    fichaFact: "O Brasil é o maior produtor mundial de soja com 163 mi ton/ano, representando 36% da produção global. A soja movimenta R$ 400 bilhões na cadeia do agronegócio.",
    fichaStat: "🌍 1º produtor mundial · 36% da oferta global",
  },
  cafe: {
    name: "Café", emoji: "☕", color: "#8B5E3C", color2: "#5c3a1e",
    growthTime: 30, sellPrice: 50, seedCost: 18, xpReward: 22, unlockLevel: 2,
    fichaTitle: "Café — Paixão Nacional",
    fichaFact: "O Brasil lidera a produção mundial de café há 150+ anos, com 36% da oferta global. Exportou R$ 38 bilhões em 2023, gerando renda para 300 mil famílias produtoras.",
    fichaStat: "☕ 150 anos líder mundial · R$ 38 bi exportados",
  },
  cana: {
    name: "Cana", emoji: "🎋", color: "#7ec850", color2: "#5aaa30",
    growthTime: 25, sellPrice: 40, seedCost: 14, xpReward: 18, unlockLevel: 3,
    fichaTitle: "Cana — Energia do Brasil",
    fichaFact: "O etanol da cana reduz em até 90% as emissões vs gasolina. O Brasil é o 2º maior produtor mundial e exporta tecnologia de biocombustível para 70 países.",
    fichaStat: "♻️ −90% CO₂ vs gasolina · tecnologia em 70 países",
  },
  mandioca: {
    name: "Mandioca", emoji: "🥔", color: "#c8a96e", color2: "#a07840",
    growthTime: 18, sellPrice: 25, seedCost: 9, xpReward: 10, unlockLevel: 1,
    fichaTitle: "Mandioca — Raiz do Brasil",
    fichaFact: "Cultivada em todos os 26 estados brasileiros, a mandioca alimenta 800 milhões de pessoas no mundo. O Brasil é o 2º maior produtor global com 20 mi ton/ano.",
    fichaStat: "🍽️ Alimenta 800 mi pessoas · cultivada em 100% do BR",
  },
};

export type PlotState = "empty" | "planted" | "watered" | "ready";
export type Strategy = "organic" | "chemical" | null;

export interface Plot {
  id: number;
  row: number;
  col: number;
  state: PlotState;
  crop: CropType | null;
  strategy: Strategy;
  plantedAt: number | null;
  wateredAt: number | null;
}

export type Tool = "plant" | "water" | "harvest";

export interface Objective {
  id: string;
  label: string;
  emoji: string;
  target: number;
  current: number;
  reward: number;
  done: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export interface GameState {
  coins: number;
  soilQuality: number;
  xp: number;
  level: number;
  plots: Plot[];
  selectedCrop: CropType;
  selectedTool: Tool;
  day: number;
  harvestCount: number;
  organicCount: number;
  seeds: Record<CropType, number>;
  objectives: Objective[];
  achievements: Achievement[];
  tutorialDone: boolean;
}

export interface RandomEvent {
  emoji: string;
  title: string;
  description: string;
  coinBonus: number;
}

export const RANDOM_EVENTS: RandomEvent[] = [
  { emoji: "🌧️", title: "Chuva Boa!", description: "As chuvas ajudaram muito sua plantação esta safra!", coinBonus: 8 },
  { emoji: "☀️", title: "Seca Intensa", description: "A estiagem prejudicou parte da sua colheita.", coinBonus: -5 },
  { emoji: "🐛", title: "Praga na Lavoura!", description: "Insetos atacaram parte dos seus canteiros.", coinBonus: -4 },
  { emoji: "🌱", title: "Solo Fértil!", description: "A terra estava excelente — safra acima do esperado!", coinBonus: 10 },
  { emoji: "💨", title: "Vento Forte", description: "Vento prejudicou algumas plantas na beira do campo.", coinBonus: -3 },
  { emoji: "🦋", title: "Polinização Perfeita!", description: "Abelhas e borboletas aumentaram a produção!", coinBonus: 6 },
];

export const GRID_ROWS = 4;
export const GRID_COLS = 6;
export const XP_PER_LEVEL = 80;
export const MAX_LEVEL = 10;

export function makeObjectives(day: number): Objective[] {
  const sets: Objective[][] = [
    [
      { id: "plant3", label: "Plante 3 canteiros", emoji: "🌱", target: 3, current: 0, reward: 20, done: false },
      { id: "earn50", label: "Ganhe R$50 em colheitas", emoji: "💰", target: 50, current: 0, reward: 15, done: false },
      { id: "organic1", label: "Use cultivo Orgânico 1x", emoji: "🌿", target: 1, current: 0, reward: 10, done: false },
    ],
    [
      { id: "harvest5", label: "Colha 5 canteiros", emoji: "✂️", target: 5, current: 0, reward: 30, done: false },
      { id: "earn100", label: "Ganhe R$100 em colheitas", emoji: "💰", target: 100, current: 0, reward: 25, done: false },
      { id: "water3", label: "Regue 3 plantações", emoji: "💧", target: 3, current: 0, reward: 15, done: false },
    ],
    [
      { id: "cafe1", label: "Colha 1 pé de Café", emoji: "☕", target: 1, current: 0, reward: 40, done: false },
      { id: "earn150", label: "Acumule R$150", emoji: "💰", target: 150, current: 0, reward: 35, done: false },
      { id: "organic3", label: "Cultivo orgânico 3x", emoji: "🌿", target: 3, current: 0, reward: 20, done: false },
    ],
  ];
  return sets[day % sets.length];
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_harvest", title: "Primeira Colheita!", emoji: "🌾", description: "Colheu seu primeiro canteiro.", unlocked: false },
  { id: "five_harvests", title: "Mão na Massa", emoji: "💪", description: "Realizou 5 colheitas.", unlocked: false },
  { id: "organic_farmer", title: "Produtor Orgânico", emoji: "🌿", description: "Fez 3 plantios orgânicos.", unlocked: false },
  { id: "rich_farmer", title: "Fazendeiro Rico", emoji: "🤑", description: "Acumulou R$ 300 na fazenda.", unlocked: false },
  { id: "soil_guardian", title: "Guardião do Solo", emoji: "🌱", description: "Solo acima de 80 com 5+ colheitas.", unlocked: false },
];
