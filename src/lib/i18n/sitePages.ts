import type { Locale } from "@/types/game";

type PageBlock = { title: string; body: string[] };

const SOBRE: Record<Locale, PageBlock> = {
  pt: {
    title: "Sobre",
    body: [
      "Lenda da Quadra é um simulador de carreira de basquete: você nasce prospecto, rouba atributos no draft, cresce em ligas domésticas/Euro e mira a NBA — até virar lenda ou só mais um nome na súmula.",
      "O jogo mistura decisões de offseason, jogos-chave (crunch e partida completa), convocações de seleção e um card final com o seu legado.",
      "Projeto de fã. Nomes de clubes e lendas existem só para identificação; estatísticas e resultados são simulados. Sem afiliação com NBA, FIBA ou federações.",
    ],
  },
  en: {
    title: "About",
    body: [
      "Court Legend is a basketball career simulator: start as a prospect, steal attributes in the draft, grow through domestic/Euro leagues, and chase the NBA — until you become a legend or just another box-score name.",
      "It mixes offseason choices, key games (crunch and full game), national-team call-ups, and a final legacy card.",
      "Fan project. Club and legend names are for identification only; stats and outcomes are simulated. No affiliation with NBA, FIBA, or federations.",
    ],
  },
  es: {
    title: "Sobre",
    body: [
      "Lenda da Quadra es un simulador de carrera de básquet: nacés prospecto, robás atributos en el draft, crecés en ligas domésticas/Euro y apuntás a la NBA — hasta volverte leyenda o solo un nombre en la planilla.",
      "Mezcla decisiones de offseason, partidos clave (crunch y partido completo), convocatorias de selección y una carta final de legado.",
      "Proyecto de fan. Nombres de clubes y leyendas solo para identificación; estadísticas y resultados son simulados. Sin afiliación con NBA, FIBA o federaciones.",
    ],
  },
};

const DOCS: Record<
  Locale,
  { title: string; sections: { h: string; p: string[] }[] }
> = {
  pt: {
    title: "Como o jogo funciona",
    sections: [
      {
        h: "Setup e draft",
        p: [
          "Escolha nome, país e posição. No draft você monta o potencial (max stats) — cada pick conta.",
          "Opcional: seed no setup compartilha a mesma carreira com amigos/stream.",
        ],
      },
      {
        h: "Identidade e jornada",
        p: [
          "Depois do reveal, define apelido, assinatura e estilo. A assinatura dá bônus real no jogo completo quando a jogada bate.",
          "A jornada mostra clube inicial e o caminho até a aposentadoria.",
        ],
      },
      {
        h: "Temporada",
        p: [
          "Fila típica: 1 jogo completo (você comanda o 2º tempo) + crunch games + dilema + simulação do restante.",
          "OVR e forma do time influenciam ranking, All-Star, MVP e chance de finais.",
          "Nas finais você assiste o crunch ou pula (RNG com sua win chance).",
        ],
      },
      {
        h: "Seleção e hub",
        p: [
          "Copa/Olimpíadas: aceitar abre chave com jogos reais e minutos por OVR/papel.",
          "No fim da temporada o hub abre museu, linha do tempo, 3x3, contrato, desafio diário e simular carreira inteira.",
        ],
      },
      {
        h: "Legado",
        p: [
          "Ao aposentar, o card final classifica a carreira: titular sólido, all-star, debate GOAT… e GOAT (OVR 99).",
          "Baixe a imagem do card para compartilhar.",
        ],
      },
    ],
  },
  en: {
    title: "How the game works",
    sections: [
      {
        h: "Setup and draft",
        p: [
          "Pick name, country, and position. In the draft you build potential (max stats) — every pick matters.",
          "Optional setup seed shares the same career with friends/stream.",
        ],
      },
      {
        h: "Identity and journey",
        p: [
          "After the reveal, set nickname, signature, and style. Signature boosts matching plays in the full game.",
          "Journey shows your starting club and the road to retirement.",
        ],
      },
      {
        h: "Season",
        p: [
          "Typical queue: 1 full game (you run the 2nd half) + crunch games + dilemma + sim the rest.",
          "OVR and team form drive standings, All-Star, MVP, and finals odds.",
          "In finals you play crunch or skip (RNG with your win chance).",
        ],
      },
      {
        h: "National team and hub",
        p: [
          "World Cup/Olympics: accept opens a real bracket with minutes by OVR/role.",
          "After the season the hub opens museum, timeline, 3x3, contract, daily challenge, and simulate full career.",
        ],
      },
      {
        h: "Legacy",
        p: [
          "At retirement, the final card ranks you: solid starter, all-star, GOAT debate… and GOAT (OVR 99).",
          "Download the card image to share.",
        ],
      },
    ],
  },
  es: {
    title: "Cómo funciona el juego",
    sections: [
      {
        h: "Setup y draft",
        p: [
          "Elige nombre, país y posición. En el draft armas el potencial (max stats) — cada pick cuenta.",
          "Seed opcional en setup comparte la misma carrera con amigos/stream.",
        ],
      },
      {
        h: "Identidad y viaje",
        p: [
          "Tras el reveal, defines apodo, firma y estilo. La firma buffea jugadas que coinciden en el partido completo.",
          "El viaje muestra el club inicial y el camino hasta el retiro.",
        ],
      },
      {
        h: "Temporada",
        p: [
          "Cola típica: 1 partido completo (tú mandas el 2º tiempo) + crunch + dilema + simulación del resto.",
          "OVR y forma del equipo afectan tabla, All-Star, MVP y chances de finales.",
          "En finales ves el crunch o saltas (RNG con tu win chance).",
        ],
      },
      {
        h: "Selección y hub",
        p: [
          "Mundial/JJOO: aceptar abre llave real con minutos por OVR/rol.",
          "Al fin de temporada el hub abre museo, timeline, 3x3, contrato, reto diario y simular carrera entera.",
        ],
      },
      {
        h: "Legado",
        p: [
          "Al retirarte, la carta final te clasifica: titular sólido, all-star, debate GOAT… y GOAT (OVR 99).",
          "Descarga la imagen de la carta para compartir.",
        ],
      },
    ],
  },
};

