/*
 * Tema visual do mapa YTU.
 *
 * Responsável por aplicar as cores e estilos personalizados
 * aos elementos visuais do mapa base do MapTiler.
 */
import type { Map } from "@maptiler/sdk";

/*
 * ============================================================
 * YTU — TEMA CULTURAL DO MAPA
 * ============================================================
 *
 * O objetivo não é reproduzir o mapa padrão do MapTiler.
 * A ideia é criar uma linguagem visual própria para o YTU:
 *
 * - areia / creme -> cidade
 * - terracota      -> arquitetura e cultura
 * - laranja        -> vias importantes
 * - verde          -> natureza
 * - azul            -> água
 * - amarelo        -> espaços de destaque
 *
 * O mapa continua legível, mas deixa de parecer um mapa
 * genérico.
 */

const YTU = {
  /*
   * ----------------------------------------------------------
   * BASE
   * ----------------------------------------------------------
   */

  background: "#F2E4CC",
  land: "#EBD8B8",

  /*
   * ----------------------------------------------------------
   * NATUREZA
   * ----------------------------------------------------------
   */

  meadow: "#B8C98A",
  forest: "#7FA35F",
  grass: "#C8D59A",
  scrub: "#AEBF7D",
  wood: "#91AD68",
  crop: "#D4D39A",
  sand: "#E5C68F",

  /*
   * ----------------------------------------------------------
   * ÁGUA
   * ----------------------------------------------------------
   */

  water: "#1593B5",
  waterLight: "#48B5C8",
  waterDark: "#08718F",

  /*
   * ----------------------------------------------------------
   * CIDADE
   * ----------------------------------------------------------
   */

  residential: "#E6CFAB",
  industrial: "#D7BE9D",
  cemetery: "#C7D0A0",
  hospital: "#E8C8B8",
  stadium: "#D5BF9D",
  school: "#E2C99F",
  airport: "#D8D1C1",

  /*
   * ----------------------------------------------------------
   * PRÉDIOS
   * ----------------------------------------------------------
   */

  building: "#D1B18E",
  building3D: "#B98262",
  building3DLight: "#C99875",

  /*
   * ----------------------------------------------------------
   * RUAS
   * ----------------------------------------------------------
   */

  minorRoad: "#FFF8EA",
  minorRoadOutline: "#D5B88F",

  path: "#F6E7C8",
  pathOutline: "#CDA776",

  pedestrian: "#F1C66D",

  majorRoad: "#E9A15D",
  majorRoadOutline: "#C97845",

  highway: "#D76A3A",
  highwayOutline: "#A94E32",

  /*
   * ----------------------------------------------------------
   * FERROVIAS
   * ----------------------------------------------------------
   */

  rail: "#B9684D",
  railSecondary: "#9E755F",

  /*
   * ----------------------------------------------------------
   * IDENTIDADE CULTURAL
   * ----------------------------------------------------------
   */

  terracotta: "#C85A3D",
  orange: "#E87932",
  yellow: "#F2BD45",

  /*
   * ----------------------------------------------------------
   * TEXTOS
   * ----------------------------------------------------------
   */

  text: "#49382F",
  textSecondary: "#695448",
  textWater: "#075D73",
};

/**
 * Aplica a identidade visual do YTU ao mapa MapTiler.
 *
 * Não altera:
 * - coordenadas
 * - fontes
 * - dados
 * - marcadores
 * - geometria das rotas
 *
 * Apenas modifica a apresentação visual das camadas
 * existentes no estilo Streets.
 */
