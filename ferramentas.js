// =====================================================================
// SÓCIA DIGITAL — a JORNADA (funil guiado) e as ferramentas do FUNIL
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================

// As 4 fases que aparecem no topo da jornada
window.FASES = ["Clareza", "Perfil", "Produto", "Funil"];

// Ferramentas usadas dentro da jornada (não aparecem no painel do funil)
//   campo.tipo "imagens" = prints; escolha = vira opções para clicar
window.FERR_JORNADA = [
  { id: "raio_x", titulo: "Raio-X do perfil", desc: "Análise do seu perfil pelos prints.",
    campo: { tipo: "imagens", obrig: true, rotulo: "Seus prints (de 1 a 5)", dica: "Tire print de: 1) topo do perfil (foto, nome, bio, destaques); 2) a grade de posts; 3) Insights: visão geral e os posts com mais alcance." } },
  { id: "analisar_ideia", titulo: "Análise da sua ideia", desc: "Se a sua ideia tem o que precisa para vender.", escolha: "nicho", botaoEscolha: "Seguir com esta",
    campo: { tipo: "area", obrig: true, rotulo: "Qual é a sua ideia?", placeholder: "Ex.: quero ensinar mães a organizar a rotina da casa com fé" } },
  { id: "nicho", titulo: "Seu nicho", desc: "3 nichos a partir da sua história.", escolha: "nicho", botaoEscolha: "Escolher este nicho",
    campo: { tipo: "area", obrig: true, rotulo: "O que você já viveu, superou ou sabe fazer?", placeholder: "Ex.: sou mãe de 3, saí das dívidas, gosto de cozinhar e as amigas sempre me pedem conselho sobre casamento" } },
  { id: "persona", titulo: "Sua cliente ideal", desc: "O retrato da mulher que você vai ajudar." },
  { id: "ajustes_perfil", titulo: "Ajustes do Instagram", desc: "Nome, bio, foto e destaques.",
    campo: { tipo: "texto", rotulo: "Seu @ (opcional)", placeholder: "@seuperfil" } },
  { id: "ideias_produto", titulo: "Ideias de produto", desc: "3 produtos que tocam numa dor real.", escolha: "produto", botaoEscolha: "Quero este produto" },
  { id: "blueprint", titulo: "Plano do seu produto", desc: "Método, mecanismo único, estrutura, layout e o comando para criar no Claude." },
];

// A conversa, passo a passo
window.JORNADA = [
  { id: "tem_insta", fase: 0, tipo: "pergunta", campo: "tem_insta",
    fala: "Oi! Eu sou a sua **Sócia Digital** ✨ Vamos construir o seu negócio digital juntas, um passo de cada vez.\n\nPara começar: **você já tem Instagram?**",
    opcoes: [["sim", "Sim, já tenho", "raio_x"], ["nao", "Ainda não (ou vou criar um novo)", "tem_ideia"]] },
  { id: "raio_x", fase: 0, tipo: "ia", ferramenta: "raio_x", proximo: "tem_ideia",
    fala: "Perfeito! Então vamos começar olhando o seu perfil. Tire os prints e me mande aqui: eu analiso tudo e te digo o que o seu perfil mostra hoje." },
  { id: "tem_ideia", fase: 0, tipo: "pergunta", campo: "tem_ideia",
    fala: "Agora me conta: **você já tem uma ideia do que quer vender?**",
    opcoes: [["sim", "Sim, tenho uma ideia", "ideia"], ["nao", "Não, me ajuda a descobrir", "historia"]] },
  { id: "ideia", fase: 0, tipo: "ia", ferramenta: "analisar_ideia", proximo: "persona",
    fala: "Que ótimo! Me conta a sua ideia. Eu vou analisar se ela toca numa dor real e tem o que precisa para vender, e te mostrar como deixá-la mais forte." },
  { id: "historia", fase: 0, tipo: "ia", ferramenta: "nicho", proximo: "persona",
    fala: "Sem problema, é para isso que eu estou aqui! Vamos começar **criando o seu nicho**. Me conta um pouco de você:" },
  { id: "persona", fase: 0, tipo: "ia", ferramenta: "persona", proximo: "clareza",
    fala: "Agora vamos conhecer a mulher que você vai ajudar: a sua **cliente ideal**. Eu monto o retrato dela para você." },
  { id: "clareza", fase: 0, tipo: "resumo", proximo: "perfil",
    fala: "Perfeito! Olha a clareza que você já tem. É isso que vai guiar tudo daqui para frente:" },
  { id: "perfil", fase: 1, tipo: "ia", ferramenta: "ajustes_perfil", proximo: "formato",
    fala: "Agora vamos **ajustar o seu Instagram** para ele mostrar quem você é e quem você ajuda: nome, bio, foto de perfil e destaques.",
    checklist: ["Troquei o nome do perfil", "Troquei a bio", "Ajustei a foto de perfil", "Organizei os destaques"] },
  { id: "formato", fase: 2, tipo: "pergunta", campo: "formato",
    fala: "Agora o mais importante: **vamos criar o seu primeiro infoproduto!** Antes de qualquer post, você precisa ter o que vender.\n\nQual formato você prefere?",
    opcoes: [["E-book ou guia", "E-book ou guia", "ideias_prod"], ["Minicurso em vídeo", "Minicurso em vídeo", "ideias_prod"], ["Desafio de X dias", "Desafio de X dias", "ideias_prod"], ["Mentoria", "Mentoria", "ideias_prod"], ["A Sócia escolhe", "Me ajude a escolher", "ideias_prod"]] },
  { id: "ideias_prod", fase: 2, tipo: "ia", ferramenta: "ideias_produto", proximo: "blueprint",
    fala: "Vou te dar **3 ideias de produto** que tocam numa dor real da sua cliente, cada uma com um mecanismo único. Escolha a que mais combina com você." },
  { id: "blueprint", fase: 2, tipo: "ia", ferramenta: "blueprint", proximo: "pausa",
    fala: "Agora eu monto o **plano completo do seu produto**: a dor, o método com mecanismo único, a estrutura, como vai ser o layout e a diagramação, e o **comando pronto para você criar no Claude**." },
  { id: "pausa", fase: 2, tipo: "pausa", proximo: "funil", botao: "Já criei meu produto",
    fala: "O seu norte está pronto! 🎯\n\nAgora volte para a aula do **Mapa do Infoproduto Viral** e crie o seu produto usando o plano e o comando pronto. Quando o produto estiver pronto, volte aqui: a gente monta o seu **funil de vendas**.",
    checklist: ["Criei o conteúdo do produto no Claude", "Montei o produto (Canva ou gravação)", "Cadastrei o produto na Kiwify"] },
  { id: "funil", fase: 3, tipo: "funil",
    fala: "Agora sim! 🚀 Com o produto pronto, é hora do **funil**: atrair as pessoas certas, criar conexão e vender. Comece pelo topo e vá descendo." },
];

