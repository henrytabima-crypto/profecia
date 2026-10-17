# Lector bíblico integrado

Las citas de las misiones, sus fuentes bíblicas, el glosario y los exploradores
abren un lector modal sin abandonar la página ni modificar el progreso.

- Muestra exactamente el rango citado y conserva las listas discontinuas.
- Permite leer el capítulo completo, resaltando los versículos del pasaje.
- Las referencias compuestas permiten elegir y recorrer cada capítulo citado.
- Se cierra con Escape, el botón de cierre, el fondo o «Volver al juego».
- Un diálogo nativo mantiene el foco dentro del lector. El glosario suspende su
  manejador de teclado mientras el lector está abierto y recupera la ficha al cerrar.

## Texto y procedencia

La edición integrada es **Reina-Valera 1909**, de dominio público según
[eBible.org](https://ebible.org/spaRV1909/copyright.htm). Se identifica en el lector
y en los botones de fuentes bíblicas. Los enlaces documentales originales a otras
ediciones se conservan en los datos; no se presenta RV1909 como RVR1960.

Fuente oficial: <https://ebible.org/Scriptures/spaRV1909_usfx.zip>.

`public/bible/rv1909/catalog.json` registra origen, licencia, hash SHA-256 del XML y
capítulos incluidos. Los archivos por libro contienen solo los 82 capítulos que
utiliza el catálogo actual; los 168 pasajes se validan contra ellos. La importación
preserva el texto literal y su numeración; solo normaliza espacios y retira marcado
XML de formato. No hay texto generado ni resúmenes sustitutivos.

El archivo fuente tiene algunas divisiones de versículos diferentes a otras
ediciones, incluidas posiciones vacías fuera de los capítulos utilizados. El
importador rechaza capítulos con posiciones vacías para no ocultar texto faltante.

## Actualizar los datos

Descarga y extrae el ZIP oficial, luego ejecuta:

```sh
python3 scripts/import_bible.py /ruta/al/spaRV1909_usfx.xml
```

El importador verifica el hash de la fuente y genera los archivos del catálogo.
Si se añade una referencia a otro capítulo, actualiza el catálogo e importa de
nuevo. `tests/bible.test.mjs` detecta referencias sin texto y comprueba la selección
exacta, las referencias compuestas y los capítulos de contexto.

El texto se carga desde el mismo sitio al abrir un pasaje, por libro, y se mantiene
en memoria para lecturas posteriores. No requiere cuentas ni una API bíblica
externa. Si la carga falla o tarda demasiado, el lector ofrece reintentar y volver
al juego sin perder la misión.