export function applyYtuMapTheme(map: Map) {
  const setPaint = (
    layerId: string,
    property: string,
    value: unknown,
  ) => {
    if (!map.getLayer(layerId)) {
      return;
    }

    try {
      map.setPaintProperty(
        layerId,
        property,
        value,
      );
    } catch {
      // Algumas camadas podem não aceitar determinada propriedade.
    }
  };

  /*
   * ==========================================================
   * FUNDO
   * ==========================================================
   */

  setPaint(
    "Background",
    "background-color",
    YTU.background,
  );

  /*
   * ==========================================================
   * NATUREZA
   * ==========================================================
   */

  setPaint("Meadow", "fill-color", YTU.meadow);
  setPaint("Forest", "fill-color", YTU.forest);
  setPaint("Grass", "fill-color", YTU.grass);
  setPaint("Scrub", "fill-color", YTU.scrub);
  setPaint("Wood", "fill-color", YTU.wood);
  setPaint("Crop", "fill-color", YTU.crop);
  setPaint("Sand", "fill-color", YTU.sand);

  /*
   * ==========================================================
   * ÁREAS URBANAS
   * ==========================================================
   *
   * Agora o terreno urbano não fica quase da mesma cor dos
   * prédios.
   */

  setPaint(
    "Residential",
    "fill-color",
    YTU.residential,
  );

  setPaint(
    "Industrial",
    "fill-color",
    YTU.industrial,
  );

  setPaint(
    "Cemetery",
    "fill-color",
    YTU.cemetery,
  );

  setPaint(
    "Hospital",
    "fill-color",
    YTU.hospital,
  );

  setPaint(
    "Stadium",
    "fill-color",
    YTU.stadium,
  );

  setPaint(
    "School",
    "fill-color",
    YTU.school,
  );

  setPaint(
    "Airport zone",
    "fill-color",
    YTU.airport,
  );

  /*
   * ==========================================================
   * ÁGUA
   * ==========================================================
   */

  setPaint(
    "Water",
    "fill-color",
    YTU.water,
  );

  setPaint(
    "Water intermittent",
    "fill-color",
    YTU.waterLight,
  );

  setPaint(
    "River",
    "line-color",
    YTU.waterDark,
  );

  setPaint(
    "River tunnel",
    "line-color",
    YTU.waterDark,
  );

  setPaint(
    "Aqueduct",
    "line-color",
    YTU.waterLight,
  );

  setPaint(
    "Aqueduct outline",
    "line-color",
    YTU.waterDark,
  );

  /*
   * ==========================================================
   * PRÉDIOS 2D
   * ==========================================================
   *
   * Aqui fazemos uma mudança visual realmente perceptível.
   */

  setPaint(
    "Building",
    "fill-color",
    YTU.building,
  );

  /*
   * ==========================================================
   * PRÉDIOS 3D
   * ==========================================================
   *
   * A camada 3D recebe uma cor mais terracota para trazer
   * a sensação de arquitetura histórica / urbana.
   */

  setPaint(
    "Building 3D",
    "fill-extrusion-color",
    YTU.building3D,
  );

  setPaint(
    "Building 3D",
    "fill-extrusion-opacity",
    0.95,
  );

  setPaint(
    "Building 3D",
    "fill-extrusion-vertical-gradient",
    true,
  );

  /*
   * ==========================================================
   * RUAS PEQUENAS
   * ==========================================================
   */

  setPaint(
    "Minor road outline",
    "line-color",
    YTU.minorRoadOutline,
  );

  setPaint(
    "Minor road",
    "line-color",
    YTU.minorRoad,
  );

  setPaint(
    "Path outline",
    "line-color",
    YTU.pathOutline,
  );

  setPaint(
    "Path",
    "line-color",
    YTU.path,
  );

  setPaint(
    "Path minor",
    "line-color",
    "#EACB9B",
  );

  /*
   * ==========================================================
   * VIAS IMPORTANTES
   * ==========================================================
   *
   * Aqui entra bastante da identidade quente do ITU.
   */

  setPaint(
    "Pedestrian",
    "fill-color",
    YTU.pedestrian,
  );

  setPaint(
    "Major road outline",
    "line-color",
    YTU.majorRoadOutline,
  );

  setPaint(
    "Major road",
    "line-color",
    YTU.majorRoad,
  );

  setPaint(
    "Highway outline",
    "line-color",
    YTU.highwayOutline,
  );

  setPaint(
    "Highway",
    "line-color",
    YTU.highway,
  );

  /*
   * ==========================================================
   * VIAS EM CONSTRUÇÃO
   * ==========================================================
   */

  setPaint(
    "Road under construction",
    "line-color",
    YTU.orange,
  );

  /*
   * ==========================================================
   * FERROVIAS
   * ==========================================================
   */

  setPaint(
    "Major rail",
    "line-color",
    YTU.rail,
  );

  setPaint(
    "Major rail hatching",
    "line-color",
    YTU.rail,
  );

  setPaint(
    "Minor rail",
    "line-color",
    YTU.railSecondary,
  );

  setPaint(
    "Minor rail hatching",
    "line-color",
    YTU.railSecondary,
  );

  /*
   * ==========================================================
   * POIs / CULTURA
   * ==========================================================
   *
   * Não alteramos diretamente os ícones porque o MapTiler
   * pode utilizar ícones SDF e não-SDF diferentes.
   *
   * Porém, alteramos a linguagem dos textos desses pontos.
   */

  const poiLayers = [
    "Culture",
    "Tourism",
    "Food",
    "Park",
    "Shopping",
    "Transport",
    "Education",
    "Sport",
    "Healthcare",
    "Public",
  ];

  poiLayers.forEach((layerId) => {
    setPaint(
      layerId,
      "text-color",
      YTU.text,
    );

    setPaint(
      layerId,
      "text-halo-color",
      YTU.background,
    );

    setPaint(
      layerId,
      "text-halo-width",
      1.3,
    );
  });

  /*
   * ==========================================================
   * TEXTOS DE ÁGUA
   * ==========================================================
   */

  setPaint(
    "River labels",
    "text-color",
    YTU.textWater,
  );

  setPaint(
    "Ocean labels",
    "text-color",
    YTU.textWater,
  );

  setPaint(
    "Lake labels",
    "text-color",
    YTU.textWater,
  );

  /*
   * ==========================================================
   * TEXTOS DAS RUAS
   * ==========================================================
   */

  setPaint(
    "Road labels",
    "text-color",
    YTU.text,
  );

  setPaint(
    "Road labels",
    "text-halo-color",
    YTU.background,
  );

  setPaint(
    "Road labels",
    "text-halo-width",
    1.2,
  );

  /*
   * ==========================================================
   * NOMES DE LUGARES
   * ==========================================================
   */

  const placeLabelLayers = [
    "Place labels",
    "State labels",
    "Town labels",
    "City labels",
    "Capital city labels",
    "Country labels",
    "Continent labels",
  ];

  placeLabelLayers.forEach((layerId) => {
    setPaint(
      layerId,
      "text-color",
      YTU.text,
    );

    setPaint(
      layerId,
      "text-halo-color",
      YTU.background,
    );

    setPaint(
      layerId,
      "text-halo-width",
      1.4,
    );
  });

  /*
   * ==========================================================
   * OUTROS ELEMENTOS
   * ==========================================================
   */

  setPaint(
    "Tunnel outline",
    "line-color",
    "#B99A79",
  );

  setPaint(
    "Tunnel",
    "line-color",
    "#D4B895",
  );

  setPaint(
    "Bridge outline",
    "line-color",
    "#B98562",
  );

  setPaint(
    "Bridge",
    "fill-color",
    "#D09B74",
  );

  setPaint(
    "Pier",
    "fill-color",
    "#C99C76",
  );

  setPaint(
    "Pier road",
    "line-color",
    "#B77B58",
  );

  /*
   * ==========================================================
   * CABOS / TELEFÉRICO
   * ==========================================================
   */

  setPaint(
    "Cablecar",
    "line-color",
    YTU.terracotta,
  );

  setPaint(
    "Cablecar dash",
    "line-color",
    YTU.orange,
  );
}
