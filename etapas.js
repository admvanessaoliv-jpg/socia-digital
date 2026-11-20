// =====================================================================
// AS 8 ETAPAS DO MAPA DO INFOPRODUTO VIRAL
// Aqui ficam as perguntas e os botões de cada etapa.
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================
window.ETAPAS = [
  {
    id: 1, slug: "descoberta", titulo: "Descoberta", subtitulo: "Quem é você e o que só você pode ensinar",
    intro: "Seu negócio começa na sua história. Responda com sinceridade, sem se preocupar em escrever bonito: a Sócia organiza para você.",
    campos: [
      { id: "historia", rotulo: "Conte sua história em poucas linhas", tipo: "area", dica: "De onde você veio, o que mudou na sua vida, o que te trouxe até aqui." },
      { id: "experiencias", rotulo: "O que você já viveu e superou que pode ajudar outras mulheres?", tipo: "area", dica: "Ex.: saí das dívidas, venci a ansiedade, organizei minha casa com 4 filhos, voltei a orar..." },
      { id: "habilidades", rotulo: "Em que as pessoas sempre te pedem ajuda? O que você faz bem?", tipo: "area" },
      { id: "fe", rotulo: "Como a sua fé entra no que você quer ensinar?", tipo: "area", dica: "Opcional." },
      { id: "tempo", rotulo: "Quanto tempo por dia você tem para o seu negócio?", tipo: "select", opcoes: ["Até 1 hora", "1 a 2 horas", "2 a 4 horas", "Tempo integral"] },
      { id: "perfil_atual", rotulo: "Como está seu Instagram hoje?", tipo: "texto", dica: "Ex.: perfil pessoal com 800 seguidores / ainda não tenho perfil profissional" },
    ],
    ferramentas: [
      { id: "mapa_dons", titulo: "Mapa dos Meus Dons", descricao: "3 caminhos de nicho a partir da sua história, com a recomendação de por onde começar." },
    ],
  },
  {
    id: 2, slug: "cliente", titulo: "Nicho e cliente", subtitulo: "Para quem é o seu produto",
    intro: "Quem tenta falar com todo mundo não vende para ninguém. Aqui você escolhe a mulher que vai servir e valida a ideia antes de criar.",
    campos: [
      { id: "nicho", rotulo: "Qual nicho você escolheu?", tipo: "texto", dica: "Pode ser um dos caminhos do Mapa dos Dons." },
      { id: "publico", rotulo: "Quem é a sua cliente?", tipo: "area", dica: "Ex.: mães cristãs de 28 a 45 anos que vivem cansadas e sem tempo para Deus" },
      { id: "dores", rotulo: "O que tira o sono dela?", tipo: "area" },
      { id: "desejos", rotulo: "O que ela mais deseja?", tipo: "area" },
    ],
    ferramentas: [
      { id: "cliente_ideal", titulo: "Retrato da Cliente Ideal", descricao: "Dores, desejos, objeções e as palavras exatas que ela usa." },
      { id: "validar_ideia", titulo: "Teste de Validação em 7 Dias", descricao: "Stories, enquetes e caixinhas prontas para saber se a ideia vende." },
    ],
  },
  {
    id: 3, slug: "produto", titulo: "Produto", subtitulo: "O que você vai vender",
    intro: "Seu primeiro produto não precisa ser enorme. Precisa entregar uma transformação clara e rápida.",
    campos: [
      { id: "formato", rotulo: "Qual formato você prefere?", tipo: "select", opcoes: ["Ainda não sei", "E-book / guia", "Minicurso em vídeo", "Desafio de X dias", "Mentoria em grupo", "Comunidade / assinatura", "Mini app (feito no Canva)"] },
      { id: "transformacao", rotulo: "Qual transformação ela vai ter? (de onde para onde)", tipo: "area", dica: "Ex.: de ansiosa e sem rotina de oração para 15 minutos diários de paz com Deus" },
    ],
    ferramentas: [
      { id: "ideias_produto", titulo: "5 Ideias de Produto", descricao: "Nome, promessa, preço sugerido e tempo para criar." },
      { id: "estrutura_produto", titulo: "Estrutura do Produto", descricao: "Módulos, capítulos ou dias, com exercícios e o seu mecanismo único." },
    ],
  },
  {
    id: 4, slug: "oferta", titulo: "Oferta", subtitulo: "Nome, preço, bônus e garantia",
    intro: "A oferta é o que faz a cliente pensar: “isso é exatamente o que eu preciso”.",
    campos: [
      { id: "nome_produto", rotulo: "Nome do produto (provisório)", tipo: "texto" },
      { id: "preco", rotulo: "Que preço você está pensando?", tipo: "texto", dica: "Ex.: R$ 47 / R$ 97 / ainda não sei" },
      { id: "bonus", rotulo: "Ideias de bônus", tipo: "area", dica: "Opcional." },
      { id: "garantia", rotulo: "Garantia", tipo: "select", opcoes: ["7 dias (padrão da Kiwify)", "15 dias", "30 dias"] },
    ],
    ferramentas: [
      { id: "oferta", titulo: "Oferta Irresistível", descricao: "Promessa, bônus, garantia e como apresentar o preço." },
      { id: "nomes", titulo: "Nomes e Headlines", descricao: "10 nomes e 10 frases de capa, com as 3 melhores marcadas." },
    ],
  },
  {
    id: 5, slug: "criacao", titulo: "Criação", subtitulo: "Escreva e grave o seu produto",
    intro: "Vai criar um e-book? Use a página Meu e-book: a Sócia escreve o livro inteiro, capítulo por capítulo. Aqui você também escreve capítulos soltos, roteiros de aula e cria o seu mini app no Canva.",
    ebook: true,
    campos: [],
    ferramentas: [
      { id: "escrever_capitulo", titulo: "Escrever Capítulo", descricao: "O capítulo completo, na sua voz, com exercício prático.", extra: { rotulo: "Qual capítulo?", placeholder: "Ex.: Capítulo 2 — Quando a ansiedade fala mais alto" } },
      { id: "roteiro_aula", titulo: "Roteiro de Aula em Vídeo", descricao: "O que falar, o que mostrar e como gravar com o celular.", extra: { rotulo: "Qual aula?", placeholder: "Ex.: Aula 1 — Seu primeiro passo" } },
      { id: "miniapp_conteudo", titulo: "Mini App: Conteúdo e Telas", descricao: "As telas do seu app e todo o texto de cada uma, prontos para usar.", extra: { rotulo: "Que mini app você quer criar?", placeholder: "Ex.: Planner de oração de 21 dias / Quiz: qual é o seu dom?" } },
      { id: "miniapp_canva", titulo: "Mini App: Comando para o Canva", descricao: "O comando pronto para colar no Canva Code, mais o passo a passo para publicar e entregar na Kiwify.", extra: { rotulo: "Que mini app você quer criar?", placeholder: "Ex.: Planner de oração de 21 dias" } },
    ],
    checklist: [
      "Revisei o texto e coloquei minhas histórias reais",
      "Montei o e-book no Canva (ou gravei as aulas)",
      "Exportei o PDF / subi os vídeos",
      "Se fiz mini app: publiquei no Canva e testei no celular",
    ],
  },
  {
    id: 6, slug: "pagina", titulo: "Página de vendas", subtitulo: "A vitrine do seu produto",
    intro: "Com a copy pronta, você cadastra o produto na Kiwify e já tem o link para vender.",
    campos: [],
    ferramentas: [
      { id: "pagina_vendas", titulo: "Copy da Página de Vendas", descricao: "Todas as seções, prontas para colar." },
      { id: "objecoes", titulo: "Quebra de Objeções", descricao: "12 objeções com resposta para a página, o direct e os stories." },
    ],
    checklist: [
      "Criei minha conta na Kiwify e completei o cadastro",
      "Cadastrei o produto com nome, descrição e preço",
      "Subi o material na área de membros",
      "Montei a página de vendas (Kiwify, Canva ou outro)",
      "Fiz uma compra de teste para ver a entrega",
    ],
  },
  {
    id: 7, slug: "conteudo", titulo: "Perfil e conteúdo viral", subtitulo: "Atrair as pessoas certas",
    intro: "Seu perfil é a sua loja. Organize a vitrine e poste com estratégia: alcance, conexão e venda.",
    campos: [
      { id: "arroba", rotulo: "Seu @ no Instagram", tipo: "texto" },
      { id: "aparece", rotulo: "Você aparece nos vídeos?", tipo: "select", opcoes: ["Sim, falo para a câmera", "Às vezes", "Prefiro não aparecer (só mãos, voz ou texto)"] },
      { id: "frequencia", rotulo: "Quantas vezes por semana consegue postar?", tipo: "select", opcoes: ["3 vezes", "5 vezes", "Todos os dias"] },
    ],
    ferramentas: [
      { id: "bio_destaques", titulo: "Bio e Destaques", descricao: "Bio, nome pesquisável, destaques e posts fixados." },
      { id: "calendario_30", titulo: "30 Dias de Conteúdo Viral", descricao: "Um calendário com gancho, formato e CTA de cada dia." },
      { id: "roteiro_reels", titulo: "Roteiro de Reels", descricao: "3 versões com gancho de 3 segundos e legenda.", extra: { rotulo: "Tema do Reels", placeholder: "Ex.: 3 sinais de que você está vivendo no automático" } },
      { id: "carrossel", titulo: "Carrossel", descricao: "Texto de cada slide e a legenda.", extra: { rotulo: "Tema do carrossel", placeholder: "Ex.: O que ninguém te conta sobre recomeçar" } },
    ],
  },
  {
    id: 8, slug: "lancamento", titulo: "Lançamento", subtitulo: "Publicar e vender",
    intro: "Hora de abrir as portas. Siga o plano, venda com verdade e acompanhe as respostas no direct.",
    campos: [
      { id: "data_lancamento", rotulo: "Quando você quer lançar?", tipo: "texto", dica: "Ex.: 1º de dezembro" },
      { id: "tipo_lancamento", rotulo: "Como vai vender?", tipo: "select", opcoes: ["Lançamento de 7 dias (carrinho abre e fecha)", "Venda perpétua (sempre aberto)"] },
    ],
    ferramentas: [
      { id: "plano_lancamento", titulo: "Plano de Lançamento 7 Dias", descricao: "Feed, stories e direct, dia a dia." },
      { id: "stories_venda", titulo: "Stories de Venda", descricao: "3 sequências prontas: história, objeções e último dia." },
      { id: "direct", titulo: "Roteiro do Direct", descricao: "Respostas para “está caro”, “vou pensar” e mais." },
      { id: "roteiro_live", titulo: "Roteiro de Live", descricao: "Uma live de vendas de 40 a 50 minutos, bloco a bloco." },
    ],
    checklist: [
      "Link da Kiwify na bio",
      "Destaques do produto prontos",
      "Posts do lançamento agendados",
      "Respostas do direct salvas nas respostas rápidas",
      "Publiquei! 🎉",
    ],
  },
];
