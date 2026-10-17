# La expedición: recorrido guiado

La experiencia conserva el contenido y los recursos del atlas y los presenta
como una expedición con una única actividad a la vez. El progreso se guarda
localmente; no requiere cambios de backend. La versión aprobada se integra en
`main` y se publica mediante InsForge.

## Recorrido

### Formato común de los ocho niveles (septiembre de 2026)

`app/data/levels.ts` define cada nivel y todos se renderizan con el mismo
componente: Mira, Escucha, Lee, Practica y Tu premio. El primer nivel
conserva su contenido y su guardado. Los niveles 2–8 guardan el progreso por ID
en `journey.levels`, dentro de la misma clave de almacenamiento. Cada nivel
valida sus propias lecturas, parejas y respuestas. Los logros anteriores se
conservan; no se inventa que el usuario haya visto medios nuevos.

El segundo nivel usa `o0aBVL9mu9Y` como video introductorio. Conserva las lecturas
del tema en Lee y añade una etapa Explora antes de Practica. Explora incorpora
la estatua 3D y seis partes, seleccionables también con botones de texto:
cabeza, pecho y brazos, vientre, piernas, pies y piedra. La escena permanece en
una sola vista: tocar una parte muestra su significado y registra el check, sin
transiciones, reinicio de cámara, salto de foco ni avance automático. Una barra
acumula las seis partes, en cualquier orden. Continuar lleva a Practica únicamente
al completarlas; Anterior vuelve a Lee. Los checks previos se conservan.
Practica incluye seis conexiones entre materiales y significados,
clasificaciones y preguntas. El premio es `como-leer-la-profecia.png`.

El podcast del segundo nivel utiliza `TlICMUPaeLU`, con `provisional: false`.
Los videos y podcasts 1–8 tienen sus enlaces definitivos. El podcast 8 utiliza
`UZDHh46wJfQ`, con `provisional: false`. Cada `fuentes.json` registra los enlaces
y su estado publicado.
La lectura de apoyo sigue disponible en Escucha.
Los temas 3–8 reutilizan sus lecturas y preguntas existentes; las
exploraciones de santuario y panoramas continúan disponibles en la galería.
Todos los niveles comparten Mira → Escucha → Lee → Practica → Tu premio; el
segundo añade la exploración de la estatua antes de Practica. Los ocho entregan
su propia infografía al completar las actividades.

### Contenido del primer nivel

El gran conflicto usa ahora cinco etapas: Mira, Escucha, Lee, Practica y Tu
premio. YouTube reproduce ambos medios; `app/data/firstLevel.ts` configura sus
IDs independientemente. Mira utiliza el video del primer estudio, `HBR7xkYm2MU`.
Escucha utiliza el podcast con la infografía como fondo, `soWk2TCDX2Q`.
La lectura de apoyo procede del dossier existente,
no se presenta como transcripción del video. Las cuatro actividades también se
basan en ese dossier y deben cotejarse con los medios finales antes de publicar.
El premio utiliza la infografía aportada en
`docs/notebooklm/01-gran-conflicto/El_Gran_Conflicto_Espiritual.png`, copiada a
`public/infographics/el-gran-conflicto.png`. Se conserva en la galería, con miniatura
optimizada y un diálogo para ampliarla sin abandonar el recorrido. Los archivos
locales de video y audio se eliminaron el 2026-09-20, salvo el MP4 del podcast 8
pendiente de subir. Las infografías se conservan; los medios se sirven desde YouTube.

El podcast se exportó y se publicó en YouTube; su archivo local, ya eliminado, era
`docs/notebooklm/01-gran-conflicto/export/El_gran_conflicto_podcast_1080p.mp4`:
infografía fija durante todo el audio original, encuadre 1920 × 1080 sin recortar,
H.264 a 24 fps y audio AAC copiado sin recomprimir. El audio fuente dura unos
15 minutos y 5 segundos. Su URL de YouTube ya está configurada en
`firstLevelMedia.podcast.id`, con `podcast.provisional` desactivado.