const PRIVACY: Record<Locale, PageBlock> = {
  pt: {
    title: "Privacidade",
    body: [
      "O progresso da carreira fica salvo no navegador (localStorage). Não pedimos conta e não enviamos seus saves para um servidor nosso.",
      "Se usar o formulário de contato/bug, o e-mail abre no seu cliente de e-mail — a mensagem vai direto para nós, sem passar por um backend do jogo.",
      "Não usamos cookies de rastreamento de anúncios. Idioma e preferências locais ficam no dispositivo.",
    ],
  },
  en: {
    title: "Privacy",
    body: [
      "Career progress is stored in your browser (localStorage). No account required, and we don’t upload your saves to our servers.",
      "If you use the contact/bug form, it opens your email client — the message goes straight to us, not through a game backend.",
      "We don’t use ad-tracking cookies. Locale preferences stay on your device.",
    ],
  },
  es: {
    title: "Privacidad",
    body: [
      "El progreso de la carrera se guarda en el navegador (localStorage). No pedimos cuenta y no subimos tus saves a un servidor nuestro.",
      "Si usas el formulario de contacto/bug, se abre tu cliente de correo — el mensaje va directo a nosotros, sin backend del juego.",
      "No usamos cookies de anuncios. El idioma y preferencias locales quedan en tu dispositivo.",
    ],
  },
};

const CONTACT: Record<
  Locale,
  {
    title: string;
    intro: string;
    emailLabel: string;
    bugTitle: string;
    bugBody: string;
    bugPlaceholder: string;
    bugCta: string;
    mailSubjectBug: string;
    mailSubjectContact: string;
  }
> = {
  pt: {
    title: "Contato",
    intro:
      "Dúvidas, ideias ou parceria? Fala com a gente. Bugs têm um card próprio abaixo — quanto mais detalhe, melhor.",
    emailLabel: "E-mail",
    bugTitle: "Reportar bug",
    bugBody:
      "Descreva o que aconteceu, em que tela estava e se consegue reproduzir. Inclua o navegador se souber.",
    bugPlaceholder: "Ex.: cliquei em Jogar crunch e a tela ficou vazia…",
    bugCta: "Abrir e-mail do bug",
    mailSubjectBug: "[Lenda da Quadra] Bug report",
    mailSubjectContact: "[Lenda da Quadra] Contato",
  },
  en: {
    title: "Contact",
    intro:
      "Questions, ideas, or partnership? Reach out. Bugs have their own card below — more detail is better.",
    emailLabel: "Email",
    bugTitle: "Report a bug",
    bugBody:
      "Describe what happened, which screen you were on, and if you can reproduce it. Include the browser if you know it.",
    bugPlaceholder: "e.g. I clicked Play crunch and the screen went blank…",
    bugCta: "Open bug email",
    mailSubjectBug: "[Court Legend] Bug report",
    mailSubjectContact: "[Court Legend] Contact",
  },
  es: {
    title: "Contacto",
    intro:
      "¿Dudas, ideas o partnership? Escríbenos. Los bugs tienen su propia tarjeta abajo — cuanto más detalle, mejor.",
    emailLabel: "Email",
    bugTitle: "Reportar bug",
    bugBody:
      "Describe qué pasó, en qué pantalla estabas y si se puede reproducir. Incluye el navegador si lo sabes.",
    bugPlaceholder: "Ej.: clic en Jugar crunch y la pantalla quedó vacía…",
    bugCta: "Abrir email del bug",
    mailSubjectBug: "[Lenda da Quadra] Bug report",
    mailSubjectContact: "[Lenda da Quadra] Contacto",
  },
};

export const CONTACT_EMAIL = "hello@lendadquadra.com";

export function getSobre(locale: Locale) {
  return SOBRE[locale];
}
export function getDocs(locale: Locale) {
  return DOCS[locale];
}
export function getPrivacy(locale: Locale) {
  return PRIVACY[locale];
}
export function getContact(locale: Locale) {
  return CONTACT[locale];
}
