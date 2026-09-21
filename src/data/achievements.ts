export type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  progress: number; // atual
  goal: number;     // meta
  xp: number;
};

export const USER_STATS = { xp: 420, level: 3, nextLevelXp: 600 };

export const ACHIEVEMENTS: Achievement[] = [
  { id: "primeiro-passo", icon: "👣", title: "Primeiro Passo", desc: "Conclua sua primeira rota", progress: 1, goal: 1, xp: 50 },
  { id: "passista", icon: "🎭", title: "Passista", desc: "Visite o Paço do Frevo", progress: 1, goal: 1, xp: 80 },
  { id: "rato-de-museu", icon: "🏛️", title: "Rato de Museu", desc: "Visite 5 museus", progress: 2, goal: 5, xp: 150 },
  { id: "caldinho-lover", icon: "🍲", title: "Caldinho Lover", desc: "Prove 3 comidas típicas", progress: 3, goal: 3, xp: 100 },
  { id: "maratonista", icon: "🚶", title: "Maratonista do Recife", desc: "Caminhe 10 km em rotas", progress: 6, goal: 10, xp: 200 },
  { id: "madrugador", icon: "🌅", title: "Madrugador", desc: "Inicie uma rota antes das 8h", progress: 0, goal: 1, xp: 60 },
  { id: "explorador", icon: "🗺️", title: "Explorador", desc: "Visite 4 bairros diferentes", progress: 2, goal: 4, xp: 180 },
  { id: "guia-nato", icon: "⭐", title: "Guia Nato", desc: "Avalie 10 lugares", progress: 4, goal: 10, xp: 120 },
];