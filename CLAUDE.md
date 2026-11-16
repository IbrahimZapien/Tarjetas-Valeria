# Tarjetas de Valeria: instrucciones para Claude

Este repositorio guarda tarjetas para que Valeria aprenda el **código escrito**: reconocer letras, sílabas y palabras, y relacionarlas con su pronunciación.

**LSM no es lo que se enseña aquí.** LSM es su lengua: ya conoce las configuraciones y con ella se expresa cada vez mejor. Su mamá o su papá saben LSM, siempre está con ella uno de los dos y le enseñan las señas y la pronunciación en persona. En la tarjeta, la seña es solo un **puente** pequeño: conecta lo que ella ya sabe (la seña) con lo que está aprendiendo (la palabra escrita).

## Quién es Valeria (léelo antes de diseñar)

- Tiene 11 años y autismo. No habla, pero lo intenta. Escucha y se comunica en LSM.
- Es inteligente. **Su atención es muy breve y la pierde rápido**, a menos que lo que ve le interese. Por eso cada tarjeta tiene que engancharla con algo que le guste.
- Le gusta:
  - Pepa Pig.
  - Roblox.
  - TikTok.
  - **Juegos de destreza**, como una pelota que rueda por un puente elevado comiendo monedas.
  - Recetas de comida china. Le gusta **cocinar y revolver mezclas** hasta que quedan homogéneas.
  - **Slime y squishies**.
  - **Nadar**, viajar, los **hoteles** y pasar el día en ellos.
  - La **comida picante** y el **ramen**.
  - Todo lo **coreano**, pero no la cultura: le atraen los **alimentos** (tteokbokki, kimbap, kimchi, ramyeon, dumplings) y las **formas y el estilo visual** (lo kawaii o "cute" coreano, formas redondas y suaves).
  - La **velocidad** y los **carros**.
  - **Comprar en línea**: abrir paquetes, el carrito de compras, ver llegar un pedido a casa (dibújalo **sin marcas ni logos**: caja de cartón con moño, carrito, camioncito de reparto).
  - La **comida italiana**: pizza, pasta, lasaña.
- **Fortalezas**: cocina sola (sigue pasos en orden), tiene **muy buen sentido de orientación** (rutas, caminos, mapas) y **muy buena memoria**. Úsalas: secuencias numeradas, caminos y rutinas siempre iguales.
- **Ejercicio**: su familia la está motivando poco a poco. Cada tarjeta incluye un movimiento sencillo y divertido (saltar, aplaudir, estirarse), nunca como castigo.
- **Es tierna.** Aunque le gusten la velocidad y los carros, todo debe verse dulce y amable: carritos redondos y sonrientes, con mejillas rosadas. Nada agresivo, de carreras rudas ni de choques.

## ⭐ DISEÑO BASE (aprobado por el usuario el 16/11/2026)

La tarjeta de **estrella** es el **diseño base oficial**: todas las tarjetas nuevas se hacen igual. Referencia visual en `plantilla/base/diseno-base.png` (y `.pdf`), JSON de ejemplo en `plantilla/base/ejemplo.json`. En git corresponde al commit `41fe6a8`. **No cambies la estructura** (orden de los elementos, tamaños, estilo) a menos que el usuario lo pida; para cada palabra nueva solo cambian: la escena, el fondo ilustrado, los colores, las sílabas y la seña.

## Diseño actual: una hoja A4 por palabra

`node generar.js tarjetas/<palabra>.json` crea **`tarjetas/<palabra>.pdf`** (una página **A4**, lista para imprimir) y la vista previa `tarjetas/<palabra>-frente.png` (1240 × 1754 px = A4 a 150 ppp). Usa bien la hoja: márgenes chicos (≈7 mm) y elementos grandes.

