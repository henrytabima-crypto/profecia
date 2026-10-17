# Notebooks públicos y kit editorial de NotebookLM

Esta carpeta contiene el material de producción interno para mantener un notebook público por cada uno de los ocho estudios de la ruta. Los dossiers no forman parte del sitio publicado porque `docs/` está excluido del despliegue; los notebooks enlazados al final son la experiencia pública completa.

El notebook es el formato principal de distribución: reúne fuentes, notas, conversación asistida y recursos multimedia en un solo lugar. El resumen de audio puede vivir dentro de NotebookLM como complemento, sin descargarlo ni alojarlo por separado.

## Qué contiene

Cada carpeta de lección incluye:

- `contenido.md`: dossier original en español con el argumento, las distinciones de evidencia y el arco sugerido.
- `fuentes.json`: catálogo verificable de URLs, perspectiva, uso permitido y afirmaciones que la fuente **no** respalda.
- `prompt.md`: dirección específica para el episodio.

Los archivos comunes son:

- `prompt-maestro.md`: reglas editoriales que deben usarse en todos los episodios.
- `politica-de-fuentes.md`: criterio de selección, idioma, atribución y derechos.

## Flujo recomendado de producción y publicación

1. Mantén un notebook independiente para cada lección y nómbralo con su número y título.
2. Sube su `contenido.md` como fuente editorial.
3. Abre `fuentes.json` y añade en NotebookLM cada URL cuyo campo `ingest` sea `url` o `pdf`. Comprueba que NotebookLM haya importado texto útil; una URL aceptada no garantiza una lectura completa.
4. No subas `fuentes.json` como evidencia: es un catálogo de control, no una fuente histórica o doctrinal.
5. Si generas un resumen de audio, usa español latinoamericano y combina `prompt-maestro.md` con el `prompt.md` de la lección.
6. Revisa fechas, nombres, citas y atribuciones antes de actualizar el notebook público. Consulta `claims_not_supported` para detectar extrapolaciones.
7. Conserva el permiso público de consulta y usa el enlace estable del notebook en la web. Google puede solicitar que el visitante inicie sesión, aunque el notebook esté compartido públicamente.
8. Mantén el audio y los demás recursos generados dentro del notebook; no es necesario alojarlos en este proyecto.

## Orden de autoridad

1. Texto bíblico: lo que el pasaje afirma o describe.
2. Declaración oficial adventista: lo que la denominación enseña.
3. Elena G. de White: voz interpretativa primaria de la tradición adventista.
4. Investigación histórica, archivo o museo: contexto documentado.
5. Exposición pastoral: explicación valiosa, pero no declaración doctrinal oficial.
6. Síntesis editorial: conexión propuesta, siempre presentada como inferencia.

## Notebooks públicos

- [01 · El gran conflicto](https://notebook.google.com/notebook/f4668d2f-17d2-4797-b44e-122e9109e13d) — `01-gran-conflicto/`
- [02 · Cómo leer la profecía](https://notebook.google.com/notebook/f8df7d61-e213-44f2-9af3-b8078f531249) — `02-como-leer-profecia/`
- [03 · Daniel 8–9 y 1844](https://notebook.google.com/notebook/ffbec6d1-94be-43ae-9d98-1ac689c83dca) — `03-daniel-8-9-1844/`
- [04 · Santuario y juicio](https://notebook.google.com/notebook/03d5b4a6-e253-4245-9346-e59a0d074179) — `04-santuario-juicio/`
- [05 · Los tres ángeles](https://notebook.google.com/notebook/4352a0ca-086c-409c-ac43-02122d791896) — `05-tres-angeles/`
- [06 · Adoración y libertad](https://notebook.google.com/notebook/1c8d519c-e3a3-4534-9872-6c41f2ec16db) — `06-adoracion-libertad/`
- [07 · Muerte y discernimiento](https://notebook.google.com/notebook/6ebd6b35-a681-4de2-bcc9-7e364eb245d6) — `07-muerte-discernimiento/`
- [08 · Venida y Tierra Nueva](https://notebook.google.com/notebook/753006c4-4260-4002-8ce8-1331ae25b0e3) — `08-venida-tierra-nueva/`
