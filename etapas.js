// =====================================================================
// AS 6 ETAPAS DO MAPA DO INFOPRODUTO VIRAL (em ordem)
// A aluna responde só perguntas fáceis sobre ELA.
// A Sócia descobre nicho, cliente e produto e dá opções para ela escolher.
//   obrig: true          -> pergunta obrigatória para liberar o botão
//   escolha: "campo"     -> a resposta vira opções clicáveis
//   requer: "campo"      -> só libera depois que ela escolheu
//   principal            -> o que precisa estar pronto para concluir a etapa
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================
window.ETAPAS = [
  {
    id: 1, titulo: "Sobre você", subtitulo: "Descubra o seu caminho",
    intro: "Responda 3 perguntas simples sobre você. Você NÃO precisa saber qual é o seu nicho nem quem é a sua cliente: a Sócia descobre e te dá 3 caminhos para escolher.",
    principal: "nichos",
    campos: [
      { id: "historia", rotulo: "Conte um pouco da sua história", tipo: "area", obrig: true, dica: "Do seu jeito: de onde você veio, o que mudou na sua vida, sua fase atual." },
      { id: "experiencias", rotulo: "O que você já viveu, superou ou aprendeu na vida?", tipo: "area", obrig: true, dica: "Ex.: saí das dívidas, venci a ansiedade, emagreci, organizo a casa com 4 filhos, voltei a orar, sei cozinhar bem..." },
      { id: "gosta", rotulo: "Do que você gosta de falar ou fazer? Em que as pessoas te pedem ajuda?", tipo: "area" },
      { id: "tempo", rotulo: "Quanto tempo por dia você tem?", tipo: "select", opcoes: ["Até 1 hora", "1 a 2 horas", "2 a 4 horas", "Tempo integral"] },
    ],
    ferramentas: [
      { id: "nichos", titulo: "Meus 3 Caminhos", descricao: "A Sócia lê sua história e sugere 3 nichos, já com a cliente ideal de cada um. Você só escolhe.", escolha: "nicho", botaoEscolha: "Escolher este caminho" },
    ],
  },
  {
    id: 2, titulo: "Seu Instagram", subtitulo: "Arrume a vitrine antes de vender",
    intro: "Com o seu caminho escolhido, a Sócia monta o seu perfil: para quem você fala, nome, bio, foto, destaques e os posts fixados.",
    principal: "perfil_instagram",
    campos: [
      { id: "arroba", rotulo: "Seu @ no Instagram", tipo: "texto", obrig: true, dica: "Se ainda não tem um perfil profissional, coloque o @ que você pretende usar." },
      { id: "aparece", rotulo: "Você aparece nos vídeos?", tipo: "select", obrig: true, opcoes: ["Sim, falo para a câmera", "Às vezes", "Prefiro não aparecer (só mãos, voz ou texto)"] },
    ],
    ferramentas: [
      { id: "perfil_instagram", titulo: "Meu Perfil Pronto", descricao: "Sua cliente ideal, nome do perfil, bio, foto, destaques e 3 posts fixados." },
    ],
    checklist: [
      "Mudei o nome do perfil e a bio",
      "Coloquei uma foto de perfil clara, com o rosto (se aparecer)",
      "Criei os destaques",
      "Publiquei e fixei os 3 posts",
    ],
  },
  {
    id: 3, titulo: "Conteúdo para atrair", subtitulo: "Junte as pessoas certas",
    intro: "Antes de vender, atraia. Poste por pelo menos 7 dias falando com a sua cliente: é assim que ela começa a confiar em você.",
    principal: "conteudo_7",
    campos: [],
    ferramentas: [
      { id: "conteudo_7", titulo: "7 Dias de Conteúdo", descricao: "Uma semana de posts com gancho, roteiro curto e legenda." },
      { id: "roteiro_reels", titulo: "Roteiro de Reels", descricao: "Um roteiro pronto sobre o tema que você quiser.", extra: { rotulo: "Tema do Reels", placeholder: "Ex.: 3 sinais de que você está vivendo no automático" } },
    ],
    checklist: [
      "Postei os 7 dias",
      "Respondi os comentários e o direct",
    ],
  },
  {
    id: 4, titulo: "Seu produto", subtitulo: "O que você vai vender",
    intro: "A Sócia sugere 3 produtos que combinam com você e com a sua cliente. Você escolhe um e ela monta o plano completo para você criar no Canva ou gravar no celular.",
    principal: "plano_produto",
    campos: [
      { id: "formato", rotulo: "Tem preferência de formato?", tipo: "select", opcoes: ["A Sócia escolhe para mim", "E-book / guia", "Minicurso em vídeo", "Desafio de X dias", "Mentoria em grupo"] },
    ],
    ferramentas: [
      { id: "ideias_produto", titulo: "3 Ideias de Produto", descricao: "Nome, promessa e preço sugerido de cada uma. Você escolhe uma.", escolha: "produto", botaoEscolha: "Escolher este produto" },
      { id: "plano_produto", titulo: "Plano do Produto", descricao: "Sumário completo e o passo a passo para criar.", requer: "produto" },
    ],
    checklist: [
      "Criei o produto (no Canva ou gravei as aulas)",
      "Exportei o PDF / subi os vídeos",
    ],
  },
  {
    id: 5, titulo: "Oferta e Kiwify", subtitulo: "Preço, bônus e página de vendas",
    intro: "A Sócia monta a sua oferta e o texto da página de vendas. Depois, você cadastra tudo na Kiwify.",
    principal: "oferta",
    campos: [
      { id: "preco", rotulo: "Já pensou em um preço?", tipo: "texto", dica: "Pode deixar em branco: a Sócia sugere." },
    ],
    ferramentas: [
      { id: "oferta", titulo: "Minha Oferta", descricao: "Promessa, bônus, garantia e preço." },
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
    id: 6, titulo: "Lançamento", subtitulo: "Publicar e vender",
    intro: "Hora de abrir as portas. Siga o plano dia a dia, venda com verdade e responda o direct com carinho.",
    principal: "plano_lancamento",
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
