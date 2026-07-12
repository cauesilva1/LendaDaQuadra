# Lenda da Quadra

[Português](README.md) · [English](README.en.md) · **Español**

Simulador de carrera de baloncesto en el navegador. Robas atributos de leyendas NBA, defines identidad (apodo / firma), juegas momentos en cancha y luchas por Euro y NBA.

**Jugar:** [/play](https://github.com/cauesilva1/LendaDaQuadra) · idiomas: PT / EN / ES

---

## Flujo

1. **Setup** — nombre, país, posición, modo y **seed** opcional (misma seed = misma carrera para stream/amigos)
2. **How-to** — lo que importa en la carrera
3. **Draft** — robas el techo de atributos de las leyendas
4. **Identidad** — apodo, jugada firma, drip, estilo de coach
5. **Temporada** — 1 partido completo (**tú mandas el 2º tiempo**) + crunch + dilema + sim
6. **Hub** — museo, línea de tiempo, 3x3, All-Star, contrato, reto diario, **simular carrera entera**
7. **Selección** — Mundial / JJOO con llave visual y minutos por OVR

Empiezas con **16 años en 2016**. Save: `lenda-da-quadra-v9` (recomienda **nueva carrera** si vienes de un save viejo).

---

## Stack

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** · **Framer Motion** · **Lucide**
- Persistencia en `localStorage`

---

## Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Carrera: `/play` (o `/en/play`, `/es`).

```bash
npm run build
npm start
npx tsx scripts/smoke-stability.ts
```

---

## Estructura

| Área | Dónde |
|------|--------|
| UI | `src/components/play/` |
| Estado | `src/hooks/useGameSimulation.tsx` |
| Temporada / partidos | `src/lib/seasonFlow.ts`, `fullGame.ts`, `keyGames.ts` |
| Selección | `src/lib/nationalGames.ts`, `calendar.ts` |
| Identidad | `src/lib/careerFlavor.ts` |
| i18n | `src/lib/i18n/dictionary.ts` |

---

## Licencia

Uso personal / portafolio — consulta el repositorio.
