export type Place = {
  id: string;
  label: string;
  cat: string;
  dist: string;
  hours: string;
  lng: number;
  lat: number;
};

export const PLACES: Place[] = [
  {
    id: "frevo",
    label: "Paço do Frevo",
    cat: "Cultura",
    dist: "1,2 km",
    hours: "Aberto até 17h",
    lng: -34.871571,
    lat: -8.061503,
  },
  {
    id: "marcozero",
    label: "Marco Zero",
    cat: "Patrimônio",
    dist: "1,4 km",
    hours: "Aberto 24h",
    lng: -34.8712,
    lat: -8.0632,
  },
  {
    id: "boaviagem",
    label: "Praia de Boa Viagem",
    cat: "Praias",
    dist: "6,8 km",
    hours: "Aberto 24h",
    lng: -34.893,
    lat: -8.124,
  },
  {
    id: "ricardo",
    label: "Instituto Ricardo Brennand",
    cat: "Cultura",
    dist: "9,1 km",
    hours: "Aberto até 17h",
    lng: -34.9585,
    lat: -8.076,
  },
  {
    id: "mercado",
    label: "Mercado de São José",
    cat: "Comida",
    dist: "1,9 km",
    hours: "Aberto até 17h",
    lng: -34.877,
    lat: -8.068,
  },
  {
    id: "casa-cultura",
    label: "Casa da Cultura",
    cat: "Cultura",
    dist: "1,8 km",
    hours: "Aberto até 17h",
    lng: -34.883067,
    lat: -8.066655,
  },
  {
    id: "cais-sertao",
    label: "Cais do Sertão",
    cat: "Cultura",
    dist: "2,0 km",
    hours: "Aberto até 16h",
    lng: -34.872928,
    lat: -8.065988,
  },
];