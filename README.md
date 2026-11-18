# Tarjetas de Valeria

Tarjetas para que Valeria aprenda a reconocer letras, sílabas y palabras escritas (con las manos LSM de cada letra como apoyo, y la palabra en inglés), diseñadas según los gustos de Valeria
(juegos de pelota y monedas, slime, ramen y comida coreana, carritos veloces pero tiernos, cocinar, nadar, hoteles).

📚 **Todas las tarjetas juntas en un solo PDF:** [tarjetas/TODAS-LAS-TARJETAS.pdf](tarjetas/TODAS-LAS-TARJETAS.pdf)

| Palabra | Tarjeta |
|---|---|
| estrella | [PDF tamaño carta](tarjetas/estrella.pdf) |
| taco | [PDF tamaño carta](tarjetas/taco.pdf) |

## Diseño base

![Diseño base](plantilla/base/diseno-base.png)

La tarjeta de "estrella" es el diseño base aprobado (commit `41fe6a8`). Todas las tarjetas nuevas siguen este formato: una hoja tamaño carta con escena, mano LSM, boca y letra por columna, arcos por sílaba y la palabra en inglés.

## Pedir una tarjeta nueva

Abre una sesión de Claude Code con este repositorio y escribe, por ejemplo:

> Hazme la tarjeta de **ramen**. (Si quieres, dime también la palabra en inglés.)

Claude sigue las reglas de `CLAUDE.md`. Resultado: `tarjetas/<palabra>.pdf`, listo para imprimir en tamaño carta. Para generar una tarjeta a mano: `node generar.js tarjetas/<palabra>.json`
(necesita Node y Playwright).
