// =====================================================================
// SÓCIA DIGITAL — a JORNADA (funil guiado) e as ferramentas do FUNIL
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================

// As 4 fases que aparecem no topo da jornada
window.FASES = ["Clareza", "Produto", "Perfil", "Funil"];

// Ferramentas usadas dentro da jornada (não aparecem no painel do funil)
window.FERR_JORNADA = [
  { id: "produtos_virais", titulo: "Seus 3 infoprodutos", desc: "3 produtos que resolvem uma dor específica, com mecanismo único.", escolha: "produto", botaoEscolha: "Quero criar este" },
  { id: "blueprint", titulo: "Plano do seu produto", desc: "Cliente, método, estrutura, layout e o comando para criar no Claude." },
  { id: "raio_x", titulo: "Raio-X do perfil", desc: "Diagnóstico do seu perfil pelos prints.",
    campo: { tipo: "imagens", obrig: true, rotulo: "Seus prints (de 1 a 5)", dica: "Tire print de: 1) topo do perfil (foto, nome, bio, destaques); 2) a grade de posts; 3) Insights: visão geral e os posts com mais alcance." } },
  { id: "ajustes_perfil", titulo: "Ajustes do Instagram", desc: "Nome, bio, foto e destaques para vender o seu produto." },
];

// A conversa, passo a passo
//   texto = pergunta aberta; pergunta = botões; ia = a Sócia cria (auto = cria sozinha ao chegar)
window.JORNADA = [
  // ---------- CLAREZA: só 4 perguntas
  { id: "q1", fase: 0, tipo: "texto", campo: "vivencia", obrig: true, proximo: "q2", contador: "1 de 4",
    fala: "Oi! Eu sou a sua **Sócia Digital** ✨ São só 4 perguntas e eu já te mostro 3 produtos que você pode criar.\n\n**O que você já viveu, superou ou sabe fazer que pode ajudar outras mulheres?**",
    placeholder: "Ex.: faço receitas naturais para a minha família; saí de uma dívida de R$ 40 mil; emagreci 15 kg depois da gravidez; organizo a casa com 4 filhos; faço unhas há 10 anos..." },
  { id: "q2", fase: 0, tipo: "pergunta", campo: "publico", contador: "2 de 4",
    fala: "**Para quem você quer falar?**",
    opcoes: [["Mulheres", "Mulheres", "q3"], ["Mães", "Mães", "q3"], ["Casais", "Casais", "q3"], ["Quem quer cuidar da saúde ou emagrecer", "Quem quer cuidar da saúde ou emagrecer", "q3"], ["Quem quer trabalhar com a internet", "Quem quer trabalhar com a internet", "q3"], ["", "Outro público (vou escrever)", "q2b"], ["Ainda não sei", "Ainda não sei", "q3"]] },
  { id: "q2b", fase: 0, tipo: "texto", campo: "publico", obrig: true, proximo: "q3", contador: "2 de 4",
    fala: "**Para quem você quer falar?** Escreva do seu jeito.",
    placeholder: "Ex.: donas de pet, noivas, professoras, mulheres com mais de 50 anos..." },
  { id: "q3", fase: 0, tipo: "texto", campo: "ideia_texto", proximo: "q4", contador: "3 de 4", pular: "Não tenho ideia ainda",
    fala: "**Você já tem alguma ideia do que quer vender?** Se não tiver, tudo bem: é para isso que eu estou aqui.",
    placeholder: "Ex.: um e-book de receitas naturais para crianças" },
  { id: "q4", fase: 0, tipo: "pergunta", campo: "formato", contador: "4 de 4",
    fala: "**Qual formato combina mais com você?**",
    opcoes: [["E-book ou guia", "E-book ou guia", "produtos"], ["Desafio de X dias", "Desafio de X dias", "produtos"], ["Minicurso em vídeo", "Minicurso em vídeo", "produtos"], ["Mentoria", "Mentoria", "produtos"], ["A Sócia escolhe", "Me ajude a escolher", "produtos"]] },

  // ---------- PRODUTO
  { id: "produtos", fase: 1, tipo: "ia", ferramenta: "produtos_virais", auto: true, proximo: "plano",
    fala: "Perfeito! Com o que você me contou, estes são **3 infoprodutos que você pode criar**. Cada um resolve uma dor específica e tem um mecanismo único. Escolha o que mais combina com você:" },
  { id: "plano", fase: 1, tipo: "ia", ferramenta: "blueprint", auto: true, proximo: "tem_insta",
    fala: "Ótima escolha! Aqui está o **plano completo do seu produto**: a sua cliente, o método, a estrutura, o layout e o **comando pronto para você criar no Claude**." },

  // ---------- PERFIL
  { id: "tem_insta", fase: 2, tipo: "pergunta", campo: "tem_insta",
    fala: "Agora vamos preparar o seu Instagram para vender esse produto. **Você já tem um perfil?**",
    opcoes: [["sim", "Sim, já tenho", "raio_x"], ["nao", "Ainda não (ou vou criar um novo)", "perfil"]] },
  { id: "raio_x", fase: 2, tipo: "ia", ferramenta: "raio_x", proximo: "perfil", pulavel: true,
    fala: "Me mande uns prints do seu perfil que eu faço um **diagnóstico** antes de ajustar. (Se preferir, pode pular.)" },
  { id: "perfil", fase: 2, tipo: "ia", ferramenta: "ajustes_perfil", auto: true, proximo: "pausa",
    fala: "Estes são os **ajustes do seu Instagram**, tudo apontando para o seu produto:",
    checklist: ["Troquei o nome do perfil", "Troquei a bio", "Ajustei a foto de perfil", "Organizei os destaques"] },
  { id: "pausa", fase: 2, tipo: "pausa", proximo: "funil", botao: "Já criei meu produto",
    fala: "O seu norte está pronto! 🎯\n\nAgora volte para a aula do **Mapa do Infoproduto Viral** e crie o seu produto usando o plano e o comando pronto. Quando o produto estiver pronto, volte aqui: a gente monta o seu **funil de vendas**.",
    checklist: ["Criei o conteúdo do produto no Claude", "Montei o produto (Canva ou gravação)", "Cadastrei o produto na Kiwify"] },

  // ---------- FUNIL
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
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: lanches saudáveis, finanças, rotina" } },
      { id: "carrossel", titulo: "Carrossel viral", desc: "O texto dos 7 slides e a legenda, com pitch no último slide.", carrossel: true, formulas: true,
        campo: { rotulo: "Tema do carrossel (opcional)", placeholder: "Deixe em branco e a Sócia escolhe" } },
      { id: "capas", titulo: "10 capas que param a rolagem", desc: "Ideias de capa nas fórmulas que mais vendem.", formulas: true,
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: lanches saudáveis, finanças, rotina" } },
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
        campo: { rotulo: "Sobre o que é o post?", obrig: true, placeholder: "Ex.: carrossel com 3 receitas para a lancheira" } },
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
