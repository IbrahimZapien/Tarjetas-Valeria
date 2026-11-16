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

## Diseño actual (versión 2): dos caras por palabra

`node generar.js tarjetas/<palabra>.json` crea **`tarjetas/<palabra>.pdf`** (2 páginas **A4**, frente y reverso, listo para imprimir) y las vistas previas `tarjetas/<palabra>-frente.png` y `-reverso.png` (1240 × 1754 px = A4 a 150 ppp). Usa bien la hoja: márgenes chicos (≈7 mm) y elementos grandes.

- **Frente, para aprender:** escena (squishy, en su mundo) → palabra grande → letras **numeradas en orden** (1, 2, 3…), cada una con su **mano LSM arriba** y su **boca abajo** (cómo se pone la boca para ese sonido), en su ficha de color por sílaba → arco en "U" por sílaba → abajo, la **seña de la palabra** (foto empalmada) a todo lo ancho.
- **Reverso, para practicar** (siempre los mismos 4 pasos, en el mismo orden, porque su memoria y la rutina le ayudan):
  1. **traza**: la palabra punteada sobre renglones de cuaderno.
  2. **ordena**: casillas vacías y las letras revueltas (se pueden recortar o señalar).
  3. **completa**: la palabra con dos letras faltantes.
  4. **muévete**: un salto de tijera por sílaba, diciendo o señando cada una.
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
3. **Colores alegres y vivos, distintos para cada palabra según su tema.** Cada tarjeta define sus `colores` en el JSON. Por ejemplo:
   - Estrella: azul rey brillante con cielo celeste.
   - Ramen: rojo picante y naranja.
   - Alberca: turquesa y aqua.
   - Carro: naranja y amarillo veloz.
   - Slime: verde lima y morado.

   El fondo debe ser vivo, pero con buen contraste para que la palabra blanca se lea perfecto.
4. **Un solo foco en la escena.** El objeto es grande y simpático, con pocos adornos (2 o 3 destellos como máximo). Lo que hay alrededor apoya, no compite.
   - **Estilo squishy / slime para el objeto principal** (a Valeria le encantan las cosas suaves): formas gorditas con las puntas redondeadas, un poco aplastadas como si se hundieran por su peso, un degradado brillante tipo gel, brillos blancos grandes, una sombra suave debajo, alguna gotita de slime y líneas de "squish" a los lados. Carita kawaii con ojos grandes y brillantes. Ejemplo: la estrella de `escenas/estrella.svg`.
5. **La palabra** va en minúsculas, en letra redonda (Fredoka), blanca y muy grande.
6. **Fichas por letra, agrupadas por sílaba**, tipo squishy: redondas, con brillo arriba y sombra abajo. Cada sílaba tiene su color y hay más espacio entre sílabas. **Debajo de cada sílaba va un arco en forma de "U"** (como un puente invertido), que empieza en una monedita y termina en una flecha. Se recorre con el dedo **de izquierda a derecha** mientras se pronuncia la sílaba, para ensayar cómo suena. Separa las sílabas correctamente en español.
7. **Orden de las letras**: de izquierda a derecha, cada letra con su mano LSM arriba (sin números). **No pongas paneles de conteo ni ejercicios de números**: el usuario quiere trabajar los números aparte.
8. **Panel "seña"**: abajo, a todo lo ancho. **No inventes la forma de una seña.** Si no hay referencia, deja `"sena"` fuera del JSON y aparece "seña pendiente".
   - **Preferido: foto real empalmada** (así lo pidió el usuario). Pide un **video corto** de la seña y ejecuta `python3 plantilla/empalmar.py VIDEO senas/<palabra>-foto.jpg --cuadros 1,a,b,c,d --recorte x0,y0,x1,y1`. El primer cuadro (el inicio) queda **nítido**; los siguientes se enciman con **transparencia progresiva** (cada vez más transparentes) para mostrar el recorrido. Elige los cuadros revisando una hoja de contactos del video (ffmpeg). Recorta horizontal (más o menos 2 de ancho por 1 de alto), dejando ver todo el recorrido de las manos. Las fotos llenan el panel completo.
   - Si solo hay fotos sueltas, empálmalas igual (el inicio nítido y las demás transparentes) o pregunta.
   - Respaldo: un dibujo SVG (`senas/<palabra>.svg`, ver `senas/estrella.svg`), con manos realistas y la persona con proporciones reales. Úsalo solo si el usuario lo pide.
   - La dirección se describe **como se ve de frente** (la "derecha" es la derecha de la imagen). Verifica siempre con el video.
9. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
10. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo. Tamaño: hoja A4.

## Estructura

```
tarjetas/<palabra>.json   definición: palabra, sílabas, escena, seña y colores del tema
tarjetas/<palabra>.pdf    para imprimir: 2 páginas A4 (se genera, no se edita a mano)
tarjetas/<palabra>-frente.png / -reverso.png   vistas previas
escenas/<palabra>.svg     dibujo del panel de arriba (el panel mide 1160 × 340: usa un viewBox de proporción ~3.4 : 1, ver escenas/estrella.svg)
bocas/<letra>.jpg         foto de la boca por letra (de la guía fónica del usuario)
plantilla/bocas.js        reglas de pronunciación (qué foto va según el sonido) y dibujos de respaldo
senas/<palabra>-foto.jpg  seña LSM: foto real empalmada (inicio nítido y movimiento transparente)
senas/<palabra>.svg       (respaldo) dibujo de la seña
abecedario/<letra>.png    sticker de la mano LSM de cada letra (del usuario)
plantilla/empalmar.py     empalma cuadros de un video en una sola foto
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma las dos caras: node generar.js tarjetas/<palabra>.json
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
