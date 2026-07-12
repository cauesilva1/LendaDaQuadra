# Lenda da Quadra

**Português** · [English](README.en.md) · [Español](README.es.md)

Simulador de carreira de basquete no navegador. Você rouba atributos de lendas da NBA, monta identidade (apelido / assinatura), joga momentos na quadra e luta por Euro e NBA.

**Jogar:** [/play](https://github.com/cauesilva1/LendaDaQuadra) · idiomas: PT / EN / ES

---

## Fluxo

1. **Setup** — nome, país, posição, modo e **seed** opcional (mesma seed = mesma “vida” pra stream/amigos)
2. **How-to** — o que importa na carreira
3. **Draft** — rouba o teto de atributos das lendas
4. **Identidade** — apelido, jogada assinatura, drip, estilo de coach
5. **Temporada** — 1 jogo completo (você comanda o **2º tempo**) + crunches + dilema + sim
6. **Hub** — museu, linha do tempo, 3x3, All-Star, contrato, desafio diário, **simular carreira inteira**
7. **Seleção** — Copa / Olimpíadas com chave visual e minutos por OVR

Começa com **16 anos em 2016**. Save atual: `lenda-da-quadra-v9` (recomenda **nova carreira** se veio de save antigo).

---

## Stack

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** · **Framer Motion** · **Lucide**
- Persistência em `localStorage`

---

## Rodar local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Carreira: `/play` (ou `/en/play`, `/es`).

```bash
npm run build
npm start
npx tsx scripts/smoke-stability.ts   # smoke hydration + sim carreira
```

---

## Estrutura (resumo)

| Área | Onde |
|------|------|
| UI | `src/components/play/` |
| Estado | `src/hooks/useGameSimulation.tsx` |
| Temporada / jogos | `src/lib/seasonFlow.ts`, `fullGame.ts`, `keyGames.ts` |
| Seleção | `src/lib/nationalGames.ts`, `calendar.ts` |
| Identidade / flavor | `src/lib/careerFlavor.ts` |
| i18n | `src/lib/i18n/dictionary.ts` |

---

## Licença

Uso pessoal / portfólio — veja o repositório para detalhes.
