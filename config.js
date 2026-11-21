// =====================================================================
// CONFIGURAÇÃO — preencha com os dados do seu projeto no Supabase
// (Supabase > Project Settings > API)
// Enquanto estiver vazio, o app abre em MODO DEMONSTRAÇÃO.
// =====================================================================
window.CONFIG = {
  SUPABASE_URL: "https://upyeehmrcxeyxxeyfclp.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_UVe3xqMltTCpwUrGebu4GQ_bylT3DDV",
  NOME_CURSO: "Mapa do Infoproduto Viral",
  MENTORA: "Vanessa Oliveira",
  SUPORTE_URL: "",         // ex.: link do seu WhatsApp ou e-mail de suporte
  LINK_COMPRA: "",         // link da Kiwify do curso (aparece na tela de login)
  // Planos de assinatura da Sócia (aparecem quando o acesso está pausado)
  PLANOS: [
    { nome: "Plano Essencial", preco: "R$ 27/mês", criacoes: 60, link: "https://pay.kiwify.com.br/YhNjBdL" },
    { nome: "Plano Completo", preco: "R$ 37/mês", criacoes: 100, link: "https://pay.kiwify.com.br/cC9tZb8" },
  ],
  // Links das aulas do curso (aparece o botão "Assistir à aula" em cada fase quando preenchido)
  AULAS: { clareza: "", produto: "", essencia: "", perfil: "", funil: "" },
};
