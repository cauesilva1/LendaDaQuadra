# Lenda da Quadra

[Português](README.md) · **English** · [Español](README.es.md)

Browser basketball career sim. Steal NBA legend attributes, build an identity (nickname / signature move), play on-court moments, and chase Euro + NBA.

**Play:** [/play](https://github.com/cauesilva1/LendaDaQuadra) · locales: PT / EN / ES

---

## Flow

1. **Setup** — name, country, position, mode, optional **seed** (shared seed = shared career for stream/friends)
2. **How-to** — what matters in the career
3. **Draft** — steal your attribute ceiling from legends
4. **Identity** — nickname, signature move, drip, coach style
5. **Season** — 1 full game (**you run the 2nd half**) + crunch games + dilemma + sim
6. **Hub** — museum, timeline, 3x3, All-Star, contract, daily challenge, **simulate entire career**
7. **National team** — World Cup / Olympics with a visual bracket and minutes by OVR

You start at **age 16 in 2016**. Save key: `lenda-da-quadra-v9` (**new career** recommended if migrating from older saves).

---

## Stack

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** · **Framer Motion** · **Lucide**
- Persistence via `localStorage`

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Career: `/play` (or `/en/play`, `/es`).

```bash
npm run build
npm start
npx tsx scripts/smoke-stability.ts
```

---

## Structure

| Area | Where |
|------|--------|
| UI | `src/components/play/` |
| State | `src/hooks/useGameSimulation.tsx` |
| Season / games | `src/lib/seasonFlow.ts`, `fullGame.ts`, `keyGames.ts` |
| National team | `src/lib/nationalGames.ts`, `calendar.ts` |
| Identity | `src/lib/careerFlavor.ts` |
| i18n | `src/lib/i18n/dictionary.ts` |

---

## License

Personal / portfolio use — see the repository for details.
