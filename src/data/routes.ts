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
];