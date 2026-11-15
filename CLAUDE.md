# Tarjetas de Valeria: instrucciones para Claude

Este repositorio guarda tarjetas para enseñarle palabras y su seña en **LSM** (Lengua de Señas Mexicana) a Valeria.
Cada tarjeta muestra **la palabra como protagonista**, la palabra separada en fichas por sílaba y el dibujo de la seña.

## Quién es Valeria (léelo antes de diseñar)

- Tiene 11 años y autismo. No habla, pero lo intenta. Escucha y se comunica en LSM.
- Es inteligente. Su atención es muy breve y solo se concentra en lo que le interesa.
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

1. **Un solo foco.** El dibujo de la palabra es grande y está al centro. Hay pocos adornos (2 o 3 destellos como máximo). Nada de fondos saturados que compitan con la palabra.
2. **Engancharla con sus gustos.** La escena de arriba pone la palabra dentro de algo que le interesa. Ejemplos:
   - Una pelota rodando por un puente con monedas hacia la meta (el estilo de sus juegos).
   - Una alberca o un hotel.
   - Un tazón de ramen o una cocina con mezclas.
   - Texturas de slime o squishy.
   - Comida coreana con carita: un kimbap, un tteokbokki o un tazón de ramyeon.
   - Un carrito tierno y veloz, con líneas de velocidad, que llega a la palabra.

   Elige el gusto que mejor encaje con la palabra.
3. **Nada de personajes con derechos de autor** (Pepa Pig, Roblox, logos de TikTok, etc.). Usa solo su *estilo*: personajes redondos y simpáticos, colores alegres, bloques o elementos de juego.
4. **La palabra manda.** Va en minúsculas, en letra redonda (Fredoka), blanca y muy grande. Debajo van las fichas de letras de colores pastel. **Cada sílaba tiene un color** (rosa, menta, amarillo, azul) y hay más espacio entre sílabas. Las fichas parecen "squishies": redondas, con brillo arriba y sombra abajo.
5. **La seña LSM** va en un panel blanco con la etiqueta "LSM". Si la mamá o el papá mandan un dibujo de la seña, se usa ese. **No inventes la forma de una seña.** Si no hay dibujo, pídelo o deja el panel con un aviso de "seña pendiente".
6. Mantén la identidad: fondo morado `#6C2BD9`, panel de escena turquesa `#16B4CE`, texto oscuro `#2B1B5C`, monedas amarillas `#FFD43B`, acento rosa `#FF5DA2`. Tamaño 1200 × 1680 px.
7. Caras siempre sonrientes y amables, y ojos con brillo. Nada que asuste o sea agresivo.

## Estructura

```
tarjetas/<palabra>.json   definición de la tarjeta (palabra, sílabas, escena, seña)
tarjetas/<palabra>.png    tarjeta terminada (se genera, no se edita a mano)
escenas/<palabra>.svg     dibujo del panel de arriba, 1056 × 428
senas/<palabra>.png       dibujo de la seña LSM (proporción aprox. 576 × 372)
plantilla/fuentes/        fuente Fredoka (no requiere internet)
generar.js                arma la tarjeta: node generar.js tarjetas/<palabra>.json
```

## Cómo hacer una tarjeta nueva

1. Si mandan una imagen de tarjeta completa, guárdala como `tarjetas/<palabra>-original.png` y recorta la seña a `senas/<palabra>.png` (con PIL). Si mandan solo la seña, guárdala directamente en `senas/`.
2. Dibuja `escenas/<palabra>.svg` siguiendo las reglas de arriba. Usa `escenas/estrella.svg` como ejemplo de estilo.
3. Crea `tarjetas/<palabra>.json` con la separación en sílabas correcta en español.
4. Ejecuta `node generar.js tarjetas/<palabra>.json` y **mira el PNG** antes de entregarlo.
5. Haz commit y push, y muestra la tarjeta al usuario.

Habla siempre en español con el usuario.
