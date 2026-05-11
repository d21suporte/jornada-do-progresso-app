/**
 * Blueprint de ação prática para cada dia da Jornada (2-21).
 * Dia 1 tem experiência própria (Day1Experience).
 *
 * Cada dia define:
 *  - mentor / capítulo / pilar
 *  - frase de impacto
 *  - 2-3 passos concretos que o usuário precisa marcar para concluir
 *  - cta opcional para abrir o lançamento de transação dentro do fluxo
 */
export interface DayStep {
  id: string;
  label: string;
}

export interface DayBlueprint {
  mentor: string;
  chapter: string;
  pillar: string;
  quote: string;
  steps: DayStep[];
  /** Quando presente, mostra um botão para abrir o diálogo de transação. */
  cta?: { label: string; type: "transaction" };
  /** Tipo padrão da transação ao abrir o diálogo via CTA. */
  defaultTxType?: "income" | "expense";
}

export const DAY_BLUEPRINTS: Record<number, DayBlueprint> = {
  // ───────── Cap. 2 — Dave Ramsey ─────────
  2: {
    mentor: "Dave Ramsey",
    chapter: "Cap. 2",
    pillar: "Pilar 1 — Encare a prisão invisível",
    quote: "Você não pode vencer o que se recusa a enxergar.",
    steps: [
      { id: "list", label: "Listei TODAS as minhas dívidas (nome, valor, parcelas, juros)" },
      { id: "order", label: "Ordenei da MENOR para a MAIOR (sem olhar os juros)" },
      { id: "first", label: "Marquei qual será a 1ª dívida que vou eliminar" },
    ],
  },
  3: {
    mentor: "Dave Ramsey",
    chapter: "Cap. 2",
    pillar: "Pilar 2 — Pare de cavar",
    quote: "Não tente correr enquanto ainda está sangrando.",
    steps: [
      { id: "identify", label: "Identifiquei 1 gasto recorrente que posso cortar agora" },
      { id: "redirect", label: "Defini que esse valor vai 100% para a menor dívida" },
      { id: "register", label: "Registrei a saída desse pagamento como transação" },
    ],
    cta: { label: "Lançar pagamento de dívida", type: "transaction" },
    defaultTxType: "expense",
  },
  4: {
    mentor: "Dave Ramsey",
    chapter: "Cap. 2",
    pillar: "Pilar 3 — Bola de neve em movimento",
    quote: "Cada dívida que cai me devolve um pedaço da minha liberdade.",
    steps: [
      { id: "killed", label: "Quitei (ou avancei) na minha menor dívida" },
      { id: "snowball", label: "Somei o valor que pagava nela ao próximo alvo" },
      { id: "celebrate", label: "Comemorei a vitória — sem cair em recompensa cara" },
    ],
  },

  // ───────── Cap. 3 — Tiago Nigro ─────────
  5: {
    mentor: "Tiago Nigro",
    chapter: "Cap. 3",
    pillar: "Pilar 1 — Gaste menos com propósito",
    quote: "Cada gasto é um voto na pessoa que você está se tornando.",
    steps: [
      { id: "top5", label: "Listei meus 5 maiores gastos do mês" },
      { id: "purpose", label: "Marquei quais me APROXIMAM e quais me AFASTAM do meu propósito" },
      { id: "register", label: "Registrei meus gastos atuais como transações" },
    ],
    cta: { label: "Lançar uma saída", type: "transaction" },
    defaultTxType: "expense",
  },
  6: {
    mentor: "Tiago Nigro",
    chapter: "Cap. 3",
    pillar: "Pilar 2 — Pare de aceitar pouco",
    quote: "Sua renda é o teto que você mesmo permitiu até hoje.",
    steps: [
      { id: "map", label: "Mapeei 3 caminhos para aumentar minha renda" },
      { id: "choose", label: "Escolhi 1 para iniciar nesta semana" },
      { id: "register", label: "Quando a 1ª entrada chegar, vou registrá-la aqui" },
    ],
    cta: { label: "Lançar uma entrada", type: "transaction" },
    defaultTxType: "income",
  },
  7: {
    mentor: "Tiago Nigro",
    chapter: "Cap. 3",
    pillar: "Pilar 3 — Investir melhor",
    quote: "Liberdade financeira não vem de glamour, vem de hábito.",
    steps: [
      { id: "percent", label: "Defini o % fixo da minha renda que vira investimento" },
      { id: "auto", label: "Vou separar esse valor ASSIM que a renda entrar" },
      { id: "first", label: "Registrei meu 1º aporte (mesmo que simbólico)" },
    ],
    cta: { label: "Lançar aporte", type: "transaction" },
    defaultTxType: "expense",
  },

  // ───────── Cap. 4 — Bruno Perini ─────────
  8: {
    mentor: "Bruno Perini",
    chapter: "Cap. 4",
    pillar: "Pilar 1 — Controle emocional",
    quote: "O preço da emoção é alto. A calma é desconto.",
    steps: [
      { id: "rule", label: "Defini um valor mínimo a partir do qual vou esperar 24h antes de comprar" },
      { id: "commit", label: "Me comprometi com essa regra por 30 dias" },
    ],
  },
  9: {
    mentor: "Bruno Perini",
    chapter: "Cap. 4",
    pillar: "Pilar 2 — Tempo + Consistência",
    quote: "A riqueza é paciente. Os ansiosos pagam pelos calmos.",
    steps: [
      { id: "ritual", label: "Escolhi 1 hábito financeiro semanal (revisar / aportar / estudar)" },
      { id: "schedule", label: "Marquei dia e horário fixos na minha agenda" },
    ],
  },
  10: {
    mentor: "Bruno Perini",
    chapter: "Cap. 4",
    pillar: "Pilar 3 — Foco no processo",
    quote: "Não importa o que os outros fazem. Importa onde EU quero chegar.",
    steps: [
      { id: "noise", label: "Identifiquei 1 fonte de ruído (perfil, grupo, app) que me empurra para impulsos" },
      { id: "mute", label: "Silenciei / desinstalei / saí dela" },
    ],
  },

  // ───────── Cap. 5 — Pablo Marçal ─────────
  11: {
    mentor: "Pablo Marçal",
    chapter: "Cap. 5",
    pillar: "Pilar 1 — Reconheça seus medos",
    quote: "Você não nasceu para sobreviver. Nasceu para construir.",
    steps: [
      { id: "fears", label: "Escrevi os 3 maiores bloqueios financeiros que carrego" },
      { id: "actions", label: "Defini 1 ação concreta para começar a vencer cada um" },
    ],
  },
  12: {
    mentor: "Pablo Marçal",
    chapter: "Cap. 5",
    pillar: "Pilar 2 — Mentalidade de vencedor",
    quote: "Seu cérebro acredita no que você repete com emoção.",
    steps: [
      { id: "anchor", label: "Criei minha frase-âncora no presente (\"Eu sou alguém que…\")" },
      { id: "morning", label: "Repeti ao ACORDAR" },
      { id: "night", label: "Repeti antes de DORMIR" },
    ],
  },
  13: {
    mentor: "Pablo Marçal",
    chapter: "Cap. 5",
    pillar: "Pilar 3 — Aja com ousadia",
    quote: "Movimento gera clareza. Estagnação gera dúvida.",
    steps: [
      { id: "pending", label: "Listei 1 decisão financeira que eu vinha adiando" },
      { id: "done", label: "Executei essa ação HOJE — mesmo com dúvida" },
    ],
  },

  // ───────── Cap. 6 — Robert Kiyosaki ─────────
  14: {
    mentor: "Robert Kiyosaki",
    chapter: "Cap. 6",
    pillar: "Pilar 1 — Ativos vs Passivos",
    quote: "ATIVO coloca dinheiro no seu bolso. PASSIVO tira.",
    steps: [
      { id: "list", label: "Listei tudo o que tenho hoje (bens, contas, aplicações)" },
      { id: "classify", label: "Marquei cada item como ATIVO (A) ou PASSIVO (P)" },
      { id: "flow", label: "Calculei meu fluxo: estou produzindo ou consumindo patrimônio?" },
    ],
  },
  15: {
    mentor: "Robert Kiyosaki",
    chapter: "Cap. 6",
    pillar: "Pilar 2 — Pague-se primeiro",
    quote: "A maioria paga todo mundo e fica com sobra zero. Inverta a ordem.",
    steps: [
      { id: "amount", label: "Defini o valor que vou separar para mim ANTES das contas" },
      { id: "register", label: "Registrei essa retirada como transação (aporte / reserva)" },
    ],
    cta: { label: "Lançar aporte para mim", type: "transaction" },
    defaultTxType: "expense",
  },
  16: {
    mentor: "Robert Kiyosaki",
    chapter: "Cap. 6",
    pillar: "Pilar 3 — Eduque-se financeiramente",
    quote: "O ativo mais importante que você pode comprar é conhecimento.",
    steps: [
      { id: "next", label: "Defini qual será meu PRÓXIMO ativo (renda fixa, ação, ferramenta…)" },
      { id: "deadline", label: "Defini uma data realista para adquiri-lo" },
    ],
  },

  // ───────── Cap. 7 — Morgan Housel ─────────
  17: {
    mentor: "Morgan Housel",
    chapter: "Cap. 7",
    pillar: "Pilar 1 — A psicologia do dinheiro",
    quote: "Você não foi educado pelo seu pai. Você foi educado pelas brigas dele com o dinheiro.",
    steps: [
      { id: "story", label: "Descrevi a minha 'história' com dinheiro em 3 frases" },
      { id: "rewrite", label: "Marquei o que dessa herança eu quero MANTER e o que quero REESCREVER" },
    ],
  },
  18: {
    mentor: "Morgan Housel",
    chapter: "Cap. 7",
    pillar: "Pilar 2 — Tempo é o ativo mais raro",
    quote: "Juros compostos só funcionam para quem fica.",
    steps: [
      { id: "calc", label: "Calculei o que 1 aporte mensal vira em 10 anos" },
      { id: "habit", label: "Me comprometi com um aporte mensal fixo" },
    ],
  },

  // ───────── Cap. 8 — Warren Buffett ─────────
  19: {
    mentor: "Warren Buffett",
    chapter: "Cap. 8",
    pillar: "Pilar 1 — Invista só no que você entende",
    quote: "Risco vem de não saber o que você está fazendo.",
    steps: [
      { id: "review", label: "Revisei meus investimentos atuais (ou desejos)" },
      { id: "drop", label: "Marquei 1 que não consigo explicar em 1 frase — vou pausar" },
    ],
  },
  20: {
    mentor: "Warren Buffett",
    chapter: "Cap. 8",
    pillar: "Pilar 2 — Margem de segurança",
    quote: "Antes de buscar retorno, garanta o colchão.",
    steps: [
      { id: "target", label: "Defini minha meta de reserva (3 a 6 meses de gastos)" },
      { id: "monthly", label: "Defini o aporte mensal para chegar lá" },
      { id: "register", label: "Registrei a 1ª contribuição para a reserva" },
    ],
    cta: { label: "Lançar reserva", type: "transaction" },
    defaultTxType: "expense",
  },

  // ───────── Cap. 9 — Síntese ─────────
  21: {
    mentor: "Você",
    chapter: "Cap. 9",
    pillar: "Síntese — Mentalidade vencedora",
    quote: "Você não é mais quem começou esta jornada.",
    steps: [
      { id: "diff", label: "Escrevi o que mudou em mim nestes 21 dias" },
      { id: "next", label: "Defini meu PRÓXIMO grande objetivo financeiro" },
      { id: "habits", label: "Listei os 3 hábitos que vou sustentar todo mês" },
    ],
  },
};