Continuar marca voluntariamente los pasos multimedia, sin exigir tiempo de
reproducción. Lee presenta tres ideas con referencias y checks. Las actividades
finales se resuelven individualmente; una respuesta incorrecta muestra amarillo
y una pista. La correcta muestra verde, explicación y habilita Continuar. Las
clasificaciones de los dos primeros temas reúnen cuatro tarjetas y dos categorías
visibles lado a lado, también en celular. Admiten tocar tarjeta y destino, o
arrastrarlas. Cada acierto permanece en su categoría; los errores muestran una
pista y permiten reintentar. Continuar exige las cuatro tarjetas, con guardado
parcial y conservación del crédito obtenido en las clasificaciones anteriores.
Conecta presenta tres pasajes a la izquierda y sus tres descripciones, mezcladas,
a la derecha. Se unen tocando ambos extremos; todas las tarjetas tienen pareja.
Cada acierto deja una línea verde y un check numerado. Una conexión equivocada
muestra una línea amarilla y una pista, sin borrar las parejas correctas.
Continuar requiere las tres conexiones; el guardado conserva los aciertos
parciales. El progreso del ejercicio anterior conserva el crédito ya obtenido.
La última respuesta habilita recibir el premio; completarlo no duplica logros.

El progreso `firstLevel` vive dentro de `profecia-aventura-v1`: etapa, lecturas
exploradas, respuestas correctas y premio, además del segundo de reproducción
separado por tipo de medio e ID de YouTube. Al cambiar de medio no se reutiliza
el minuto del anterior. Reiniciar aventura elimina este progreso junto al resto.
El reproductor muestra un aviso breve si no puede cargar, sin enlaces externos
ni mensajes sobre decisiones de implementación en el recorrido. El minuto
solo se puede registrar cuando la API de YouTube está disponible. Se utiliza
el host estándar `www.youtube.com`: el reproductor de `youtube-nocookie.com`
quedaba en blanco en la vista integrada. Se verificó la reproducción del primer
estudio con avance del contador y controles activos.

En navegadores con View Transitions, el contenido anterior sale a la izquierda
y el nuevo entra por la derecha; en los demás el cambio es inmediato. La opción
de reducir movimiento elimina las animaciones y el confeti. El diseño prioriza
celular, controles grandes, feedback con texto e iconos y navegación manual.

Todas las misiones son accesibles desde el mapa. La ruta sugiere la primera
pendiente y Continuar retoma la última misión abierta que aún no se ha completado.
Abrir misiones no otorga logros ni recursos. Completar las etapas de cada nivel y sus
actividades permite reclamar una sola vez el logro correspondiente.

### Registro del recorrido anterior (ya sustituido en la interfaz)

1. Abrir el mapa directamente y tocar una misión para iniciar o continuar.
2. Leer el pasaje bíblico y la clave de lectura directamente en el reto, antes de
   responder. Los versículos se cargan de los textos locales RV1909, sin exigir
   abrir el lector ni otra página. Esta preparación permanece aunque se omitan
   las ayudas y también se incluye en los cinco retos de Daniel.
   Descubrir el tema con una elección sencilla. La primera misión señala dónde
   pulsar; las ayudas se pueden omitir y esa preferencia queda guardada.
3. Conectar tres pistas: cada acierto abre la siguiente ronda automáticamente,
   conserva los aciertos anteriores y explica el vínculo con un pasaje bíblico.
   Un error ofrece una pista específica y permite volver a intentarlo.
4. Aplicar lo aprendido en el reto final, con intentos libres y sin penalización. En la segunda misión,
   «El sueño del rey» enseña a seleccionar materiales, conectar pasajes y ordenar
   los primeros reinos mediante cinco ejercicios con pistas progresivas.
5. Completar la misión y descubrir el logro antes de continuar.

Los cierres de misión muestran pasajes breves relacionados con la pregunta.
La clave histórica sobre el Gran Chasco y las aplicaciones de la guía se
identifican aparte del texto bíblico. Al avanzar, el foco vuelve a la lectura
previa; la pregunta aparece después de la información necesaria para resolverla.

Las transiciones duran entre 120 y 140 ms y señalan los cambios de pantalla,
ronda, lectura y respuesta. No retrasan los clics ni el foco, conservan la escena
3D de Daniel y se desactivan cuando el dispositivo solicita reducir movimiento.