// As ferramentas do FUNIL (liberadas depois que o produto existe)
window.CATEGORIAS = [
  {
    id: "atrair", titulo: "1. Atrair", desc: "Topo do funil: alcance e seguidores certos.",
    ferramentas: [
      { id: "reels", titulo: "Roteiro de Reels", desc: "Gancho dos 3 primeiros segundos, falas, texto na tela e chamada final.", formulas: true,
        campo: { rotulo: "Tema do Reels (opcional)", placeholder: "Deixe em branco e a Sócia escolhe" } },
      { id: "ideias_reels", titulo: "10 ideias de Reels", desc: "Ganchos prontos, com os 3 mais fortes marcados.",
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: finanças, casamento, ansiedade" } },
      { id: "carrossel", titulo: "Carrossel viral", desc: "O texto dos 7 slides e a legenda, com pitch no último slide.", carrossel: true, formulas: true,
        campo: { rotulo: "Tema do carrossel (opcional)", placeholder: "Deixe em branco e a Sócia escolhe" } },
      { id: "capas", titulo: "10 capas que param a rolagem", desc: "Ideias de capa nas fórmulas que mais vendem.", formulas: true,
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: finanças, casamento, ansiedade" } },
      { id: "semana", titulo: "Conteúdo da semana", desc: "7 posts, um por dia, misturando Reels e carrossel." },
    ],
  },
  {
    id: "conectar", titulo: "2. Conectar", desc: "Meio do funil: confiança e relacionamento.",
    ferramentas: [
      { id: "stories", titulo: "Sequência de stories", desc: "6 stories com enquete e caixinha.",
        campo: { rotulo: "Objetivo ou tema (opcional)", placeholder: "Ex.: contar minha história / aquecer para a venda" } },
      { id: "destaques", titulo: "Destaques", desc: "5 destaques com nome curto e o que colocar em cada um." },
      { id: "fixados", titulo: "3 posts fixados", desc: "Os 3 posts que apresentam você para quem chega no perfil." },
      { id: "legenda", titulo: "Legenda", desc: "3 legendas curtas para um post seu.",
        campo: { rotulo: "Sobre o que é o post?", obrig: true, placeholder: "Ex.: carrossel sobre 3 orações pela vida financeira" } },
    ],
  },
  {
    id: "vender", titulo: "3. Vender", desc: "Fundo do funil: oferta, página e lançamento.",
    ferramentas: [
      { id: "pitch", titulo: "Pitch do último slide", desc: "5 títulos com promessa forte e o texto do último slide." },
      { id: "pagina_vendas", titulo: "Página de vendas", desc: "A Sócia escreve a página e você publica com o link da Kiwify.", pagina: true },
      { id: "direct", titulo: "Respostas do direct", desc: "O que responder para “está caro”, “vou pensar” e mais." },
      { id: "lancamento", titulo: "Lançamento de 7 dias", desc: "O que postar e falar nos stories, dia a dia." },
    ],
  },
];
