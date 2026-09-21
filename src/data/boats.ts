/*
 * Barcos e navios decorativos do mar do Recife.
 *
 *  - "ship" (navio): forma desenhada em escala real; aceita `lengthMeters`
 *    e `heading`.
 *  - "sailboat" (veleiro): ilustração em imagem (public/boats/veleiro.svg);
 *    só usa `position` (tamanho e direção são iguais para todos).
 *
 * Para mexer nos barcos, edite só este arquivo:
 *  - acrescentar um barco: copie uma linha e mude o `id` e a `position`;
 *  - mover um barco: mude a `position`;
 *  - girar um barco: mude o `heading`;
 *  - remover um barco: apague a linha.
 *
 * COMO PEGAR UMA POSIÇÃO CERTA NA ÁGUA
 *  Com o app rodando em desenvolvimento (npm run dev), clique no ponto do
 *  mar onde o barco deve ficar. O Console (F12) mostra algo como:
 *      📍 [-34.865000, -8.061000]  🌊 água
 *  Copie os dois números entre colchetes para `position`.
 *  Se o Console avisar "⚠️ não é água", esse ponto está em terra: escolha
 *  outro.
 *
 * ATENÇÃO: as posições iniciais abaixo são ESTIMATIVAS. Confira no mapa e
 * ajuste o que ficar em terra ou fora de lugar.
 */

export type BoatKind = "ship" | "sailboat";

export type Boat = {
    id: string;
    /* "ship" = navio (forma); "sailboat" = veleiro (ilustração) */
    kind: BoatKind;
    /* [longitude, latitude], no mar */
    position: [number, number];
    /*
     * SÓ NAVIO. Comprimento em metros. É EXAGERADO de propósito, para o
     * navio aparecer em zoom médio. Se omitido: 200 m.
     */
    lengthMeters?: number;
    /* SÓ NAVIO. Para onde aponta a proa, em graus: 0 = norte, 90 = leste, 180 = sul, 270 = oeste. */
    heading?: number;
};

export const BOATS: Boat[] = [
    /* ---- navios no porto e na barra (a leste do Recife Antigo) ---- */
    { id: "navio-1", kind: "ship", position: [-34.864, -8.059], heading: 15 },
    { id: "navio-2", kind: "ship", position: [-34.8628, -8.0665], heading: 195 },
    { id: "navio-3", kind: "ship", position: [-34.8655, -8.07], heading: 300 },

    /* ---- veleiros perto da marina e do canal ---- */
    { id: "veleiro-1", kind: "sailboat", position: [-34.867682428588466, -8.062053869171661] },
    { id: "veleiro-2", kind: "sailboat", position: [-34.8686, -8.0668] },
    { id: "veleiro-3", kind: "sailboat", position: [-34.866, -8.0615] },
    { id: "veleiro-4", kind: "sailboat", position: [-34.8700371627187, -8.062757527965138], heading: 200 },
    { id: "veleiro-5", kind: "sailboat", position: [-34.8700371627187, -8.062757527965138], heading: 200 },
    { id: "veleiro-6", kind: "sailboat", position: [-34.87932779236237, -8.075234211092615], heading: 200 },
    { id: "veleiro-7", kind: "sailboat", position: [-34.866323282616854, -8.051879736077291], heading: 200 },

];

