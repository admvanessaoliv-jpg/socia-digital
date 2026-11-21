// =====================================================================
// SÓCIA DIGITAL — a JORNADA (funil guiado) e as ferramentas do FUNIL
// Princípio: as técnicas e estratégias são da Vanessa; a essência é da aluna.
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================

// As 5 fases que aparecem no topo da jornada (a chave liga ao link da aula, em config.js)
window.FASES = ["Clareza", "Produto", "Essência", "Perfil", "Funil"];
window.FASES_CHAVE = ["clareza", "produto", "essencia", "perfil", "funil"];

// "O que é isso?": explicações curtas dos termos
window.GLOSSARIO = {
  nicho: ["Nicho", "O assunto e o público que você atende. Ex.: receitas naturais para mães que trabalham fora."],
  persona: ["Cliente ideal (persona)", "O retrato de uma pessoa real que você quer ajudar: rotina, dores e desejos. Você escreve para ELA."],
  mecanismo: ["Mecanismo único", "O seu jeito próprio de resolver a dor, com um nome. É o que explica por que o seu produto funciona quando outras coisas não funcionaram."],
  infoproduto: ["Infoproduto", "Um produto digital com o seu conhecimento: e-book, desafio, minicurso, mentoria."],
  essencia: ["Essência", "No que você acredita, como você fala e o que você nunca faria. As técnicas a gente modela; a essência é só sua, e é ela que gera confiança."],
  funil: ["Funil", "O caminho da pessoa: ela te descobre (atrair), passa a confiar em você (conectar) e compra (vender)."],
  pitch: ["Pitch", "O convite para comprar, no último slide do post: uma promessa forte e “Clique no link da bio”."],
  gancho: ["Gancho", "A primeira frase ou os 3 primeiros segundos: o que faz a pessoa parar de rolar a tela."],
  mockup: ["Mockup", "A imagem do seu produto como se fosse físico (um livro, uma tela de celular). Dá para fazer no Canva."],
  pilares: ["Pilares de conteúdo", "Os 4 ou 5 temas fixos do seu perfil. Eles dão unidade ao que você posta."],
};

// Ferramentas usadas dentro da jornada (não aparecem no painel do funil)
window.FERR_JORNADA = [
  { id: "produtos_virais", titulo: "Seus 3 infoprodutos", desc: "3 produtos que resolvem uma dor específica, com mecanismo único.", escolha: "produto", botaoEscolha: "Quero criar este" },
  { id: "blueprint", titulo: "Plano do seu produto", desc: "Cliente, método, estrutura, layout e o comando para criar no Claude." },
  { id: "manifesto", titulo: "Seu manifesto", desc: "Sua frase de posicionamento, convicções, tom de voz e limites." },
  { id: "raio_x", titulo: "Raio-X do perfil", desc: "Diagnóstico do seu perfil pelos prints.",
    campo: { tipo: "imagens", obrig: true, rotulo: "Seus prints (de 1 a 5)", dica: "Tire print de: 1) topo do perfil (foto, nome, bio, destaques); 2) a grade de posts; 3) Insights: visão geral e os posts com mais alcance." } },
  { id: "ajustes_perfil", titulo: "Ajustes do Instagram", desc: "Nome, bio, foto e destaques para vender o seu produto." },
];

