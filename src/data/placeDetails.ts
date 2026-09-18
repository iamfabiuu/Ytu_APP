// src/data/placeDetails.ts
export type PlaceDetail = {
  id: string;
  name: string;
  cover: string;
  tags: string[];
  badge: string;
  rating: number;
  reviews: number;
  distance: string;
  description: string;
  hours: { value: string; note?: string };
  ticket: { value: string; note?: string };
  accessibility: { title: string; features: string[] };
  address: { line1: string; line2: string };
};

export const CAIS_DO_SERTAO: PlaceDetail = {
  id: "cais-do-sertao",
  name: "Museu Cais do Sertão",
  cover: "/img/cais-do-sertao.jpg",
  tags: ["CULTURA • MUSEU", "INTERATIVO"],
  badge: "Imperdível",
  rating: 4.8,
  reviews: 512,
  distance: "1,2 km",
  description:
    "Um mergulho sensorial no sertão e na obra de Luiz Gonzaga. Tecnologia, música e memória num dos museus mais interativos do Brasil.",
  hours: { value: "9h às 17h", note: "Fecha às segundas" },
  ticket: { value: "R$ 20", note: "Meia-entrada R$ 10" },
  accessibility: {
    title: "Totalmente acessível",
    features: ["Elevador", "Rampas", "Piso tátil", "Audiodescrição"],
  },
  address: {
    line1: "Av. Alfredo Lisboa, 410",
    line2: "Bairro do Recife, Recife/PE",
  },
};

export const MERCADO_BOA_VISTA: PlaceDetail = {
  id: "mercado-da-boa-vista",
  name: "Mercado da Boa Vista",
  cover: "/img/mercado-boa-vista.jpg",
  tags: ["GASTRONOMIA • FEIRA", "VIDA LOCAL"],
  badge: "Econômica",
  rating: 4.6,
  reviews: 274,
  distance: "600 m",
  description:
    "Mercado público de 1872 que pulsa Recife de verdade: temperos, ervas, artesanato, peixe fresco e aquele caldinho no fim da tarde.",
  hours: { value: "6h às 18h", note: "Domingo até 12h" },
  ticket: { value: "Grátis", note: "Entrada livre" },
  accessibility: {
    title: "Acessibilidade parcial",
    features: ["Piso plano", "Entrada ampla"],
  },
  address: { line1: "Rua Conde de Irajá, s/n", line2: "Boa Vista, Recife/PE" },
};

export const PACO_DO_FREVO: PlaceDetail = {
  id: "passo-do-frevo",
  name: "Paço do Frevo",
  cover: "/paco-do-frevo.jpg",
  tags: ["CULTURA • MUSEU", "MÚSICA E DANÇA"],
  badge: "Patrimônio Imaterial",
  rating: 4.9,
  reviews: 1_083,
  distance: "850 m",
  description:
    "Casarão do século XIX dedicado ao frevo: acervo interativo, sala de dança, estúdios de música e aulas abertas. Impossível sair sem mexer o passo.",
  hours: { value: "Ter a sex 9h às 17h", note: "Sáb e dom 11h às 17h • Fecha às segundas" },
  ticket: { value: "R$ 10", note: "Meia R$ 5 • Grátis às terças" },
  accessibility: {
    title: "Totalmente acessível",
    features: ["Elevador", "Rampas", "Piso tátil", "Banheiro adaptado"],
  },
  address: {
    line1: "Praça do Arsenal da Marinha, s/n",
    line2: "Bairro do Recife, Recife/PE",
  },
};


export const PLACE_DETAILS: Record<string, PlaceDetail> = {
  [PACO_DO_FREVO.id]: PACO_DO_FREVO,
  [CAIS_DO_SERTAO.id]: CAIS_DO_SERTAO,
  [MERCADO_BOA_VISTA.id]: MERCADO_BOA_VISTA,
};

