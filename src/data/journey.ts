import { JourneyDay } from "@/types";

/**
 * Trilha dos 21 dias — baseada no ebook matriz "Boletos Pagos".
 * Cada dia mapeia 1 pilar de 1 capítulo. Dia 1 = Cerbasi (enxuto).
 * Dias 2-21 cobrem os capítulos 2 a 9 (Ramsey, Nigro, Perini, Marçal, Kiyosaki, Housel, Buffett + síntese).
 */
export const JOURNEY_DAYS: JourneyDay[] = [
  // ───────── Capítulo 1 — Gustavo Cerbasi ─────────
  {
    day: 1,
    title: "Planeje antes que fique insustentável",
    mission: "Comece seu Orçamento Consciente (Cerbasi)",
    description:
      "Capítulo 1 — Gustavo Cerbasi. Faça seu snapshot, registre entradas e saídas, e classifique cada gasto em Essencial, Supérfluo ou Meta. Você não controla o que não enxerga.",
  },

  // ───────── Capítulo 2 — Dave Ramsey (Bola de Neve) ─────────
  {
    day: 2,
    title: "Encare a prisão invisível",
    mission: "Liste TODAS as suas dívidas — da menor à maior (Ramsey)",
    description:
      "Cap. 2 / Pilar 1 — Dave Ramsey. Coloque tudo no papel: nome da dívida, valor total, parcelas restantes, taxa de juros. Sem julgamento. Ver o tamanho do buraco transforma culpa em estratégia.",
  },
  {
    day: 3,
    title: "Pare de cavar",
    mission: "Corte 1 gasto mensal e direcione para a menor dívida",
    description:
      "Cap. 2 / Pilar 2 — Dave Ramsey. A primeira regra é parar de aumentar o buraco. Identifique 1 gasto recorrente e redirecione esse valor 100% para a quitação da menor dívida da sua lista.",
  },
  {
    day: 4,
    title: "Bola de neve em movimento",
    mission: "Quite a menor dívida e dê o salto para a próxima",
    description:
      "Cap. 2 / Pilar 3 — Dave Ramsey. Ao eliminar a primeira, some o valor que pagava nela ao próximo alvo. A vitória inicial cria momentum emocional — é o efeito bola de neve que te tira do vermelho.",
  },

  // ───────── Capítulo 3 — Tiago Nigro (Multiplicar Renda) ─────────
  {
    day: 5,
    title: "Gaste menos com propósito",
    mission: "Identifique seu padrão de consumo invisível (Nigro)",
    description:
      "Cap. 3 / Pilar 1 — Tiago Nigro. Liste seus 5 maiores gastos do mês e pergunte-se: cada um te aproxima ou te afasta da pessoa que você quer ser? Gastar menos não é se privar — é alinhar grana com propósito.",
  },
  {
    day: 6,
    title: "Pare de aceitar pouco como padrão",
    mission: "Mapeie 3 caminhos para aumentar sua renda",
    description:
      "Cap. 3 / Pilar 2 — Tiago Nigro. Renda ativa, extra ou digital? Liste 3 movimentos concretos (negociar aumento, freela, vender algo, monetizar habilidade) e marque um para iniciar nesta semana.",
  },
  {
    day: 7,
    title: "Investir melhor — o início",
    mission: "Defina o % da sua renda que vira investimento",
    description:
      "Cap. 3 / Pilar 3 — Tiago Nigro. Liberdade financeira não vem de glamour, vem de hábito. Defina um % fixo (mesmo que 5%) e automatize: assim que entra, o investimento sai antes de qualquer gasto.",
  },

  // ───────── Capítulo 4 — Bruno Perini (Estoicismo Financeiro) ─────────
  {
    day: 8,
    title: "Controle emocional é a base",
    mission: "Crie sua regra das 24h antes de qualquer compra por impulso",
    description:
      "Cap. 4 / Pilar 1 — Bruno Perini. O preço da emoção é alto. Antes de qualquer compra acima de um valor que você definir, espere 24h. Se ainda fizer sentido com a cabeça fria, reavalie.",
  },
  {
    day: 9,
    title: "Tempo + Consistência",
    mission: "Transforme 1 hábito financeiro em ritual semanal",
    description:
      "Cap. 4 / Pilar 2 — Bruno Perini. A riqueza é paciente. Escolha 1 ação (revisar gastos, aportar, estudar 15min) e marque uma data fixa toda semana. Em 12 meses, isso vira patrimônio.",
  },
  {
    day: 10,
    title: "Foco no processo, não na modinha",
    mission: "Desligue 1 fonte de ruído financeiro",
    description:
      "Cap. 4 / Pilar 3 — Bruno Perini. Pare de seguir guru do dia. Silencie 1 perfil/grupo que te empurra para decisões impulsivas. Sua estratégia precisa de paz, não de hype.",
  },

  // ───────── Capítulo 5 — Pablo Marçal (Mentalidade Próspera) ─────────
  {
    day: 11,
    title: "Reconheça seus medos",
    mission: "Escreva os 3 maiores bloqueios financeiros que você carrega",
    description:
      "Cap. 5 / Pilar 1 — Pablo Marçal. Medo de errar, de julgamento, de não conseguir. Coloque-os no papel e ao lado de cada um escreva 1 ação concreta para começar a vencê-lo.",
  },
  {
    day: 12,
    title: "Mentalidade de vencedor",
    mission: "Crie sua frase-âncora e repita ao acordar e dormir",
    description:
      "Cap. 5 / Pilar 2 — Pablo Marçal. Seu cérebro acredita no que você repete com emoção. Escreva uma frase no presente (\"Eu sou alguém que decide o próprio futuro\") e ative-a 2x ao dia.",
  },
  {
    day: 13,
    title: "Aja com ousadia",
    mission: "Faça hoje aquela ação que você vem adiando",
    description:
      "Cap. 5 / Pilar 3 — Pablo Marçal. O medo é motor, não freio. Identifique a decisão financeira que você empurra há semanas e execute hoje, mesmo com dúvida. Movimento gera clareza.",
  },

  // ───────── Capítulo 6 — Robert Kiyosaki (Ativos vs Passivos) ─────────
  {
    day: 14,
    title: "Ativos vs Passivos",
    mission: "Liste seus bens e classifique cada um (Kiyosaki)",
    description:
      "Cap. 6 / Pilar 1 — Robert Kiyosaki. ATIVO coloca dinheiro no seu bolso. PASSIVO tira. Liste tudo que você tem e marque A ou P. Descubra seu fluxo patrimonial real.",
  },
  {
    day: 15,
    title: "Pague-se primeiro",
    mission: "Separe seu aporte ANTES de pagar contas neste mês",
    description:
      "Cap. 6 / Pilar 2 — Robert Kiyosaki. A maioria paga todo mundo e fica com sobra zero. Inverta: assim que o dinheiro entra, separe seu aporte para ativos. O resto se ajusta.",
  },
  {
    day: 16,
    title: "Eduque-se financeiramente",
    mission: "Comprometa-se a adquirir o próximo ativo",
    description:
      "Cap. 6 / Pilar 3 — Robert Kiyosaki. Defina qual será seu próximo ativo (renda fixa, ação, fundo, ferramenta de negócio) e o prazo realista para adquiri-lo. Conhecimento + ação = patrimônio.",
  },

  // ───────── Capítulo 7 — Morgan Housel (Psicologia do Dinheiro) ─────────
  {
    day: 17,
    title: "A psicologia do dinheiro",
    mission: "Descreva sua \"história\" com dinheiro em 3 frases",
    description:
      "Cap. 7 / Pilar 1 — Morgan Housel. Como você foi criado em relação ao dinheiro molda suas decisões hoje. Reconhecer o roteiro herdado é o primeiro passo para reescrevê-lo.",
  },
  {
    day: 18,
    title: "Tempo é o ativo mais raro",
    mission: "Calcule o valor que 1 aporte mensal vira em 10 anos",
    description:
      "Cap. 7 / Pilar 2 — Morgan Housel. Juros compostos só funcionam para quem fica. Use uma calculadora simples e veja: pequenos aportes constantes superam grandes aportes esporádicos.",
  },

  // ───────── Capítulo 8 — Warren Buffett (Investidor Simples) ─────────
  {
    day: 19,
    title: "Invista só no que você entende",
    mission: "Elimine 1 investimento (ou tentação) que você não compreende",
    description:
      "Cap. 8 / Pilar 1 — Warren Buffett. Risco vem do desconhecimento. Revise sua carteira (ou desejos): se não consegue explicar o produto em 1 frase, ele não é seu — ainda.",
  },
  {
    day: 20,
    title: "Margem de segurança",
    mission: "Construa (ou reforce) sua reserva de emergência",
    description:
      "Cap. 8 / Pilar 2 — Warren Buffett. Antes de buscar retorno, garanta o colchão. Defina uma meta de reserva (3-6 meses de gastos) e o aporte mensal para chegar lá.",
  },

  // ───────── Capítulo 9 — Síntese: Mentalidade Vencedora ─────────
  {
    day: 21,
    title: "Mentalidade vencedora — sua nova identidade",
    mission: "Escreva o seu Plano dos próximos 12 meses",
    description:
      "Cap. 9 — Síntese. Você não é mais quem começou esta jornada. Sintetize em 1 página: o que mudou, qual seu próximo grande objetivo financeiro e os 3 hábitos que vai sustentar todo mês.",
  },
];

/**
 * Jornada Extra — slot reservado para conteúdo futuro definido pelo usuário.
 * Renderizada como card "Em breve" abaixo da trilha principal.
 */
export const JOURNEY_EXTRA = {
  title: "Jornada Extra",
  subtitle: "Em breve",
  description:
    "Um novo módulo está sendo preparado para aprofundar sua transformação financeira. Volte em breve.",
};
