export type Route = {
  id: string;
  title: string;
  description: string;
  tag: "Recomendados" | "Econômicas" | "Perfomáticas" | "Em grupo";
  duration: string;
  stops: string[];
  price: string;
  img: string;
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
    featured: true, // 👈 é ela que aparece em /rotas/destaque
  },

   {
    id: "recife-historico-popular",
    title: "Recife Histórico e Popular",
    description:
      "Do Teatro de Santa Isabel ao Forte das Cinco Pontas, passando por mesas, igrejas e mercados do Centro.",
    tag: "Econômicas",
    duration: "3h",
    distance: "2,0 km",
    stops: [
      "santa-isabel",
      "leite",
      "museu-arte-sacra",
      "mercado",
      "cinco-pontas",
    ],
    price: "Até R$20,00",
    img: "/places/santa-isabel.jpg",
  },
  
];