- **La hoja:** escena (squishy, en su mundo) → en cada columna, de arriba hacia abajo: **mano LSM → boca** (cómo se pone la boca para ese sonido, justo debajo de la mano para verlas al mismo tiempo) **→ letra** en su ficha de color por sílaba → arco en "U" por sílaba → abajo, la **seña de la palabra** (foto empalmada) a todo lo ancho.
- **Sin la palabra grande en blanco:** el usuario la quitó porque la palabra ya está en las fichas y en las manos LSM. No la vuelvas a poner.
- **Sin reverso:** al usuario no le gustó el reverso de práctica (traza, ordena, completa, muévete) y pidió quitarlo. No lo vuelvas a hacer a menos que lo pida.
- **Bocas debajo de cada letra**: **fotos reales** de la boca en `bocas/<letra>.jpg`, recortadas de la "Guía del alfabeto fónico" que mandó el usuario. La foto se elige por **cómo suena** la letra en español de México (`plantilla/bocas.js`, `sonido()` y `FOTO_DE_SONIDO`): v→b, ll e y+vocal→y, c→k (ca, co, cu) o s (ce, ci), g→j (ge, gi), z/x→s, rr y r inicial→r con pista de vibración. Sin foto: **ch** (dibujo) y las **mudas** (h; u de que/qui/gue/gui) con símbolo de "no suena". Los dígrafos llevan una sola boca. La guía tiene descripciones que no corresponden al español (v "muerde el labio", h "soplando", n "cierra los labios"): por eso se usa el sonido. Sugiere validar con su terapeuta de lenguaje.
- **Manos LSM (dactilología) encima de cada letra**: un sticker en miniatura por letra, tomado de `abecedario/<letra>.png` (los stickers los manda el usuario; **no inventes configuraciones**). `generar.js` avisa qué stickers faltan.
  - Cada sticker va en un **círculo blanco** encima de su letra. **Dígrafos (ll, rr, ch)**: una sola **cápsula blanca** abarca las dos letras (son una sola letra, un solo sonido); dentro van la mano de la primera letra, copias de la mano **en escala de grises** cada vez más tenues (el movimiento) y la mano de la segunda letra.
  - Los stickers son los **originales del paquete de WhatsApp** del usuario (27 letras, a–z con ñ; transparentes, 512 px), exportados con "Exportar chat → Adjuntar archivos". La ll se forma con dos l. Si mandan otro paquete así: descomprime el .zip, ordena los .webp por nombre, recorta al contenido y guarda en `abecedario/<letra>.png`. `plantilla/recortar_abecedario.py` queda como respaldo para recortar desde una imagen con fondo liso. Revisa siempre los stickers sobre fondo de color.
- La versión anterior está en `plantilla/generar-v1.js` y `tarjetas/anteriores/`.

## Reglas de diseño (aplícalas a TODAS las tarjetas)

1. **Lo escrito es lo principal.** El orden de importancia en la tarjeta es: la palabra escrita > las fichas por sílaba > la letra inicial > la escena > la seña.
2. **Llevar la palabra a su mundo.** La escena de arriba pone el objeto *dentro* de algo que le interesa, no en su lugar de siempre. Por ejemplo, la estrella no está en el cielo: es la meta de un juego de pelota con monedas. Así entiende que la palabra sirve en muchos lugares y mantiene la atención. Otros ejemplos:
   - Una alberca o un hotel.
   - Un tazón de ramen o una cocina con mezclas.
   - Texturas de slime o squishy.
   - Comida coreana con carita: un kimbap, un tteokbokki o un tazón de ramyeon.
   - Un carrito tierno y veloz, con líneas de velocidad, que llega a la palabra.
   - Un paquete que llega a casa o un carrito de compras (sin marcas).
   - Una pizza o un plato de pasta.
   - Algo que salta, corre o se estira (ejercicio).

   Elige el gusto que mejor encaje con la palabra, y **varía los gustos** entre tarjetas.