// A conversa, passo a passo
//   boasvindas = escolha do caminho · texto = pergunta aberta · pergunta = botões · multi = vários botões
//   ia = a Sócia cria (auto = cria sozinha ao chegar) · proximoAvancado = para quem já tem perfil/produto
window.JORNADA = [
  { id: "bemvinda", fase: 0, tipo: "boasvindas",
    fala: "Oi! Eu sou a sua **Sócia Digital** ✨\n\nAqui você vai usar as **técnicas e estratégias que funcionam no Instagram**, mas com a **sua essência**. A gente modela o que dá certo; ninguém copia ninguém. É sendo você que o seu público confia e compra.\n\n**Por onde você começa?**",
    opcoes: [["zero", "Estou começando do zero", "q1"], ["avancado", "Já tenho perfil ou produto", "a1"]] },

  // ---------- CLAREZA: 4 perguntas (começando do zero)
  { id: "q1", fase: 0, tipo: "texto", campo: "vivencia", obrig: true, proximo: "q2", contador: "1 de 4",
    fala: "São só 4 perguntas e eu já te mostro 3 produtos que você pode criar.\n\n**O que você já viveu, superou ou sabe fazer que pode ajudar outras pessoas?**",
    placeholder: "Ex.: faço receitas naturais para a minha família; saí de uma dívida de R$ 40 mil; emagreci 15 kg depois da gravidez; faço unhas há 10 anos...",
    exemplo: "“Sou mãe de 2 e há 3 anos parei de comprar lanche pronto. Aprendi a fazer lanches naturais baratos e rápidos, e as mães da escola vivem me pedindo receita.”" },
  { id: "q2", fase: 0, tipo: "pergunta", campo: "publico", contador: "2 de 4",
    fala: "**Para quem você quer falar?**",
    opcoes: [["Mulheres", "Mulheres", "q3"], ["Mães", "Mães", "q3"], ["Casais", "Casais", "q3"], ["Quem quer cuidar da saúde ou emagrecer", "Quem quer cuidar da saúde ou emagrecer", "q3"], ["Quem quer trabalhar com a internet", "Quem quer trabalhar com a internet", "q3"], ["", "Outro público (vou escrever)", "q2b"], ["Ainda não sei", "Ainda não sei", "q3"]] },
  { id: "q2b", fase: 0, tipo: "texto", campo: "publico", obrig: true, proximo: "q3", contador: "2 de 4",
    fala: "**Para quem você quer falar?** Escreva do seu jeito.",
    placeholder: "Ex.: donas de pet, noivas, professoras, mulheres com mais de 50 anos..." },
  { id: "q3", fase: 0, tipo: "texto", campo: "ideia_texto", proximo: "q4", contador: "3 de 4", pular: "Não tenho ideia ainda",
    fala: "**Você já tem alguma ideia do que quer vender?** Se não tiver, tudo bem: é para isso que eu estou aqui.",
    placeholder: "Ex.: um e-book de receitas naturais para crianças" },
  { id: "q4", fase: 0, tipo: "pergunta", campo: "formato", contador: "4 de 4", termos: ["infoproduto"],
    fala: "**Qual formato combina mais com você?**",
    opcoes: [["E-book ou guia", "E-book ou guia", "produtos"], ["Desafio de X dias", "Desafio de X dias", "produtos"], ["Minicurso em vídeo", "Minicurso em vídeo", "produtos"], ["Mentoria", "Mentoria", "produtos"], ["A Sócia escolhe", "Me ajude a escolher", "produtos"]] },

  // ---------- CAMINHO PARA QUEM JÁ TEM PERFIL OU PRODUTO
  { id: "a1", fase: 0, tipo: "texto", campo: "produto", obrig: true, proximo: "a2", contador: "1 de 2",
    fala: "Ótimo, então vamos direto ao que interessa. **Qual é o seu produto (ou o que você quer vender) e que problema ele resolve?**",
    placeholder: "Ex.: E-book “Lancheira Natural em 10 Minutos”: ajuda mães sem tempo a montar lanches saudáveis e baratos" },
  { id: "a2", fase: 0, tipo: "texto", campo: "vivencia", obrig: true, proximo: "a3", contador: "2 de 2", termos: ["nicho"],
    fala: "**Para quem é o seu perfil, e qual é a sua história com esse assunto?**",
    placeholder: "Ex.: falo com mães que trabalham fora. Parei de comprar lanche pronto há 3 anos e criei minhas receitas..." },
  { id: "a3", fase: 0, tipo: "ia", ferramenta: "raio_x", proximo: "e1", pulavel: true,
    fala: "Me mande uns prints do seu perfil que eu faço um **diagnóstico**. (Se preferir, pode pular.)" },

  // ---------- PRODUTO
  { id: "produtos", fase: 1, tipo: "ia", ferramenta: "produtos_virais", auto: true, proximo: "plano", termos: ["mecanismo"],
    fala: "Perfeito! Com o que você me contou, estes são **3 infoprodutos que você pode criar**. Cada um resolve uma dor específica e tem um mecanismo único. Escolha o que mais combina com você:" },
  { id: "plano", fase: 1, tipo: "ia", ferramenta: "blueprint", auto: true, proximo: "e1", termos: ["persona"],
    fala: "Ótima escolha! Aqui está o **plano completo do seu produto**: a sua cliente, o método, a estrutura, o layout e o **comando pronto para você criar no Claude**." },

  // ---------- ESSÊNCIA
  { id: "e1", fase: 2, tipo: "texto", campo: "crenca", obrig: true, proximo: "e2", contador: "1 de 4", termos: ["essencia"],
    fala: "Agora a parte mais importante: **a sua essência**. É ela que faz o seu público confiar em você, e não em outra pessoa do mesmo nicho.\n\n**No que você acredita sobre esse assunto que muita gente faz errado?**",
    placeholder: "Ex.: acredito que comer bem não precisa ser caro nem demorado; o problema é a falta de planejamento, não a falta de dinheiro.",
    exemplo: "“Eu acredito que mãe não precisa escolher entre trabalhar e cuidar da alimentação dos filhos. O que falta não é tempo, é um jeito simples de planejar.”" },
  { id: "e2", fase: 2, tipo: "texto", campo: "limites", proximo: "e3", contador: "2 de 4", pular: "Pular",
    fala: "**O que você nunca faria ou nunca ensinaria, mesmo que vendesse mais?**",
    placeholder: "Ex.: nunca vou prometer emagrecimento rápido; não falo mal de quem pensa diferente; não uso terrorismo para vender." },
  { id: "e3", fase: 2, tipo: "multi", campo: "tom", proximo: "e4", contador: "3 de 4",
    fala: "**Como as pessoas te descrevem?** Pode marcar mais de uma.",
    opcoes: ["Acolhedora", "Direta", "Divertida", "Técnica", "Inspiradora", "Calma", "Firme", "Prática"] },
  { id: "e4", fase: 2, tipo: "texto", campo: "textos_voz", proximo: "manifesto", contador: "4 de 4", pular: "Pular",
    fala: "**Cole 2 ou 3 textos seus**: uma legenda, uma mensagem que você mandou, um áudio transcrito. Assim eu aprendo o seu jeito de falar e escrevo parecido com você.",
    placeholder: "Cole aqui os seus textos..." },
  { id: "manifesto", fase: 2, tipo: "ia", ferramenta: "manifesto", auto: true, proximo: "tem_insta", proximoAvancado: "perfil",
    fala: "Este é o **seu manifesto**: o filtro de tudo que você vai postar. Daqui para frente, tudo que eu criar passa por ele." },

  // ---------- PERFIL
  { id: "tem_insta", fase: 3, tipo: "pergunta", campo: "tem_insta",
    fala: "Agora vamos preparar o seu Instagram para vender esse produto, com a sua essência. **Você já tem um perfil?**",
    opcoes: [["sim", "Sim, já tenho", "raio_x"], ["nao", "Ainda não (ou vou criar um novo)", "perfil"]] },
  { id: "raio_x", fase: 3, tipo: "ia", ferramenta: "raio_x", proximo: "perfil", pulavel: true,
    fala: "Me mande uns prints do seu perfil que eu faço um **diagnóstico** antes de ajustar. (Se preferir, pode pular.)" },
  { id: "perfil", fase: 3, tipo: "ia", ferramenta: "ajustes_perfil", auto: true, proximo: "pausa", proximoAvancado: "funil",
    fala: "Estes são os **ajustes do seu Instagram**, apontando para o seu produto e com a sua voz:",
    checklist: ["Troquei o nome do perfil", "Troquei a bio", "Ajustei a foto de perfil", "Organizei os destaques"] },
  { id: "pausa", fase: 3, tipo: "pausa", proximo: "funil", botao: "Já criei meu produto",
    fala: "O seu norte está pronto! 🎯\n\nAgora volte para a aula do **Mapa do Infoproduto Viral** e crie o seu produto usando o plano e o comando pronto. Quando o produto estiver pronto, volte aqui: a gente monta o seu **funil de vendas**.",
    checklist: ["Criei o conteúdo do produto no Claude", "Montei o produto (Canva ou gravação)", "Cadastrei o produto na Kiwify"] },

  // ---------- FUNIL
  { id: "funil", fase: 4, tipo: "funil", termos: ["funil", "pilares"],
    fala: "Agora sim! 🚀 É hora do **funil**: atrair as pessoas certas, criar conexão e vender, sempre com a sua essência. Comece pela **Estratégia** (seus pilares) e depois siga a missão de cada dia." },
];

