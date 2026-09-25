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
    // ID legado: "frevo" representa especificamente o Paço do Frevo.
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
    lng: -34.871204253745965,
    lat: -8.063084808406737,
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
     // ID legado: "mercado" representa especificamente o Mercado de São José.
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
    lng: -34.86997525733125,
    lat: -8.06028020251848,
  },
  {
    id: "dona-lindu",
    label: "Parque Dona Lindu",
    cat: "Parques",
    dist: "9,0 km",
    hours: "Aberto 24h",
    lng: -34.90453,
    lat: -8.14192,
  },

  {
    id: "boa-viagem",
    label: "Praça de Boa Viagem",
    cat: "Praças",
    dist: "8,2 km",
    hours: "Aberto 24h",
    lng: -34.90073,
    lat: -8.13201,
  },

  {
    id: "jaqueira",
    label: "Parque da Jaqueira",
    cat: "Parques",
    dist: "4,2 km",
    hours: "Aberto até 22h",
    lng: -34.90479,
    lat: -8.03689,
  },

  {
    id: "treze-maio",
    label: "Parque 13 de Maio",
    cat: "Parques",
    dist: "1,8 km",
    hours: "Aberto até 22h",
    lng: -34.88183,
    lat: -8.05763,
  },

  {
    id: "parque-gracas",
    label: "Parque das Graças",
    cat: "Parques",
    dist: "3,0 km",
    hours: "Aberto 24h",
    lng: -34.905,
    lat: -8.049,
  },

  {
    id: "derby",
    label: "Praça do Derby",
    cat: "Praças",
    dist: "3,0 km",
    hours: "Aberto 24h",
    lng: -34.89845,
    lat: -8.05652,
  },

  {
    id: "baoba",
    label: "Jardim do Baobá",
    cat: "Parques",
    dist: "3,4 km",
    hours: "Aberto 24h",
    lng: -34.9044,
    lat: -8.0415,
  },

  {
    id: "santana",
    label: "Parque Santana - Ariano Suassuna",
    cat: "Parques",
    dist: "5,5 km",
    hours: "Aberto até 21h",
    lng: -34.9179,
    lat: -8.04197,
  },

  {
    id: "macaxeira",
    label: "Parque Urbano da Macaxeira",
    cat: "Parques",
    dist: "8,0 km",
    hours: "Aberto até 22h",
    lng: -34.93116,
    lat: -8.01639,
  },

  {
    id: "tamarineira",
    label: "Parque da Tamarineira",
    cat: "Parques",
    dist: "4,2 km",
    hours: "Aberto 24h",
    lng: -34.90311,
    lat: -8.03348,
  },
    {
    id: "sabor-pernambuco",
    label: "Restaurante Cultural Sabor de Pernambuco",
    cat: "Culinária",
    dist: "1,2 km",
    hours: "Aberto até 21h",
    lng: -34.873,
    lat: -8.061,
  },

  {
    id: "armazem-rio-branco",
    label: "Armazém Rio Branco",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 23h",
    lng: -34.8719,
    lat: -8.0619,
  },

  {
    id: "bodega-veio",
    label: "Bodega de Véio",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 23h",
    lng: -34.873043,
    lat: -8.062835,
  },

  {
    id: "rota-marujo",
    label: "Rota do Marujo",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 0h",
    lng: -34.872957,
    lat: -8.064431,
  },

  {
    id: "lulu-comedoria",
    label: "Lulu Comedoria",
    cat: "Culinária",
    dist: "1,5 km",
    hours: "Aberto até 20h",
    lng: -34.871,
    lat: -8.059,
  },

  {
    id: "zero-um",
    label: "Bar Zero Um",
    cat: "Culinária",
    dist: "1,2 km",
    hours: "Aberto até 0h",
    lng: -34.8735,
    lat: -8.0615,
  },

  {
    id: "frege",
    label: "Frege",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 23h",
    lng: -34.8719,
    lat: -8.0619,
  },

  {
    id: "moedao",
    label: "O Moedão",
    cat: "Culinária",
    dist: "1,1 km",
    hours: "Aberto até 23h",
    lng: -34.8725,
    lat: -8.0643,
  },

  {
    id: "as-galerias",
    label: "As Galerias",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 22h",
    lng: -34.872,
    lat: -8.0605,
  },

  {
    id: "cais-rooftop",
    label: "Cais Rooftop Lounge Bar",
    cat: "Culinária",
    dist: "1,0 km",
    hours: "Aberto até 1h",
    lng: -34.8705,
    lat: -8.0607,
  },
];