3. **Colores: juega y arriésgate.** Valeria tiene 11 años, le encantan el slime, los squishies, lo kawaii coreano, Roblox y TikTok: nada de colores planos y aburridos. Cada tarjeta define en el JSON (`colores`):
   - `fondoImagen` (preferido): una **ilustración de página completa** que lleve a Valeria al mundo de la palabra, en `escenas/<palabra>-fondo.svg` (1240 × 1754). Ej. estrella: **cielo estrellado de fantasía** con nebulosas de colores, cientos de estrellitas, destellos, estrella fugaz, un planeta tierno con anillo y una luna con carita junto a la palabra. Otras ideas: fondo del mar o alberca con burbujas y pececitos (agua), cocina con vapor y especias (ramen), mesa con mantel de cuadros y albahaca (pizza), ciudad con caminos y carritos (carro), un mundo de slime que escurre. Los detalles con carita van en espacios libres (p. ej. la franja entre la escena y las manos), nunca debajo de los paneles ni encima de los arcos.
   - **Todo el fondo y los adornos son del tema de la palabra, nada de otras tarjetas**: las estrellitas y destellos eran de "estrella"; en "taco" los adornos son tacos, chiles, limones, aguacates, cilantro, cebolla y papel picado (ver `escenas/taco-fondo.svg`: patrón tenue de íconos del tema + personajes con carita en los espacios libres a los lados de las fichas cuando la palabra es corta). Revisa que la escena tampoco tenga destellos de otro tema.
   - `fondo`: **degradado** de respaldo (lista de colores) por si no hay ilustración.
   - `escena`: degradado pastel (cielo de algodón de azúcar, agua, etc.).
   - `silabas`: cada sílaba como `[claro, fuerte]`: ficha tipo **gelatina** con degradado; el color fuerte también es el **anillo** de su mano y su boca.
   - `patron`: `destellos`, `burbujas` o `corazones` suaves en el fondo, con `patronColores`.
   - `sombraPalabra`: color de la sombra de la palabra blanca.
   Ideas por tema: ramen → rojo picante/naranja/amarillo con burbujas; alberca → turquesa/aqua/azul con burbujas; slime → verde lima/morado neón; pizza → rojo tomate/amarillo queso/verde albahaca; paquete → kraft/rosa/celeste; carro → naranja/amarillo/rojo veloz. Siempre con buen contraste para leer la palabra.

4. **Un solo foco en la escena.** El objeto es grande y simpático, con pocos adornos (2 o 3 destellos como máximo). Lo que hay alrededor apoya, no compite.
   - **Forma reconocible primero**: si el objeto tiene un emoji, usa su silueta como referencia (render del emoji con la fuente Noto Color Emoji vía Playwright y compáralo lado a lado). Ej.: el taco se dibujó copiando la forma del emoji 🌮 tras varios intentos fallidos.
   - **Estilo squishy / slime para el objeto principal** (a Valeria le encantan las cosas suaves): formas gorditas con las puntas redondeadas, un poco aplastadas como si se hundieran por su peso, un degradado brillante tipo gel, brillos blancos grandes, una sombra suave debajo, alguna gotita de slime y líneas de "squish" a los lados. Carita kawaii con ojos grandes y brillantes. Ejemplo: la estrella de `escenas/estrella.svg`.
