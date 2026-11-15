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
5. **La palabra** va en minúsculas, en letra redonda (Fredoka), blanca y muy grande.
6. **Fichas por sílaba**, tipo squishy: redondas, con brillo arriba y sombra abajo. Cada sílaba tiene su color y hay más espacio entre sílabas. **Debajo de cada sílaba va una moneda**: se toca o se aplaude una vez por sílaba al pronunciarla, como si se juntaran monedas en sus juegos. Separa las sílabas correctamente en español.
7. **Panel "letra"**: la letra inicial en mayúscula y en minúscula, grande, para que reconozca la letra.
8. **Panel "LSM"**: pequeño, abajo a la derecha. **No inventes la forma de una seña**: dibújala solo a partir de las fotos o dibujos que mande el usuario (normalmente una foto por movimiento). Si no hay referencia, deja `"sena"` fuera del JSON y aparece "seña pendiente".
   - Dibújala en SVG como `senas/<palabra>.svg` (viewBox 600 × 540), con el estilo de `senas/estrella.svg`: persona tierna con cabello rizado, ropa lila, cara sonriente y manos color piel con contorno oscuro.
   - Si la seña tiene varios movimientos, usa una sola figura: la posición inicial con manos **punteadas** y el número **1**, la final con manos **sólidas** y el número **2**, y una **flecha rosa** con el recorrido. La mirada y la expresión van como en la foto (en "estrella" mira hacia arriba). Si el recorrido pasa por varios puntos, numera cada posición (1, 2, 3); solo la final va sólida y con brazos.
   - Cuida la configuración: qué dedos van extendidos o doblados, dónde va el pulgar, la altura de las manos (barbilla, frente, arriba de la cabeza) y si las manos se cruzan o se tocan. Muestra el dibujo al usuario y pregúntale si la configuración es correcta, porque él conoce LSM.
9. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
10. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo. Tamaño 1200 × 1680 px.

## Estructura

```
tarjetas/<palabra>.json   definición: palabra, sílabas, escena, seña y colores del tema
tarjetas/<palabra>.png    tarjeta terminada (se genera, no se edita a mano)
escenas/<palabra>.svg     dibujo del panel de arriba, 1056 × 400 (viewBox 1056 × 428 también sirve)
senas/<palabra>.svg       dibujo de la seña LSM (hecho a partir de las fotos del usuario)
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma la tarjeta: node generar.js tarjetas/<palabra>.json
```

Ejemplo de JSON: `tarjetas/estrella.json`. Los `colores` que puedes definir son `fondo`, `escena`, `texto`, `acento` y `silabas` (una lista de colores).

## Cómo hacer una tarjeta nueva

1. Si mandan una imagen de tarjeta completa, guárdala como `tarjetas/<palabra>-original.png`. Si mandan fotos de la seña, dibújala en `senas/<palabra>.svg` según la regla 8. No guardes las fotos de personas en el repositorio.
2. Elige el gusto de Valeria que mejor encaje con la palabra y dibuja `escenas/<palabra>.svg`. Usa `escenas/estrella.svg` como ejemplo de estilo.
3. Elige colores vivos que vayan con el tema y crea `tarjetas/<palabra>.json`.
4. Ejecuta `node generar.js tarjetas/<palabra>.json` y **mira el PNG** antes de entregarlo.
5. Agrega la palabra a la tabla del `README.md`. Haz commit y push a `main`, y muestra la tarjeta al usuario.
6. Si piden un cambio de diseño **para todas** las tarjetas, actualiza estas reglas y `generar.js`, y vuelve a generar todas las tarjetas.

Habla siempre en español con el usuario.
