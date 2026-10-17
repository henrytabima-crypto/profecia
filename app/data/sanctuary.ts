export const sanctuaryOverview = {
  id: "overview",
  zone: "Vista general",
  title: "Santuario del desierto",
  verse: "Éxodo 25–40; Hebreos 8–9",
  insight: "La vista completa reúne el atrio, el sacrificio, la purificación y las dos cámaras de la tienda en un solo recorrido pedagógico centrado en el ministerio de Cristo.",
} as const;

export const sanctuaryStations = [
  {
    id: "entrance",
    zone: "Atrio oriental",
    title: "Entrada del atrio",
    verse: "Éxodo 27:13–16; Juan 10:9",
    measure: "20 codos de ancho",
    insight: "La entrada mira al oriente y ocupa veinte codos del muro del atrio. El bordado azul, púrpura y carmesí distingue un único acceso; como conexión cristocéntrica, Juan presenta a Cristo como la puerta.",
  },
  {
    id: "altar",
    zone: "Atrio",
    title: "Altar del holocausto",
    verse: "Éxodo 27:1–8; Juan 1:29",
    measure: "5 × 5 × 3 codos",
    insight: "Era una caja hueca de acacia revestida de bronce, con cuatro cuernos, rejilla, anillos y varas. Su posición al inicio del recorrido recuerda que el acceso comienza con el sacrificio.",
  },
  {
    id: "laver",
    zone: "Atrio",
    title: "Fuente de bronce",
    verse: "Éxodo 30:17–21; 38:8",
    measure: "Dimensiones no indicadas",
    insight: "La fuente y su base estaban entre el altar y la tienda. Éxodo no fija su forma ni tamaño, por eso la reconstrucción usa una vasija portátil sobria y conserva visible esta incertidumbre.",
  },
  {
    id: "table",
    zone: "Lugar Santo · norte",
    title: "Mesa del Pan",
    verse: "Éxodo 25:23–30; Levítico 24:5–9",
    measure: "2 × 1 × 1½ codos",
    insight: "La mesa de acacia revestida de oro se ubicaba al norte. Sobre ella aparecen doce panes en dos grupos de seis, junto con los utensilios de oro descritos para el servicio.",
  },
  {
    id: "lampstand",
    zone: "Lugar Santo · sur",
    title: "Candelabro de oro",
    verse: "Éxodo 25:31–40",
    measure: "7 lámparas · altura no indicada",
    insight: "Una sola pieza de oro formaba el eje central y tres brazos por lado, decorados como flores de almendro. La altura no está registrada; la escala aquí es una reconstrucción didáctica.",
  },
  {
    id: "incense",
    zone: "Lugar Santo · ante el velo",
    title: "Altar del incienso",
    verse: "Éxodo 30:1–10",
    measure: "1 × 1 × 2 codos",
    insight: "El pequeño altar de acacia revestido de oro estaba centrado inmediatamente delante del velo. El incienso diario enlazaba el servicio del Lugar Santo con la presencia tras el velo.",
  },
  {
    id: "ark",
    zone: "Lugar Santísimo",
    title: "Arca del pacto",
    verse: "Éxodo 25:10–22; Hebreos 9:23–28",
    measure: "2½ × 1½ × 1½ codos",
    insight: "El arca revestida de oro, el propiciatorio y dos querubines ocupaban el centro del Lugar Santísimo. La ley, la misericordia y la presencia convergen en el corazón del santuario.",
  },
] as const;

export type SanctuaryStationId = (typeof sanctuaryStations)[number]["id"];

export const sanctuaryEnvironmentModels = {
  courtyardPanel: "/models/sanctuary-courtyard-panel-tripo-v31-v1.glb",
  entranceGate: "/models/sanctuary-entrance-gate-tripo-v31-v1.glb",
  tabernacleCutaway: "/models/sanctuary-tabernacle-cutaway-tripo-v31-v1.glb",
} as const;

export const sanctuaryItemAssembly = [
  {
    id: "altar",
    modelUrl: "/models/sanctuary-burnt-altar-tripo-v31-v1.glb",
    position: [0, 0, 2.65],
    targetMax: 0.8,
    rotationY: 0,
  },
  {
    id: "laver",
    modelUrl: "/models/sanctuary-laver-tripo-v31-v1.glb",
    position: [0, 0, 0.55],
    targetMax: 0.5,
    rotationY: 0,
  },
  {
    id: "table",
    modelUrl: "/models/sanctuary-showbread-table-tripo-v31-v1.glb",
    position: [0.31, 0, -2.72],
    targetMax: 0.5,
    rotationY: 0,
  },
  {
    id: "lampstand",
    modelUrl: "/models/sanctuary-lampstand-tripo-v31-v1.glb",
    position: [-0.31, 0, -2.72],
    targetMax: 0.5,
    rotationY: 0,
  },
  {
    id: "incense",
    modelUrl: "/models/sanctuary-incense-altar-tripo-v31-v1.glb",
    position: [0, 0, -3.72],
    targetMax: 0.4,
    rotationY: Math.PI / 2,
  },
  {
    id: "ark",
    modelUrl: "/models/sanctuary-ark-tripo-v31-v1.glb",
    position: [0, 0, -4.62],
    targetMax: 0.58,
    rotationY: Math.PI / 2,
  },
] as const satisfies ReadonlyArray<{
  id: Exclude<SanctuaryStationId, "entrance">;
  modelUrl: string;
  position: readonly [number, number, number];
  targetMax: number;
  rotationY: number;
}>;
