# Tarjetas de Valeria

Tarjetas para aprender palabras y su seña en LSM, diseñadas según los gustos de Valeria
(juegos de pelota y monedas, slime, ramen, cocinar, nadar, hoteles).

| Palabra | Tarjeta |
|---|---|
| estrella | [tarjetas/estrella.png](tarjetas/estrella.png) |

## Pedir una tarjeta nueva

Abre una sesión de Claude Code con este repositorio y escribe, por ejemplo:

> Hazme la tarjeta de **ramen**. (Adjunta el dibujo o la tarjeta con la seña, si la tienes.)

Claude sigue las reglas de `CLAUDE.md`. Para generar una tarjeta a mano: `node generar.js tarjetas/<palabra>.json`
(necesita Node y Playwright).
