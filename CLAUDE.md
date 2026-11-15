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
- **Es tierna.** Aunque le gusten la velocidad y los carros, todo debe verse dulce y amable: carritos redondos y sonrientes, con mejillas rosadas. Nada agresivo, de carreras rudas ni de choques.

## Reglas de diseño (aplícalas a TODAS las tarjetas)

1. **Lo escrito es lo principal.** El orden de importancia en la tarjeta es: la palabra escrita > las fichas por sílaba > la letra inicial > la escena > la seña.
2. **Llevar la palabra a su mundo.** La escena de arriba pone el objeto *dentro* de algo que le interesa, no en su lugar de siempre. Por ejemplo, la estrella no está en el cielo: es la meta de un juego de pelota con monedas. Así entiende que la palabra sirve en muchos lugares y mantiene la atención. Otros ejemplos:
   - Una alberca o un hotel.
   - Un tazón de ramen o una cocina con mezclas.
   - Texturas de slime o squishy.
   - Comida coreana con carita: un kimbap, un tteokbokki o un tazón de ramyeon.
   - Un carrito tierno y veloz, con líneas de velocidad, que llega a la palabra.

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
6. **Fichas por sílaba**, tipo squishy: redondas, con brillo arriba y sombra abajo. Cada sílaba tiene su color y hay más espacio entre sílabas. **Debajo de cada sílaba va un arco en forma de "U"** (como un puente invertido), que empieza en una monedita y termina en una flecha. Se recorre con el dedo **de izquierda a derecha** mientras se pronuncia la sílaba, para ensayar cómo suena. Separa las sílabas correctamente en español.
7. **Panel "letra"**: la letra inicial en mayúscula y en minúscula, grande, para que reconozca la letra.
8. **Panel "LSM"**: abajo a la derecha. **No inventes la forma de una seña.** Si no hay referencia, deja `"sena"` fuera del JSON y aparece "seña pendiente".
   - **Preferido: foto real empalmada** (así lo pidió el usuario). Pide un **video corto** de la seña y ejecuta `python3 plantilla/empalmar.py VIDEO senas/<palabra>-foto.jpg --cuadros 1,a,b,c,d --recorte x0,y0,x1,y1`. El primer cuadro (el inicio) queda **nítido**; los siguientes se enciman con **transparencia progresiva** (cada vez más transparentes) para mostrar el recorrido. Elige los cuadros revisando una hoja de contactos del video (ffmpeg). Recorta cerca de la cabeza y las manos, con una proporción de 1 a 1 aproximadamente. Las fotos llenan el panel completo.
   - Si solo hay fotos sueltas, empálmalas igual (el inicio nítido y las demás transparentes) o pregunta.
   - Respaldo: un dibujo SVG (`senas/<palabra>.svg`, ver `senas/estrella.svg`), con manos realistas y la persona con proporciones reales. Úsalo solo si el usuario lo pide.
   - La dirección se describe **como se ve de frente** (la "derecha" es la derecha de la imagen). Verifica siempre con el video.
9. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
10. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo. Tamaño 1200 × 1680 px.

## Estructura

```
tarjetas/<palabra>.json   definición: palabra, sílabas, escena, seña y colores del tema
tarjetas/<palabra>.png    tarjeta terminada (se genera, no se edita a mano)
escenas/<palabra>.svg     dibujo del panel de arriba, 1056 × 400 (viewBox 1056 × 428 también sirve)
senas/<palabra>-foto.jpg  seña LSM: foto real empalmada (inicio nítido y movimiento transparente)
senas/<palabra>.svg       (respaldo) dibujo de la seña
plantilla/empalmar.py     empalma cuadros de un video en una sola foto
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma la tarjeta: node generar.js tarjetas/<palabra>.json
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
