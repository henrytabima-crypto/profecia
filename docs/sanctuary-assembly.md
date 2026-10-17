# Asamblea modular del santuario

Fecha de implementación: 2026-08-24.

## Decisión de modelado

La experiencia 3D combina coordenadas medidas con nueve activos independientes.
Seis corresponden a los muebles y tres al entorno artesanal. Three.js conserva
el plano, repite los módulos y normaliza sus cajas, mientras los GLB aportan
tejido, madera, metal, pliegues y desgaste que no se leen bien en cajas simples.
Los muebles son:

1. Altar del holocausto.
2. Fuente de bronce.
3. Mesa del Pan de la Presencia con doce panes.
4. Candelabro de siete lámparas.
5. Altar del incienso.
6. Arca, propiciatorio y dos querubines como una sola unidad.

El entorno usa tres GLB adicionales:

1. Un paño de lino con un único poste lateral, repetido tramo por tramo.
2. La entrada oriental completa de veinte codos y cuatro postes.
3. La tienda vacía como corte de museo, con cubierta recogida y velo.

El piso del atrio usa un albedo de tierra desértica generado para esta escena y
guardado en `public/textures/sanctuary-dirt-v1.webp`. La textura se repite con
reflejo alternado (`MirroredRepeatWrapping`) en proporción 2.6 × 5.1 para cubrir
el rectángulo sin estiramiento ni uniones duras; si no carga, permanece el color
ocre anterior como respaldo.

La entrada sigue siendo la séptima estación interactiva y su área táctil se
mantiene en las coordenadas medidas aunque cambie la malla visible.

La vista 3D se presenta como corte abierto: el muro orientado a la cámara queda
ausente y las capas de cubierta se recogen sobre el lado lejano. Esto permite
estudiar la asamblea sin volver a la antigua vista esquemática. La infografía
2D permanece como una alternativa didáctica separada.

## Base bíblica y dimensiones

La escena mantiene el oriente en `+Z` y usa `0.115` unidades de mundo por codo.
El atrio mide 100 × 50 × 5 codos. La tienda se representa con la reconstrucción
habitual de 30 × 10 × 10 codos derivada del número y tamaño de sus tablas. El
velo divide los 20 codos del Lugar Santo de los 10 del Lugar Santísimo.

| Elemento | Especificación usada | Fuente |
| --- | --- | --- |
| Entrada | 20 codos, cuatro postes, lino azul, púrpura y carmesí | Éxodo 27:13–16 |
| Altar | 5 × 5 × 3 codos, acacia y bronce, cuatro cuernos | Éxodo 27:1–8 |
| Fuente | Bronce con base; tamaño y forma no indicados | Éxodo 30:17–21; 38:8 |
| Mesa | 2 × 1 × 1½ codos, acacia y oro, doce panes | Éxodo 25:23–30; Levítico 24:5–9 |
| Candelabro | Una pieza de oro, eje y seis brazos, siete lámparas | Éxodo 25:31–40 |
| Altar de incienso | 1 × 1 × 2 codos, acacia y oro | Éxodo 30:1–10 |
| Arca | 2½ × 1½ × 1½ codos, propiciatorio y dos querubines | Éxodo 25:10–22 |

La colocación sigue Éxodo 26:33–35, 30:6, 30:18 y 40:1–33: mesa al norte,
candelabro al sur, incienso delante del velo, arca detrás del velo, y fuente
entre la tienda y el altar. Las distancias exactas entre muebles no están en el
texto y se tratan como decisiones de composición editables.

Fuentes complementarias:

- [Furniture With a Message · Biblical Research Institute](https://adventistbiblicalresearch.org/articles/furniture-with-a-message)
- [Patriarchs and Prophets · capítulo 30](https://text.egwwritings.org/read/84.1553)
- [Creencia adventista 24 · Ministerio de Cristo en el santuario celestial](https://adventist.org/beliefs/official/christs-ministry-in-the-heavenly-sanctuary)

## Coordenadas de la asamblea

```text
Entrada:        [ 0.00, 0,  5.72]
Altar:          [ 0.00, 0,  2.65]
Fuente:         [ 0.00, 0,  0.55]
Mesa (norte):   [ 0.31, 0, -2.72]
Candelabro:     [-0.31, 0, -2.72]
Incienso:       [ 0.00, 0, -3.72]
Velo visual:    [ 0.00, 0, ≈ -4.05]
Arca:           [ 0.00, 0, -4.62]
```

Cada mueble GLB se clona, se centra en X/Z, se apoya en Y=0 y se escala
uniformemente. Los módulos arquitectónicos se ajustan por eje a sus medidas
documentadas. El área seleccionable se calcula desde el `Box3` real del modelo normalizado,
con solo un pequeño margen adicional. Así el punto táctil permanece unido al
objeto aunque cambien su escala o rotación.

Los paños del atrio se instancian como tramos uniformes de cinco codos: 20 por
cada lado largo, 10 al oeste y 3 en cada hombro oriental. Así el poste incluido
en el módulo conserva el mismo grosor en todo el perímetro. La entrada no se
estira desde esos módulos, sino que usa su propio GLB normalizado a 20 codos de
ancho. Como la malla fusiona poste, basa y tela, los cinco codos describen el
tramo y la altura visible del lino es aproximada. La tienda completa se
normaliza longitudinal y verticalmente al volumen exterior didáctico de 30 × 10
codos. El ancho visual se amplía un 13 % frente a la proporción nominal de 10
codos para dar holgura a los muebles generados por separado, sin mover su
distribución norte/sur; los espesores y salientes internos de la malla siguen
siendo aproximaciones. El GLB se refleja en el eje Z para que su entrada
oriental mire hacia `+Z`, en dirección al atrio, y no hacia el muro occidental.
La cámara general se sitúa al norte (`+X`), el ángulo isométrico desde el que
la malla generada presenta su costado recortado, manteniendo la mesa al norte y
el candelabro al sur.

## Enfoque de cámara

Cada mueble registra un centro y radio derivados de su `Box3` visible; el área
táctil recibe un margen separado que no altera el encuadre. Al
seleccionarlo, la cámara interpola durante 760 ms tanto su posición como el
objetivo de `OrbitControls`. La distancia se calcula con el radio del objeto y
el menor campo de visión disponible, de modo que también funciona en una
pantalla estrecha. Al terminar, el control conserva ese objetivo y el usuario
gira realmente alrededor de la pieza. Al seleccionar de nuevo la pieza activa,
la selección se limpia y la cámara interpola de regreso a la vista general del
atrio y la tienda.

El cerramiento y la tienda se atenúan según la estación activa. En los primeros
planos interiores se ocultan perímetro y entrada; la tienda permanece como capa
fantasma para conservar contexto sin tapar el mueble durante una órbita. La
preferencia de movimiento reducido elimina la interpolación y aplica el enfoque
de inmediato.

## Generación de activos

Las nueve imágenes fuente se produjeron con la herramienta ImageGen integrada,
una llamada por objeto. Todos los prompts pidieron una toma de producto
completa, casi ortográfica, sin texto ni elementos adicionales. Las reglas
específicas fueron:

- Altar: proporción 5:5:3, cuatro cuernos, rejilla, anillos y dos varas.
- Fuente: bronce sobrio, cuenco con agua y base; sin inventar una dimensión.
- Mesa: proporción 2:1:1½ y exactamente doce panes en dos grupos de seis.
- Candelabro: exactamente siete lámparas, sin velas ni menorá de nueve brazos.
- Incienso: proporción 1:1:2, cuatro cuernos, moldura, anillos y dos varas.
- Arca: proporción 2½:1½:1½, dos querubines enfrentados y varas permanentes.
- Paño del atrio: exactamente un poste en el extremo izquierdo y lino blanco
  prolongado hacia la derecha para poder repetir el módulo sin duplicar postes.
- Entrada: veinte codos, exactamente cuatro postes y bordado azul, púrpura y
  carmesí, sin marco arquitectónico ni objetos alrededor.
- Tienda: volumen 30:10:10 vacío, un costado abierto, tablas doradas, velo
  interior y cubiertas recogidas sobre el lado lejano. Una edición posterior
  eliminó un motivo alado no solicitado de la cortina exterior sin cambiar el
  resto de la imagen.

El conjunto completo de prompts normalizados y el prompt de esa edición se
conservan en [`3d-pipeline.md`](./3d-pipeline.md#modulos-del-entorno-del-santuario).

Imágenes fuente conservadas para reproducibilidad:

- `public/3d-sources/sanctuary-burnt-altar-source-v1.png`
- `public/3d-sources/sanctuary-laver-source-v1.png`
- `public/3d-sources/sanctuary-showbread-table-source-v1.png`
- `public/3d-sources/sanctuary-lampstand-source-v2.png`
- `public/3d-sources/sanctuary-incense-altar-source-v1.png`
- `public/3d-sources/sanctuary-ark-source-v1.png`
- `public/3d-sources/sanctuary-courtyard-panel-source-v1.png`
- `public/3d-sources/sanctuary-entrance-gate-source-v1.png`
- `public/3d-sources/sanctuary-tabernacle-cutaway-source-v1.png`

Tripo v3.1 generó los GLB con PBR y `smart_low_poly`, sin el segundo paso de
decimación. Presupuestos de caras: 4 000, 3 000, 4 000, 6 500, 3 500 y 6 500,
respectivamente. El coste observado fue de 40 créditos por objeto.

Los tres activos del entorno usan presupuestos de 2 500, 4 000 y 9 000 caras,
respectivamente. También se generaron con PBR y `smart_low_poly`; el coste
observado fue de 120 créditos en total.

## Optimización para web

Los nueve GLB del santuario conservan sus tres mapas PBR embebidos, pero se
redujeron de 2048² a 1024² con glTF-Transform 4.4.2. El peso conjunto pasó de
10,76 MiB a 6,64 MiB y la estimación de memoria mínima de sus texturas con
mipmaps bajó de aproximadamente 576 MiB a 144 MiB. No se añadió ninguna
extensión ni dependencia de decodificación al navegador.

El paño repetible se simplificó con un límite de error geométrico del 1%: pasó
de 4 278 a 2 723 triángulos. Las 56 copias se dibujan mediante un solo
`InstancedMesh`, compartiendo geometría, material y texturas. En los primeros
planos del interior se ocultan el perímetro y la entrada; la tienda recortada
permanece como contexto translúcido.

## Incertidumbres visibles

- Éxodo no indica forma ni tamaño de la fuente.
- No se registra la altura del candelabro.
- La anatomía y ángulo exactos de los querubines no se especifican.
- La rotación precisa de algunos muebles y la distancia entre ellos no se da.
- La cubierta exterior de la tienda depende de la traducción; se usa cuero
  oscuro neutral sin identificar una especie.
- Éxodo especifica las basas de bronce y los herrajes de plata, pero no declara
  el material de los postes del atrio; la madera visible es una decisión de
  reconstrucción.
- El velo está fusionado en la malla generada. Su ancla didáctica es
  `z ≈ -4.05`, pero su posición visible no debe leerse como una medición exacta.

La interfaz expone estas salvedades en el inspector en vez de presentarlas como
medidas reveladas.