// Missão de cada dia da semana (0 = domingo)
window.MISSOES = [
  { pilar: "Planejamento", ferramenta: "calendario_mes", texto: "Domingo é dia de planejar: confira o seu calendário e separe os temas da semana." },
  { pilar: "Convicção", ferramenta: "acredito", texto: "Poste um conteúdo “O que eu acredito”: uma ideia sua, defendida com o porquê." },
  { pilar: "Ensino", ferramenta: "reels", texto: "Grave um Reels ensinando uma coisa prática da sua área." },
  { pilar: "Conexão", ferramenta: "stories", texto: "Faça uma sequência de stories mostrando os bastidores da sua rotina." },
  { pilar: "Ensino", ferramenta: "carrossel", texto: "Poste um carrossel com passo a passo e pitch no último slide." },
  { pilar: "Venda", ferramenta: "pitch", texto: "Dia de venda: um post com promessa forte e “Clique no link da bio”." },
  { pilar: "História", ferramenta: "reels", texto: "Conte uma história sua (antes e depois) num Reels." },
];

// As ferramentas do FUNIL (liberadas depois que o produto existe)
window.CATEGORIAS = [
  {
    id: "estrategia", titulo: "0. Estratégia", desc: "A base: seus pilares, o mês planejado e o que está funcionando.",
    ferramentas: [
      { id: "pilares", titulo: "Meus pilares de conteúdo", desc: "Os 5 temas fixos do seu perfil, nascidos do seu manifesto e do seu produto, com ideias para cada um." },
      { id: "calendario_mes", titulo: "Calendário do mês", desc: "30 dias de conteúdo alternando pilares e formatos, com os dias de venda marcados." },
      { id: "raio_mensal", titulo: "Raio-X do mês", desc: "Mande os prints do Insights todo mês: o que melhorou, o que caiu e o que repetir.",
        campo: { tipo: "imagens", obrig: true, rotulo: "Prints do Insights (de 1 a 5)", dica: "Visão geral dos últimos 30 dias, conteúdos com mais alcance e o topo do perfil." } },
      { id: "analisar_post", titulo: "Analise meu post", desc: "Cole o seu post antes de publicar e receba nota e ajustes de gancho, clareza e pitch.",
        campo: { tipo: "area", obrig: true, rotulo: "Cole o post (capa, texto dos slides ou roteiro e a legenda)", placeholder: "Capa: ...\nSlide 2: ...\nLegenda: ..." } },
    ],
  },
  {
    id: "atrair", titulo: "1. Atrair", desc: "Topo do funil: alcance e seguidores certos.",
    ferramentas: [
      { id: "reels", titulo: "Roteiro de Reels", desc: "Gancho dos 3 primeiros segundos, falas, texto na tela e chamada final.", formulas: true,
        campo: { rotulo: "Tema do Reels (opcional)", placeholder: "Deixe em branco e a Sócia escolhe" } },
      { id: "carrossel", titulo: "Carrossel viral", desc: "O texto dos 7 slides e a legenda, com pitch no último slide.", carrossel: true, formulas: true,
        campo: { rotulo: "Tema do carrossel (opcional)", placeholder: "Deixe em branco e a Sócia escolhe" } },
      { id: "ganchos", titulo: "3 ganchos para testar", desc: "Para o mesmo conteúdo, ganchos em fórmulas diferentes, para ver qual traz mais alcance.", formulas: true,
        campo: { rotulo: "Qual é o conteúdo?", obrig: true, placeholder: "Ex.: 3 lanches naturais para fazer em 10 minutos" } },
      { id: "ideias_reels", titulo: "10 ideias de Reels", desc: "Ganchos prontos, com os 3 mais fortes marcados.",
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: lanches saudáveis, finanças, rotina" } },
      { id: "capas", titulo: "10 capas que param a rolagem", desc: "Ideias de capa nas fórmulas que mais vendem.", formulas: true,
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: lanches saudáveis, finanças, rotina" } },
      { id: "semana", titulo: "Conteúdo da semana", desc: "7 posts, um por dia, misturando Reels e carrossel." },
    ],
  },
  {
    id: "conectar", titulo: "2. Conectar", desc: "Meio do funil: confiança e relacionamento.",
    ferramentas: [
      { id: "acredito", titulo: "O que eu acredito", desc: "Um conteúdo de convicção: uma ideia sua, defendida com o porquê. É o que mais cria vínculo.",
        campo: { rotulo: "Sobre o quê? (opcional)", placeholder: "Deixe em branco para usar uma convicção do seu manifesto" } },
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
