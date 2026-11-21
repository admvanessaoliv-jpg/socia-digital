// =====================================================================
// PAINEL DE FERRAMENTAS DA SÓCIA DIGITAL
// Cada ferramenta tem no máximo 1 campo. O "Meu negócio" (nicho, @ e
// produto) é preenchido uma vez e todas as ferramentas usam.
//   campo.obrig  -> o campo precisa estar preenchido para gerar
//   escolha      -> a resposta vira opções; o clique salva no "Meu negócio"
//   carrossel    -> mostra os slides em cartões de texto
//   pagina       -> permite publicar a página de vendas
// (Os comandos da IA ficam no Supabase, em functions/socia-ia.)
// =====================================================================
window.COMECO = ["nicho", "bio", "carrossel", "ideias_produto", "pagina_vendas"];

window.CATEGORIAS = [
  {
    id: "instagram", titulo: "Instagram", desc: "Arrume a vitrine antes de vender.",
    ferramentas: [
      { id: "nicho", titulo: "Descobrir meu nicho", desc: "Conte o que você viveu ou sabe fazer e receba 3 nichos com a cliente ideal de cada um.", escolha: "nicho", botaoEscolha: "Usar este nicho",
        campo: { rotulo: "O que você já viveu, superou ou sabe fazer?", tipo: "area", obrig: true, placeholder: "Ex.: sou mãe de 3, saí das dívidas, gosto de cozinhar e as amigas sempre me pedem conselho sobre casamento" } },
      { id: "bio", titulo: "Bio e nome do perfil", desc: "3 bios que vendem e 3 nomes de perfil que aparecem na busca." },
      { id: "destaques", titulo: "Destaques", desc: "5 destaques com nome curto e o que colocar em cada um." },
      { id: "fixados", titulo: "3 posts fixados", desc: "Os 3 carrosséis que apresentam você e convertem quem chega no perfil." },
    ],
  },
  {
    id: "conteudo", titulo: "Conteúdo", desc: "Carrosséis no método da Vanessa.",
    ferramentas: [
      { id: "carrossel", titulo: "Carrossel viral", desc: "O texto dos 7 slides e a legenda, com pitch no último slide. Você monta no Canva.", carrossel: true, formulas: true,
        campo: { rotulo: "Tema do carrossel (opcional)", placeholder: "Deixe em branco e a Sócia escolhe. Ex.: Durante 7 noites, ore pela sua casa" } },
      { id: "capas", titulo: "10 capas que param a rolagem", desc: "Ideias de capa nas fórmulas que mais vendem.", formulas: true,
        campo: { rotulo: "Assunto (opcional)", placeholder: "Ex.: finanças, casamento, ansiedade" } },
      { id: "semana", titulo: "Conteúdo da semana", desc: "7 ideias de post, uma para cada dia, já com a capa." },
      { id: "legenda", titulo: "Legenda", desc: "3 legendas curtas para um post seu.",
        campo: { rotulo: "Sobre o que é o post?", obrig: true, placeholder: "Ex.: carrossel sobre 3 orações pela vida financeira" } },
      { id: "stories", titulo: "Sequência de stories", desc: "6 stories com enquete e caixinha para engajar ou vender.",
        campo: { rotulo: "Objetivo ou tema (opcional)", placeholder: "Ex.: aquecer para o lançamento / falar da minha história" } },
    ],
  },
  {
    id: "produto", titulo: "Produto", desc: "O que você vai vender.",
    ferramentas: [
      { id: "ideias_produto", titulo: "Ideias de produto", desc: "3 produtos simples para o seu nicho. Escolha um e ele fica salvo.", escolha: "produto", botaoEscolha: "Usar este produto" },
      { id: "sumario", titulo: "Sumário do produto", desc: "Capítulos ou aulas com o que ensinar em cada um e como criar no Canva.",
        campo: { rotulo: "Qual produto? (opcional)", placeholder: "Deixe em branco para usar o produto do Meu negócio" } },
      { id: "nomes", titulo: "Nome e promessa", desc: "10 nomes e 5 promessas fortes para o seu produto." },
      { id: "bonus", titulo: "Bônus", desc: "5 bônus simples que você cria em 1 dia e que aumentam a vontade de comprar." },
    ],
  },
  {
    id: "vendas", titulo: "Vendas", desc: "Oferta, página e lançamento.",
    ferramentas: [
      { id: "pitch", titulo: "Pitch do último slide", desc: "5 títulos de pitch com promessa forte e o texto do último slide." },
      { id: "pagina_vendas", titulo: "Página de vendas", desc: "A Sócia escreve a página e você publica com o link da Kiwify.", pagina: true },
      { id: "direct", titulo: "Respostas do direct", desc: "O que responder para “está caro”, “vou pensar” e mais." },
      { id: "lancamento", titulo: "Lançamento de 7 dias", desc: "O que postar e falar nos stories, dia a dia." },
    ],
  },
];
