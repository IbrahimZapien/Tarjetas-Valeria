# Tarjetas de Valeria

Tarjetas para que Valeria aprenda a reconocer letras, sílabas y palabras escritas (con la seña LSM como apoyo), diseñadas según los gustos de Valeria
(juegos de pelota y monedas, slime, ramen y comida coreana, carritos veloces pero tiernos, cocinar, nadar, hoteles).

| Palabra | Tarjeta |
|---|---|
| estrella | [PDF A4](tarjetas/estrella.pdf) · [vista previa](tarjetas/estrella-frente.png) |

## Pedir una tarjeta nueva

Abre una sesión de Claude Code con este repositorio y escribe, por ejemplo:

> Hazme la tarjeta de **ramen**. (Adjunta el dibujo o la tarjeta con la seña, si la tienes.)

Claude sigue las reglas de `CLAUDE.md`. Para generar una tarjeta a mano: `node generar.js tarjetas/<palabra>.json`
(necesita Node y Playwright).
