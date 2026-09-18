export type RouteSegment = {
  from: string;
  to: string;
  via?: [number, number][];
};

export type Route = {
  id: string;
  title: string;
  description: string;
  tag: "Recomendados" | "Econômicas" | "Perfomáticas" | "Em grupo";
  duration: string;
  stops: string[];
  price: string;
  img: string;
  segments?: RouteSegment[];
    featured?: boolean;
  distance?: string;
};

export const ROUTES: Route[] = [
  {
    id: "recife-cultural",
    title: "Recife Cultural",
    description: "Uma rota pelo coração cultural do Recife.",
    tag: "Econômicas",
    duration: "3h",
    stops: ["marcozero", "frevo", "cais-sertao", "casa-cultura"],
    price: "Até R$15,00",
    img: "/paco-do-frevo.jpg",

    segments: [
      {
        from: "marcozero",
        to: "frevo",
        via: [
          [-34.87155, -8.06265],
          [-34.87155, -8.06210],
        ],
      },
    ],
  },
];