La ruta recomienda la siguiente misión. Las primeras cinco también entregan una
herramienta: glosario, estatua de Daniel 3D, cronología, santuario 3D y panoramas de
Apocalipsis. Las misiones seis a ocho entregan sus propios reconocimientos y el
cierre del recorrido. Los recursos permanecen en la Galería; el método y la mesa
de fuentes siempre están disponibles.

En Galería, «¿Ya conoces el recorrido?» contiene «Trampa: desbloquear todo».
Se puede desactivar; nunca concede misiones ni logros por sí sola.

## Guardado y compatibilidad

- `profecia-aventura-v1` contiene progreso versionado, misión actual, pasos,
  respuestas, modo libre y conexiones visuales exploradas. Incluye las respuestas
  parciales de las actividades de cada misión y la preferencia de ayudas.
- Los ocho niveles comparten cinco etapas base; el segundo añade Explora antes
  de Practica, con sus propias actividades y
  requisitos de exploración. La navegación mantiene una acción principal para
  continuar; los cuadernos y las fuentes son opcionales.
- `profecia-daniel-journey-v1` conserva el reto actual, las selecciones parciales,
  las ayudas y la carta obtenida en Daniel. Se recupera también el progreso del
  piloto anterior. Se mantiene por compatibilidad y se elimina al reiniciar; el
  segundo nivel actual valida sus propias seis partes y actividades.
- Las misiones ya completadas conservan sus logros y recursos. Repetir los retos
  de Daniel no revoca la carta ni duplica el logro «Lector de símbolos».
- `profecia-estudios-completados` se lee para recuperar el avance anterior y no se
  modifica. Los IDs se validan y deduplican. El avance disperso conserva sus logros
  y recursos; el recorrido continúa por la primera misión pendiente.
- El acceso a almacenamiento se protege frente a errores; si guardar falla,
  aparece un aviso y se puede continuar durante la sesión.
- El guardado pertenece al navegador **y al origen** (host y puerto). Una vista
  previa en otro puerto tiene almacenamiento independiente. No hay sincronización
  entre navegadores; para acceder libremente a los recursos puede usarse la trampa.
- «Reiniciar aventura», al pie de la página, muestra qué se borrará y permite
  volver a la misión 1. Elimina las tres claves de progreso (incluida la anterior),
  la carta, los hallazgos y la trampa. No borra otros datos del almacenamiento.
  Si el navegador impide eliminar una clave, el aviso aclara que el guardado
  anterior podría volver tras recargar.

## Validación

`npm test` compila y ejecuta los tests de progresión, recuperación, finalización,
HTML inicial, contenido y activos. `npm run lint` revisa el código.

Prueba manual sugerida para iterar: completa la primera misión y abre el glosario;
cierra el recurso y continúa a la segunda; vuelve al mapa y recarga; después,
activa y desactiva la trampa desde Galería y comprueba que tu cuenta de logros no
cambia. Prueba también en móvil y con teclado.

En la segunda misión, comprueba un error y su pista, una secuencia parcialmente
resuelta tras recargar, y la lectura de Daniel 2 y 8 desde las explicaciones.
El reto se muestra dentro de la misión, conservando el mapa, la Galería y el
lector bíblico de la rama `codex/aventura-profetica`.

### Recuperación del reproductor de YouTube

En la vista previa integrada se observó un fallo intermitente: el iframe quedaba
en `about:blank` sin emitir `onReady` ni un código de error. Una página mínima
con el mismo iframe también falló allí, mientras el podcast se reprodujo en
Chrome. Al recrear el reproductor, la vista previa recuperó la reproducción.
Esto acota el fallo al arranque del contenido incrustado; no demuestra una
restricción permanente del navegador ni un problema de permisos del video.

El componente reintenta una sola vez si no recibe `onReady` en 15 segundos.
Un reproductor listo o que haya emitido un error explícito no se reemplaza
automáticamente. El reintento conserva el último segundo guardado. Si sigue
fallando, muestra recuperación manual y un enlace a YouTube solamente en ese
estado. Los errores de video privado, inserción deshabilitada e identificación
del navegador se distinguen cuando YouTube devuelve su código.