5. **La palabra** va en minúsculas, en letra redonda (Fredoka), blanca y muy grande.
6. **Fichas por letra, agrupadas por sílaba**, tipo squishy: redondas, con brillo arriba y sombra abajo. Cada sílaba tiene su color y hay más espacio entre sílabas. **Debajo de cada sílaba va un arco en forma de "U"** (como un puente invertido), que empieza en una monedita y termina en una flecha. Se recorre con el dedo **de izquierda a derecha** mientras se pronuncia la sílaba, para ensayar cómo suena. Separa las sílabas correctamente en español.
7. **Orden de las letras**: de izquierda a derecha, cada letra con su mano LSM arriba (sin números). **No pongas paneles de conteo ni ejercicios de números**: el usuario quiere trabajar los números aparte.
8. **Panel "seña"**: abajo, a todo lo ancho. **No inventes la forma de una seña.** Si no hay referencia, deja `"sena"` fuera del JSON y aparece "seña pendiente".
   - **Preferido: foto real empalmada** (así lo pidió el usuario). Pide un **video corto** de la seña y ejecuta `python3 plantilla/empalmar.py VIDEO senas/<palabra>-foto.jpg --cuadros 1,a,b,c,d --recorte x0,y0,x1,y1`. El primer cuadro (el inicio) queda **nítido**; los siguientes se enciman con **transparencia progresiva** (cada vez más transparentes) para mostrar el recorrido. Elige los cuadros revisando una hoja de contactos del video (ffmpeg). Recorta horizontal (más o menos 2 de ancho por 1 de alto), dejando ver todo el recorrido de las manos. Las fotos llenan el panel completo.
   - Si solo hay fotos sueltas, empálmalas igual (el inicio nítido y las demás transparentes) o pregunta.
   - **Si el empalme no se entiende** (las manos se enciman en el mismo lugar, como en "taco", o el video es vertical): usa **dos fotos lado a lado**, inicio (1) → final (2), con una flecha rosa en medio y los números abajo en las esquinas (la etiqueta "seña" tapa la esquina de arriba). Elige los cuadros más nítidos (menos movidos) y en los que **se vean las dos manos completas** (dedos incluidos, sin que una tape a la otra); deja aire arriba de los dedos y haz la imagen a la proporción del panel (~2.1 : 1) para que no se recorte. Ver `senas/taco-foto.jpg`. `empalmar.py --zona` limita las manos transparentes a una zona para que no salgan contornos en la cara.
   - Respaldo: un dibujo SVG (`senas/<palabra>.svg`, ver `senas/estrella.svg`), con manos realistas y la persona con proporciones reales. Úsalo solo si el usuario lo pide.
   - La dirección se describe **como se ve de frente** (la "derecha" es la derecha de la imagen). Verifica siempre con el video.
9. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
10. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo. Tamaño: hoja A4.

## Estructura

```
tarjetas/<palabra>.json   definición: palabra, sílabas, escena, seña y colores del tema
tarjetas/<palabra>.pdf    para imprimir: 1 página A4 (se genera, no se edita a mano)
tarjetas/<palabra>-frente.png   vista previa
escenas/<palabra>-fondo.svg  ilustración de fondo de página completa (opcional, recomendada)
escenas/<palabra>.svg     dibujo del panel de arriba (el panel mide 1160 × 340: usa un viewBox de proporción ~3.4 : 1, ver escenas/estrella.svg)
bocas/<letra>.jpg         foto de la boca por letra (de la guía fónica del usuario)
plantilla/bocas.js        reglas de pronunciación (qué foto va según el sonido) y dibujos de respaldo
senas/<palabra>-foto.jpg  seña LSM: foto real empalmada (inicio nítido y movimiento transparente)
senas/<palabra>.svg       (respaldo) dibujo de la seña
abecedario/<letra>.png    sticker de la mano LSM de cada letra (del usuario)
plantilla/empalmar.py     empalma cuadros de un video en una sola foto
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma la hoja: node generar.js tarjetas/<palabra>.json
```

Ejemplo de JSON: `tarjetas/estrella.json`. Los `colores` que puedes definir son `fondo`, `escena`, `texto`, `acento` y `silabas` (una lista de colores).

## Cómo hacer una tarjeta nueva

1. Si mandan una imagen de tarjeta completa, guárdala como `tarjetas/<palabra>-original.png`. Si mandan un video o fotos de la seña, haz el empalme según la regla 8. Se pueden guardar en el repositorio el empalme y las fotos de la persona que hace la seña (el usuario lo autorizó). No guardes videos completos.
2. Elige el gusto de Valeria que mejor encaje con la palabra y dibuja `escenas/<palabra>.svg`. Usa `escenas/estrella.svg` como ejemplo de estilo.
3. Elige colores vivos que vayan con el tema y crea `tarjetas/<palabra>.json`.
4. Ejecuta `node generar.js tarjetas/<palabra>.json` y **mira el PNG** antes de entregarlo.
5. Agrega la palabra a la tabla del `README.md`. Haz commit y push a `main`, y muestra la tarjeta al usuario.
6. Si piden un cambio de diseño **para todas** las tarjetas, actualiza estas reglas y `generar.js`, y vuelve a generar todas las tarjetas.

Habla siempre en español con el usuario.
