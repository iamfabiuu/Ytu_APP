/*
 * Veleiros ilustrados do mapa.
 *
 * Diferente dos navios (formas desenhadas em escala real, ver
 * boatLayers.ts), o veleiro é uma ILUSTRAÇÃO em vista lateral. Uma
 * ilustração não pode ser um polígono, então ela vira uma imagem
 * colocada no mapa (camada de símbolos, sem HTML flutuante):
 *
 *  - fica presa à coordenada do veleiro;
 *  - cresce junto com o zoom (ver ICON_SIZE_BY_ZOOM);
 *  - fica sempre em pé, mesmo se o mapa for girado.
 *
 * O desenho está em public/boats/veleiro.svg (a pasta public é onde o
 * projeto guarda imagens e SVG). Para usar o desenho oficial da equipe,
 * basta substituir esse arquivo (SVG com fundo transparente, mesmo nome e
 * proporção parecida). Se for PNG, mude o nome em SAILBOAT_ICON_URL.
 */
import type { Map as MTMap } from "@maptiler/sdk";
import type { Boat } from "../data/boats";

const ICON_ID = "ytu-veleiro";

/*
 * Todos os ids daqui começam com "ytu-boat-". O módulo de rotas apaga
 * TUDO que começa com "ytu-route", então nunca use esse prefixo aqui.
 */
const SOURCE_ID = "ytu-boat-icons";
const LAYER_ID = "ytu-boat-icons";

/* Abaixo deste zoom os veleiros somem. */
const MIN_ZOOM = 12;

/*
 * Tamanho do ícone conforme o zoom (1 = tamanho natural da imagem,
 * que é mostrada com 60 x 70 px por causa do pixelRatio 2).
 */
const ICON_SIZE_BY_ZOOM = [12, 0.25, 14, 0.45, 16, 0.8, 18, 1.4] as const;

/*
 * Endereço do desenho, dentro da pasta public. BASE_URL é "/" no site
 * normal; o "?? \"/\"" só existe para rodar fora do Vite (testes).
 */
export const SAILBOAT_ICON_URL = `${import.meta.env?.BASE_URL ?? "/"}boats/veleiro.svg`;

export type IconLoader = (url: string) => Promise<HTMLImageElement>;

const loadImageElement: IconLoader = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Não foi possível carregar a imagem ${url}`));

    image.src = url;
  });

/*
 * Carrega a imagem e desenha os veleiros. É assíncrona (baixar a imagem
 * leva um instante), então recebe `isCurrent`: se o mapa foi limpo ou
 * refeito enquanto a imagem carregava, ela desiste sem desenhar nada.
 */
export async function addBoatIcons(
  map: MTMap,
  boats: Boat[],
  isCurrent: () => boolean,
  load: IconLoader = loadImageElement,
) {
  const sailboats = boats.filter((boat) => boat.kind === "sailboat");

  if (sailboats.length === 0) {
    return;
  }

  let image: HTMLImageElement;

  try {
    image = await load(SAILBOAT_ICON_URL);
  } catch (error) {
    if (isCurrent()) {
      console.warn(
        "⚠️ A imagem do veleiro não carregou; os veleiros não serão exibidos.",
        error,
      );
    }
    return;
  }

  if (!isCurrent()) {
    return;
  }

  try {
    if (map.hasImage(ICON_ID)) {
      map.removeImage(ICON_ID);
    }

    map.addImage(ICON_ID, image, { pixelRatio: 2 });

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: sailboats.map((boat) => ({
          type: "Feature" as const,
          properties: { id: boat.id },
          geometry: {
            type: "Point" as const,
            coordinates: boat.position,
          },
        })),
      },
    });

    /* abaixo dos textos do mapa, para não cobrir os nomes */
    const beforeId = map
      .getStyle()
      ?.layers?.find((layer) => layer.type === "symbol")?.id;

    map.addLayer(
      {
        id: LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        minzoom: MIN_ZOOM,
        layout: {
          "icon-image": ICON_ID,
          "icon-size": ["interpolate", ["linear"], ["zoom"], ...ICON_SIZE_BY_ZOOM],
          /* barco decorativo: não some por colisão com nada */
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },
      beforeId,
    );
  } catch (error) {
    console.warn("⚠️ Não foi possível desenhar os veleiros:", error);
  }
}

/* Remove os veleiros. Seguro de chamar mesmo que já tenham sido removidos. */
export function removeBoatIcons(map: MTMap) {
  if (map.getLayer(LAYER_ID)) {
    try {
      map.removeLayer(LAYER_ID);
    } catch {
      /* noop */
    }
  }

  if (map.getSource(SOURCE_ID)) {
    try {
      map.removeSource(SOURCE_ID);
    } catch {
      /* noop */
    }
  }

  if (map.hasImage(ICON_ID)) {
    try {
      map.removeImage(ICON_ID);
    } catch {
      /* noop */
    }
  }
}