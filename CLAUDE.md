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

## Diseño actual: una hoja tamaño CARTA por palabra (vertical u horizontal según la palabra)

`node generar.js datos/<palabra>.json` crea **`tarjetas/<palabra>.pdf`** (una página **tamaño carta**, lista para imprimir) y la vista previa `datos/vistas/<palabra>.png` (150 ppp). **Orientación por palabra**: hasta 5 letras → vertical (1275 × 1650); 6 o más → horizontal (1650 × 1275). Se puede forzar con `"orientacion": "vertical"|"horizontal"` en el JSON; elige la que aproveche mejor la hoja.. Usa bien la hoja: márgenes chicos (≈7 mm) y elementos grandes.

- **La hoja (enfoque en el CÓDIGO ESCRITO, pedido del usuario):** arriba, lado a lado, la **escena** (izquierda) y el panel **"inglés"** (derecha): la **palabra en inglés** (campo `"ingles"` del JSON), grande, en Fredoka y con los colores de las letras de la tarjeta, para que Valeria la vaya reconociendo también en inglés, con una **bandera de EUA en miniatura** arriba a la derecha del panel. **Ya no hay foto de la seña** (el usuario la quitó: Valeria ya sabe sus señas; las manos LSM de cada letra se quedan). Abajo, a todo lo ancho, el bloque de letras: en cada columna **mano LSM** (chica, apoyo) → **boca** (recuadro GRANDE, casi del alto de media ficha) → **letra sólida en ficha GRANDE**, de un **color que juegue con la palabra** (no necesariamente negro) con una **línea punteada delgada de otro color (blanca) por EN MEDIO del trazo**, como si se escribiera con pluma, para repasarla con el dedo. Los puntos salen de `plantilla/trazos.json` (esqueleto de cada letra de Fredoka, calculado con `python3 plantilla/trazos.py`; color en `colores.pluma`) → arco en "U" por sílaba. **No hay renglón "escribe" aparte** (el usuario lo quitó).
- Las escenas (`escenas/<palabra>.svg`) deben llenar un recuadro de proporción ~2.2 : 1: ajusta el `viewBox` al contenido.
- **Sin la palabra grande en blanco:** el usuario la quitó porque la palabra ya está en las fichas y en las manos LSM. No la vuelvas a poner.
- **Sin reverso:** al usuario no le gustó el reverso de práctica (traza, ordena, completa, muévete) y pidió quitarlo. No lo vuelvas a hacer a menos que lo pida.
- **Bocas debajo de cada letra**: **fotos reales** de la boca en `bocas/<letra>.jpg`, recortadas de la "Guía del alfabeto fónico" que mandó el usuario. La foto se elige por **cómo suena** la letra en español de México (`plantilla/bocas.js`, `sonido()` y `FOTO_DE_SONIDO`): v→b, ll e y+vocal→y, c→k (ca, co, cu) o s (ce, ci), g→j (ge, gi), z/x→s, rr y r inicial→r con pista de vibración. Sin foto: **ch** (dibujo) y las **mudas** (h; u de que/qui/gue/gui) con símbolo de "no suena". Los dígrafos llevan una sola boca. La guía tiene descripciones que no corresponden al español (v "muerde el labio", h "soplando", n "cierra los labios"): por eso se usa el sonido. Sugiere validar con su terapeuta de lenguaje.
- **Manos LSM (dactilología) encima de cada letra**: un sticker en miniatura por letra, tomado de `abecedario/<letra>.png` (los stickers los manda el usuario; **no inventes configuraciones**). `generar.js` avisa qué stickers faltan.
  - Cada sticker va en un **círculo blanco** encima de su letra. **Dígrafos (ll, rr, ch)**: una sola **cápsula blanca** abarca las dos letras (son una sola letra, un solo sonido); dentro van la mano de la primera letra, copias de la mano **en escala de grises** cada vez más tenues (el movimiento) y la mano de la segunda letra.
  - Los stickers son los **originales del paquete de WhatsApp** del usuario (27 letras, a–z con ñ; transparentes, 512 px), exportados con "Exportar chat → Adjuntar archivos". La ll se forma con dos l. Si mandan otro paquete así: descomprime el .zip, ordena los .webp por nombre, recorta al contenido y guarda en `abecedario/<letra>.png`. `plantilla/recortar_abecedario.py` queda como respaldo para recortar desde una imagen con fondo liso. Revisa siempre los stickers sobre fondo de color.

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
   - `fondoImagen` (preferido): una **ilustración de página completa** que lleve a Valeria al mundo de la palabra, en `escenas/<palabra>-fondo.svg` (1240 × 1754). Ej. estrella: **cielo estrellado de fantasía** con nebulosas de colores, cientos de estrellitas, destellos, estrella fugaz, un planeta tierno con anillo y una luna con carita junto a la palabra. Otras ideas: fondo del mar o alberca con burbujas y pececitos (agua), cocina con vapor y especias (ramen), mesa con mantel de cuadros y albahaca (pizza), ciudad con caminos y carritos (carro), un mundo de slime que escurre. Los detalles con carita van en espacios libres (la franja entre la escena y las manos), nunca debajo de los paneles, de las manos ni de los arcos. En vertical casi no hay espacio a los lados de las fichas: no pongas personajes ahí; basta con los de la escena.
   - **Todo el fondo y los adornos son del tema de la palabra, nada de otras tarjetas**: las estrellitas y destellos eran de "estrella"; en "taco" los adornos son tacos, chiles, limones, aguacates, cilantro, cebolla y papel picado (ver `escenas/taco-fondo.svg`: patrón tenue de íconos del tema + personajes con carita en los espacios libres a los lados de las fichas cuando la palabra es corta). Revisa que la escena tampoco tenga destellos de otro tema.
   - `fondo`: **degradado** de respaldo (lista de colores) por si no hay ilustración.
   - `escena`: degradado pastel (cielo de algodón de azúcar, agua, etc.).
   - `silabas`: cada sílaba como `[claro, fuerte]`: ficha tipo **gelatina** con degradado; el color fuerte también es el **anillo** de su mano y su boca.
   - `patron`: `destellos`, `burbujas` o `corazones` suaves en el fondo, con `patronColores`.
   - `sombraPalabra`: color de la sombra de la palabra blanca.
   - `letras`: **color de las letras por sílaba** (lista), elegido según la palabra, el objeto o el diseño, y siempre con buen contraste sobre su ficha (más oscuro que la ficha) y con la línea punteada blanca. Ej.: taco → rojo salsa ("ta") y verde cilantro ("co"); estrella → naranja dorado, magenta y verde azulado (un tono fuerte del color de cada ficha). Si no se define, se usa `texto`.
   Ideas por tema: ramen → rojo picante/naranja/amarillo con burbujas; alberca → turquesa/aqua/azul con burbujas; slime → verde lima/morado neón; pizza → rojo tomate/amarillo queso/verde albahaca; paquete → kraft/rosa/celeste; carro → naranja/amarillo/rojo veloz. Siempre con buen contraste para leer la palabra.

