# Feel It

Experiencia narrativa en primera persona creada para **Laboratorio de visualización**. El concepto presenta un dispositivo retro-futurista que transforma una canción en un caramelo emocional.

Todo el mundo visual se construye con Three.js y geometría procedural: no hay modelos 3D, texturas ni imágenes externas. Los únicos archivos que se esperan son las dos pistas de audio.

## Ejecutar localmente

La forma más rápida en Windows es hacer doble clic en **`abrir-feel-it.bat`**. Abrirá automáticamente `http://127.0.0.1:4174` en tu navegador usando el pequeño servidor incluido; no utiliza Python ni requiere instalar paquetes con npm. Solo necesita tener Node.js instalado.

También puedes abrirlo con un servidor estático manual. No funciona correctamente al abrir `index.html` con doble clic, porque el navegador bloquea los módulos locales.

```bash
npx serve .
```

También puedes usar la extensión Live Server de VS Code. Abre la dirección que indique el servidor en un navegador moderno.

## Añadir el audio

Las pistas ya integradas son:

```text
audio/alegria.wav      → selección Felicidad
audio/tristeza.mp3
```

Para cambiar la música en el futuro, reemplaza esos archivos sin cambiar sus nombres. La pista de Tristeza se recibió como `tristreza.mp3`, pero se integró en el proyecto con el nombre correcto `tristeza.mp3`.

Las canciones se reproducen exclusivamente durante el minijuego neuronal. Si los archivos aún no existen o no pueden cargarse, la experiencia continúa sin sonido.

## Controles

| Control | Acción |
| --- | --- |
| `W`, `A`, `S`, `D` | Moverse por la tienda |
| Mouse | Mirar alrededor (haz clic en el lienzo para capturarlo) |
| Click | Interactuar con el vendedor y la interfaz |
| `E` | Comer el caramelo |
| `ESPACIO` | Procesar la emoción en el minijuego |
| `ESC` | Cerrar el instructivo |

## Despliegue

El contenido es un sitio estático sin backend ni build step. Sube todos los archivos tal cual a Vercel, Netlify o GitHub Pages. Three.js se importa desde CDN mediante el import map de `index.html`, por lo que el navegador necesita conexión a Internet para cargar la librería.

## Estructura

```text
index.html               punto de entrada
style.css                interfaz y estética visual
audio/                   las dos pistas aportadas por el usuario
src/scenes/              secuencia narrativa
src/objects/             dispositivo, vendedor, caramelo y red neuronal
src/utils/               controles y fundidos
```
