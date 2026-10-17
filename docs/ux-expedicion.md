# UX de la expedición: mundo y ruta

Profecía abre directamente en el mundo de misiones: mapa → ficha del nodo
→ misión → pasos educativos → premio / desbloqueo → mapa. La pantalla Inicio
se eliminó por decisión de Henry; este ajuste solo afecta a Profecía.
Profecía conserva su identidad azul, verde y dorada, las ocho misiones y el
centro del relato en Cristo.

## Referencia y cambio de estructura

La referencia `image(1).png` (Library
`libfile_c323547d7790819185b501ee2648bd64`, versión 0) se materializó e inspeccionó
en el executor antes de este rediseño, con el helper oficial y sus metadatos.
Se tomó la experiencia de mapa: mundo vertical, ruta sinuosa, nodos de niveles,
marcador de progreso, HUD y navegación inferior. No se copiaron sus recursos,
marca, tienda, vidas ni mecánicas comerciales.

`app/components/ExpeditionWorld.tsx` reemplaza la lista de tarjetas por un mundo
ilustrado SVG original: paisaje continuo, caminos, árboles, arquitectura y un
horizonte de restauración. El mapa ocupa el viewport, tiene su propio scroll y
las misiones ascienden de la 1 a la 8. El escritorio conserva ese mundo central
amplio y los mismos controles.

## Navegación

- La carga inicial y la recarga abren el mapa centrado en la misión pendiente,
  después de restaurar el progreso. El logo también regresa al mapa.
- Los ocho nodos son botones nativos, disponibles sin exigir orden.
- Tocar un nodo abre una ficha modal con resumen, progreso, premio y entrada.
- La brújula sobre el nodo señala la reanudación. El botón flotante vuelve a ella.
- El dock persiste con Mapa, Galería y Opciones; las instrucciones y el reinicio
  viven en Opciones. Reiniciar vuelve al mapa de la misión 1.
- Salir de la misión vuelve al mundo centrado en esa misión.
- Galería permite abrir un recurso conseguido o visitar su misión correspondiente.
- El premio ofrece acceso al recurso obtenido, a la siguiente misión o al mundo.

Las tres estrellas representan hitos reales, sin puntuación nueva: mirar y
escuchar, leer y explorar, y recibir el premio. Los logros anteriores conservan
los tres hitos. La exploración libre abre recursos sin conceder logros y se
puede desactivar.

## Progreso y compatibilidad

`app/data/expedition.ts` sigue derivando el progreso de los datos existentes.
Cuenta medios confirmados, lecturas, partes exploradas y actividades; las parejas
y clasificaciones parciales contribuyen proporcionalmente. El 100% requiere
recibir el premio. Los logros antiguos se muestran completos y no se convierten
en respuestas o reproducciones inventadas. Su repaso explica que el logro se
conserva.

No cambia la versión, claves ni estructura del guardado. Conserva misión,
lectura, actividad y posiciones multimedia. Sigue disponible el contenido
Mira → Escucha → Lee → (Explora en Daniel) → Practica → Tu premio.

## Accesibilidad y validación

Los nodos tienen nombres, estados, foco visible y áreas táctiles amplias. Flechas
arriba/derecha avanzan al siguiente nodo; abajo/izquierda retroceden. Inicio/Fin
van a extremos. Tab y Enter usan controles nativos; Escape cierra las fichas y
restaura el foco. La región del mundo admite scroll con teclado y conserva el
zoom del navegador. Las barras e hitos tienen nombres accesibles. Las animaciones
son breves y respetan `prefers-reduced-motion`.

Checks: `npm run lint`, `npm test` (build, TypeScript y 71 pruebas) y
`git diff --check`. Chromium local verificó mundo a 390 px y escritorio, ausencia
de tarjetas del mapa anterior, ficha de misión y foco, brújula, entrada fuera de
orden, reanudación tras recarga, reinicio por Opciones, desbloqueos, legado y
anchos de 320, 390, 768 y 1440 px. Las capturas y resultados permanecen locales.

La verificación bloqueó servicios externos. No prueba reproducción remota de
YouTube ni fuentes de NotebookLM. No se subieron capturas a Library, se publicó
ni se desplegó.


## Secuencia de progreso y movimiento

El movimiento comunica eventos reales. Confirmar un paso nuevo marca su check,
actualiza la barra y muestra texto de avance. Recibir un premio nuevo revela el
emblema y el recurso desbloqueado. «Seguir en el mapa» vuelve al mundo, muestra
los tres hitos ganados y mueve la brújula por el siguiente tramo, con un anuncio
textual de la misión completada y del siguiente paso. Los controles permanecen
activos durante la secuencia.

`awardTransition` detecta solo logros nuevos comparando el estado anterior y el
posterior. Estos eventos son transitorios, no se escriben al almacenamiento, y
se consumen en el primer retorno al mapa. Reabrir un premio usa «Tu hallazgo
sigue aquí» y no reproduce confeti ni anuncios de un desbloqueo nuevo. Al
completar fuera de orden se centra el siguiente tema pendiente; no se dibuja un
tramo falso a través de misiones sin completar. Al terminar todo el recorrido,
el marcador permanece en la última misión.

Con movimiento reducido, las posiciones y el texto de progreso son los mismos,
sin desplazamientos animados. El texto «Progreso guardado» solo aparece después
de una escritura local exitosa; durante ella muestra «Guardando tu avance…».
El fallo de almacenamiento mantiene la experiencia en memoria y avisa de la
limitación. No se anuncian en voz alta los guardados repetidos de reproducción.


Evidencia visual local de la revisión: mundo a 390 px y escritorio, ficha,
confirmación de paso, premio y capturas del retorno en 0/680/1450 ms. La QA de
secuencia comprueba posiciones distintas del marcador y el trazado revelado,
mientras el guardado mantiene únicamente la misión realmente completada. Otra
pasada con movimiento reducido completa la misma misión sin animaciones y
conserva el anuncio textual. Se comprobó que los botones de misión permanecen
encima del dock en todos los anchos revisados.


La prueba de movimiento reducido usa Playwright y el Chromium headless local:
`browser.newContext({ reducedMotion: 'reduce' })`. Es emulación nativa de la
media feature del navegador en un contexto aislado, sin reemplazar `matchMedia`,
sin CSS de prueba para anular movimiento y sin modificar ajustes del Mac.
La captura de producción verifica explícitamente
`matchMedia('(prefers-reduced-motion: reduce)').matches === true`,
`no-preference === false` y cero animaciones activas. La secuencia normal usa
otro contexto con `reducedMotion: 'no-preference'`. Los scripts reproducibles
están en el workspace task-6 y el resultado en
`evidence/world-v2/reduced-motion-browser.json`.
