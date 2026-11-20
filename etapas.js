// =====================================================================
// AS 6 ETAPAS DO MAPA DO INFOPRODUTO VIRAL (em ordem)
// Cada etapa: 1) responda  2) gere com a Sócia  3) coloque em prática
// "obrig: true" = pergunta obrigatória para liberar o botão da Sócia.
// A primeira ferramenta de cada etapa é a entrega principal.
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================
window.ETAPAS = [
  {
    id: 1, titulo: "Sua história", subtitulo: "Descubra o que só você pode ensinar",
    intro: "Seu negócio começa na sua história. Responda com sinceridade, sem se preocupar em escrever bonito: a Sócia organiza para você.",
    campos: [
      { id: "historia", rotulo: "Conte sua história em poucas linhas", tipo: "area", obrig: true, dica: "De onde você veio, o que mudou na sua vida, o que te trouxe até aqui." },
      { id: "experiencias", rotulo: "O que você já viveu e superou que pode ajudar outras mulheres?", tipo: "area", obrig: true, dica: "Ex.: saí das dívidas, venci a ansiedade, organizei minha casa com 4 filhos, voltei a orar..." },
      { id: "habilidades", rotulo: "Em que as pessoas sempre te pedem ajuda?", tipo: "area" },
      { id: "tempo", rotulo: "Quanto tempo por dia você tem para o seu negócio?", tipo: "select", opcoes: ["Até 1 hora", "1 a 2 horas", "2 a 4 horas", "Tempo integral"] },
    ],
    ferramentas: [
      { id: "mapa_dons", titulo: "Mapa dos Meus Dons", descricao: "3 caminhos de nicho a partir da sua história e por qual começar." },
    ],
  },
  {
    id: 2, titulo: "Sua cliente", subtitulo: "Para quem é o seu produto",
    intro: "Quem tenta falar com todo mundo não vende para ninguém. Escolha um dos caminhos do Mapa dos Dons e descreva a mulher que você vai ajudar.",
    campos: [
      { id: "nicho", rotulo: "Qual caminho (nicho) você escolheu?", tipo: "texto", obrig: true },
      { id: "publico", rotulo: "Quem é a sua cliente?", tipo: "area", obrig: true, dica: "Ex.: mães cristãs de 28 a 45 anos, cansadas e sem tempo para Deus" },
      { id: "dores", rotulo: "O que tira o sono dela?", tipo: "area" },
    ],
    ferramentas: [
      { id: "cliente_ideal", titulo: "Retrato da Cliente Ideal", descricao: "Dores, desejos, objeções e as palavras exatas que ela usa." },
    ],
  },
  {
    id: 3, titulo: "Seu produto", subtitulo: "O que você vai vender",
    intro: "Seu primeiro produto não precisa ser enorme. Precisa entregar uma transformação clara e rápida. A Sócia monta o plano; você cria no Canva ou grava no celular.",
    campos: [
      { id: "formato", rotulo: "Qual formato você prefere?", tipo: "select", obrig: true, opcoes: ["E-book / guia", "Minicurso em vídeo", "Desafio de X dias", "Mentoria em grupo", "Ainda não sei: me ajude a escolher"] },
      { id: "transformacao", rotulo: "Qual transformação ela vai ter? (de onde para onde)", tipo: "area", obrig: true, dica: "Ex.: de ansiosa e sem rotina de oração para 15 minutos diários de paz com Deus" },
    ],
    ferramentas: [
      { id: "plano_produto", titulo: "Plano do Produto", descricao: "Nome, promessa, sumário completo e o passo a passo para criar." },
    ],
    checklist: [
      "Escolhi o nome do produto",
      "Criei o produto (no Canva ou gravei as aulas)",
      "Exportei o PDF / subi os vídeos",
    ],
  },
  {
    id: 4, titulo: "Sua oferta", subtitulo: "Preço, bônus e página de vendas",
    intro: "A oferta é o que faz a cliente pensar: “isso é exatamente o que eu preciso”. Depois, você cadastra tudo na Kiwify.",
    campos: [
      { id: "nome_produto", rotulo: "Nome do produto", tipo: "texto", obrig: true },
      { id: "preco", rotulo: "Que preço você está pensando?", tipo: "texto", obrig: true, dica: "Ex.: R$ 47 / R$ 97 / ainda não sei" },
      { id: "bonus", rotulo: "Ideias de bônus (opcional)", tipo: "area" },
    ],
    ferramentas: [
      { id: "oferta", titulo: "Oferta Irresistível", descricao: "Promessa, bônus, garantia e como apresentar o preço." },
      { id: "pagina_vendas", titulo: "Texto da Página de Vendas", descricao: "Todas as partes da página, prontas para colar." },
    ],
    checklist: [
      "Criei minha conta na Kiwify",
      "Cadastrei o produto com nome, descrição e preço",
      "Coloquei o material na área de membros",
      "Montei a página de vendas e fiz uma compra de teste",
    ],
  },
  {
    id: 5, titulo: "Seu perfil", subtitulo: "Atrair as pessoas certas",
    intro: "Seu perfil é a sua loja. Primeiro organize a vitrine, depois poste com estratégia: alcance, conexão e venda.",
    campos: [
      { id: "arroba", rotulo: "Seu @ no Instagram", tipo: "texto", obrig: true },
      { id: "aparece", rotulo: "Você aparece nos vídeos?", tipo: "select", obrig: true, opcoes: ["Sim, falo para a câmera", "Às vezes", "Prefiro não aparecer (só mãos, voz ou texto)"] },
    ],
    ferramentas: [
      { id: "bio_destaques", titulo: "Bio e Destaques", descricao: "Bio, nome pesquisável e destaques do perfil." },
      { id: "conteudo_7", titulo: "7 Dias de Conteúdo", descricao: "Uma semana de posts com gancho, roteiro curto e legenda." },
      { id: "roteiro_reels", titulo: "Roteiro de Reels", descricao: "Um roteiro pronto sobre o tema que você quiser.", extra: { rotulo: "Tema do Reels", placeholder: "Ex.: 3 sinais de que você está vivendo no automático" } },
    ],
  },
  {
    id: 6, titulo: "Seu lançamento", subtitulo: "Publicar e vender",
    intro: "Hora de abrir as portas. Siga o plano dia a dia, venda com verdade e responda o direct com carinho.",
    campos: [
      { id: "data_lancamento", rotulo: "Quando você quer lançar?", tipo: "texto", obrig: true, dica: "Ex.: 1º de dezembro" },
      { id: "tipo_lancamento", rotulo: "Como vai vender?", tipo: "select", obrig: true, opcoes: ["Lançamento de 7 dias (carrinho abre e fecha)", "Venda sempre aberta"] },
    ],
    ferramentas: [
      { id: "plano_lancamento", titulo: "Plano de Lançamento", descricao: "O que postar e falar nos stories, dia a dia." },
      { id: "direct", titulo: "Respostas do Direct", descricao: "O que responder para “está caro”, “vou pensar” e mais." },
    ],
    checklist: [
      "Link da Kiwify na bio",
      "Destaque do produto pronto",
      "Respostas do direct salvas nas respostas rápidas",
      "Publiquei! 🎉",
    ],
  },
];