4. **Un solo foco en la escena.** El objeto es grande y simpático, con pocos adornos (2 o 3 destellos como máximo). Lo que hay alrededor apoya, no compite.
   - **Forma reconocible primero**: si el objeto tiene un emoji, usa su silueta como referencia (render del emoji con la fuente Noto Color Emoji vía Playwright y compáralo lado a lado). Ej.: el taco (🌮) y el chile (🌶️) se dibujaron copiando la forma de su emoji. Usa la misma forma en la escena y en el fondo (que no quede una versión vieja en el patrón).
   - **Estilo squishy / slime para el objeto principal** (a Valeria le encantan las cosas suaves): formas gorditas con las puntas redondeadas, un poco aplastadas como si se hundieran por su peso, un degradado brillante tipo gel, brillos blancos grandes, una sombra suave debajo, alguna gotita de slime y líneas de "squish" a los lados. Carita kawaii con ojos grandes y brillantes. Ejemplo: la estrella de `escenas/estrella.svg`.
5. **La palabra** va en minúsculas, en letra redonda (Fredoka), blanca y muy grande.
6. **Fichas por letra, agrupadas por sílaba**, tipo squishy: redondas, con brillo arriba y sombra abajo. Cada sílaba tiene su color y hay más espacio entre sílabas. **Debajo de cada sílaba va un arco en forma de "U"** (como un puente invertido), que empieza en una monedita y termina en una flecha. Se recorre con el dedo **de izquierda a derecha** mientras se pronuncia la sílaba, para ensayar cómo suena. Separa las sílabas correctamente en español.
7. **Orden de las letras**: de izquierda a derecha, cada letra con su mano LSM arriba (sin números). **No pongas paneles de conteo ni ejercicios de números**: el usuario quiere trabajar los números aparte.
8. **Panel "inglés"** (antes era el de la seña): arriba a la derecha, junto a la escena, la palabra en inglés. Si el usuario no la da, usa la traducción más común y sencilla (sustantivo en singular) y díselo; si la palabra es igual en inglés (p. ej. "taco"), avísale. Si falta, aparece "inglés pendiente".
   - **Ya no se pide video de la seña ni se pone foto.** `plantilla/empalmar.py` y `senas/` quedan solo por si el usuario quiere volver a mostrar la seña.

9. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
10. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo. Tamaño: hoja carta (vertical u horizontal según la palabra).

## Estructura

```
tarjetas/                 SOLO lo aprobado: <palabra>.pdf (A4) y TODAS-LAS-TARJETAS.pdf. Nada más (pedido del usuario: sin desorden)
datos/<palabra>.json      definición: palabra, sílabas, escena, seña y colores del tema
datos/vistas/<palabra>.png   vista previa (para revisar)
escenas/<palabra>-fondo.svg  ilustración de fondo de página completa (opcional, recomendada)
escenas/<palabra>.svg     dibujo del panel de arriba (el panel mide 1160 × 340: usa un viewBox de proporción ~3.4 : 1, ver escenas/estrella.svg)
bocas/<letra>.jpg         foto de la boca por letra (de la guía fónica del usuario)
plantilla/trazos.py/.json línea central punteada de cada letra (para repasar con el dedo)
plantilla/bocas.js        reglas de pronunciación (qué foto va según el sonido) y dibujos de respaldo
senas/<palabra>-foto.jpg  seña LSM: foto real empalmada (inicio nítido y movimiento transparente)
abecedario/<letra>.png    sticker de la mano LSM de cada letra (del usuario)
plantilla/empalmar.py     empalma cuadros de un video en una sola foto
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma la hoja: node generar.js tarjetas/<palabra>.json
```

Ejemplo de JSON: `datos/estrella.json`. Los `colores` que puedes definir son `fondo`, `escena`, `texto`, `acento` y `silabas` (una lista de colores).

## Cómo hacer una tarjeta nueva

1. Pon la palabra en inglés en el JSON (`"ingles"`).
2. Elige el gusto de Valeria que mejor encaje con la palabra y dibuja `escenas/<palabra>.svg`. Usa `escenas/estrella.svg` como ejemplo de estilo.
3. Elige colores vivos que vayan con el tema y crea `datos/<palabra>.json`.
4. Ejecuta `node generar.js datos/<palabra>.json` y **mira el PNG** (`datos/vistas/`) antes de entregarlo. Mientras el usuario no la apruebe, puedes regenerarla; en `tarjetas/` solo debe quedar la versión final. No guardes versiones viejas, borradores ni originales en `tarjetas/`.
5. Agrega la palabra a la tabla del `README.md` (el PDF `tarjetas/TODAS-LAS-TARJETAS.pdf` se actualiza solo). Haz commit y push a `main`, y muestra la tarjeta al usuario.
6. Si piden un cambio de diseño **para todas** las tarjetas, actualiza estas reglas y `generar.js`, y vuelve a generar todas las tarjetas.

Habla siempre en español con el usuario.
