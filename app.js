// =====================================================================
// SÓCIA DIGITAL — app principal
// =====================================================================
(function () {
  "use strict";
  const C = window.CONFIG || {};
  const CATS = window.CATEGORIAS || [];
  const JORNADA = window.JORNADA || [], FASES = window.FASES || [];
  const DEMO = !C.SUPABASE_URL || !C.SUPABASE_ANON_KEY;
  const $app = document.getElementById("app");

  // Todas as ferramentas, por id
  const FERR = {};
  CATS.forEach((c) => c.ferramentas.forEach((f) => (FERR[f.id] = { ...f, cat: c.id, catTitulo: c.titulo })));
  (window.FERR_JORNADA || []).forEach((f) => (FERR[f.id] = { ...f, cat: "jornada", catTitulo: "Jornada" }));
  const ICONE_CAT = {};

  let sb = null;
  let usuaria = null; // { id, email }
  let perfil = { nome: "", email: "" };
  let dados = novosDados();
  let uso = { hoje: 0, limite: 15 };
  const gerando = {};
  const erros = {};
  let chatEnviando = false;
  let modoRecuperacao = false;
  let confirmarReset = false;
  let prints = [];
  let espiarFunil = false;
  const autoFeito = new Set();
  // Quando as respostas da Clareza mudam, os produtos e o plano antigos deixam de valer
  const DEPENDE = { produtos_virais: ["blueprint", "ajustes_perfil"], blueprint: ["ajustes_perfil"] };
  const DEP_CAMPO = {
    vivencia: ["produtos_virais", "blueprint", "manifesto", "ajustes_perfil"], publico: ["produtos_virais", "blueprint", "manifesto", "ajustes_perfil"],
    ideia_texto: ["produtos_virais", "blueprint", "manifesto", "ajustes_perfil"], formato: ["produtos_virais", "blueprint", "manifesto", "ajustes_perfil"],
    produto: ["manifesto", "ajustes_perfil"], crenca: ["manifesto", "ajustes_perfil"], limites: ["manifesto", "ajustes_perfil"],
    tom: ["manifesto", "ajustes_perfil"], textos_voz: ["manifesto", "ajustes_perfil"],
  };
  const proxDe = (p) => (p.proximoAvancado && dados.respostas.caminho === "avancado" ? p.proximoAvancado : p.proximo);
  function limparDepois(ids) {
    ids.forEach((id) => { delete dados.saidas[id]; autoFeito.delete(id); });
  } // imagens do Raio-X (ficam só na tela, não são salvas)


  function novosDados() { return { respostas: {}, saidas: {}, checks: {}, chat: [], jornada: { passo: "bemvinda", trilha: [], funil: false } }; }
  function normalizar(d) {
    const n = novosDados();
    if (d && typeof d === "object") Object.keys(n).forEach((k) => { if (d[k] != null) n[k] = d[k]; });
    if (!n.jornada || !(window.JORNADA || []).some((p) => p.id === n.jornada.passo)) n.jornada = { passo: "bemvinda", trilha: [], funil: !!n.jornada?.funil };
    return n;
  }

  // ------------------------------------------------------------------ ícones
  const I = {
    casa: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/></svg>',
    brilho: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
    pasta: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    pessoa: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    calendario: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    lapis: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    lista: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
    copiar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
    baixar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    expandir: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    enviar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    seta: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    voltar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    livro: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M9 7h6"/></svg>',
    sair: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"/></svg>',
  };
  const ICONE_ETAPA = { 1: I.pessoa, 2: I.pessoa, 3: I.lapis, 4: I.brilho, 5: I.lapis, 6: I.lista, 7: I.calendario, 8: I.brilho };

  Object.assign(ICONE_CAT, { estrategia: I.lista, jornada: I.pessoa, atrair: I.calendario, conectar: I.chat, vender: I.brilho });

  // ------------------------------------------------------------------ utilidades
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const primeiroNome = () => (perfil.nome || "").trim().split(/\s+/)[0] || "querida";
  const hojeSP = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const dataBR = (iso) => { try { return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("ver");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("ver"), 2600);
  }

  function md(texto) {
    const inl = (s) => esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*\w])\*(?!\s)([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
    const linhas = String(texto || "").replace(/\r/g, "").split("\n");
    let html = "", lista = null, par = [], cod = null;
    const fecharPar = () => { if (par.length) { html += `<p>${par.join("<br>")}</p>`; par = []; } };
    const fecharLista = () => { if (lista) { html += `</${lista}>`; lista = null; } };
    for (const bruta of linhas) {
      const l = bruta.trim();
      let m;
      if (/^```/.test(l)) {
        if (cod === null) { fecharPar(); fecharLista(); cod = []; }
        else {
          html += `<div class="bloco-cod"><div class="cab"><span>Comando pronto</span><button class="btn-leve" data-acao="copiar-bloco">${I.copiar} Copiar comando</button></div><pre>${esc(cod.join("\n").trim())}</pre></div>`;
          cod = null;
        }
        continue;
      }
      if (cod !== null) { cod.push(bruta); continue; }
      if (!l) { fecharPar(); fecharLista(); continue; }
      if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
        fecharPar(); fecharLista();
        const n = m[1].length <= 2 ? 2 : m[1].length;
        html += `<h${n}>${inl(m[2])}</h${n}>`; continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(l)) { fecharPar(); fecharLista(); html += "<hr>"; continue; }
      if ((m = l.match(/^[-*•]\s+(.*)$/))) {
        fecharPar(); if (lista !== "ul") { fecharLista(); html += "<ul>"; lista = "ul"; }
        html += `<li>${inl(m[1])}</li>`; continue;
      }
      if ((m = l.match(/^\d+[.)]\s+(.*)$/))) {
        fecharPar(); if (lista !== "ol") { fecharLista(); html += "<ol>"; lista = "ol"; }
        html += `<li>${inl(m[1])}</li>`; continue;
      }
      if ((m = l.match(/^>\s?(.*)$/))) { fecharPar(); fecharLista(); html += `<blockquote>${inl(m[1])}</blockquote>`; continue; }
      fecharLista(); par.push(inl(l));
    }
    if (cod !== null) html += `<div class="bloco-cod"><div class="cab"><span>Comando pronto</span><button class="btn-leve" data-acao="copiar-bloco">${I.copiar} Copiar comando</button></div><pre>${esc(cod.join("\n").trim())}</pre></div>`;
    fecharPar(); fecharLista();
    return `<div class="md">${html}</div>`;
  }

  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); }
    catch {
      const t = document.createElement("textarea"); t.value = texto; document.body.appendChild(t);
      t.select(); document.execCommand("copy"); t.remove();
    }
    toast("Copiado! ✨");
  }
  function baixar(nome, texto) {
    const url = URL.createObjectURL(new Blob([texto], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = nome + ".txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ------------------------------------------------------------------ salvar
  let timerSalvar = null;
  function salvar() { clearTimeout(timerSalvar); timerSalvar = setTimeout(salvarAgora, 700); }
  async function salvarAgora() {
    clearTimeout(timerSalvar);
    if (DEMO) { try { localStorage.setItem("sd_demo", JSON.stringify(dados)); } catch {} return; }
    if (!usuaria) return;
    const { error } = await sb.from("projetos").upsert({ user_id: usuaria.id, dados, atualizado_em: new Date().toISOString() });
    if (error) { console.error(error); toast("Não consegui salvar. Verifique sua internet."); }
  }

  // ------------------------------------------------------------------ IA
  async function chamarIA(corpo) {
    if (DEMO) {
      await new Promise((r) => setTimeout(r, 1500));
      uso.hoje++;
      return demoTexto(corpo);
    }
    await salvarAgora(); // a IA lê o projeto direto do banco
    const { data } = await sb.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
    const r = await fetch(`${C.SUPABASE_URL}/functions/v1/socia-ia`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, apikey: C.SUPABASE_ANON_KEY },
      body: JSON.stringify(corpo),
    });
    let j = {};
    try { j = await r.json(); } catch {}
    if (!r.ok) throw new Error(j.erro || "Não consegui falar com a Sócia agora. Tente de novo.");
    console.info("Sócia respondeu:", r.status, j);
    if (!String(j.texto || "").trim()) throw new Error("A Sócia respondeu vazio. Tente de novo em alguns segundos.");
    if (j.usadosHoje) uso.hoje = j.usadosHoje;
    if (j.limite) uso.limite = j.limite;
    return j.texto || "";
  }

  function demoTexto(corpo) {
    if (corpo.ferramenta === "chat") {
      return `## Que bom que você perguntou, ${primeiroNome()}!\n\nEste é o **modo demonstração**: quando o app estiver ligado ao Supabase, aqui vai aparecer a resposta real da Sócia, usando o seu nicho e o seu produto.\n\n- Ela lembra do seu nicho, da sua cliente e da sua oferta\n- Responde dúvidas sobre conteúdo, preço, Kiwify e lançamento\n- Cria textos na hora\n\nEscolha uma ferramenta no Início e teste.`;
    }
    if (corpo.ferramenta === "persona") return "## Quem é ela\nAna, 34 anos, mãe de 2, trabalha fora e chega exausta. (Exemplo do modo demonstração.)\n## O que ela sente\n- “Eu não dou conta de tudo”\n## O que ela deseja\n- Paz em casa";
    if (corpo.ferramenta === "ajustes_perfil") return "## Nome do perfil\n- Ana Souza | Rotina para Mães\n## Bio\n- Para a mãe que vive cansada / Receitas naturais em 20 minutos / 👇🏻 Comece aqui\n(Exemplo do modo demonstração.)";
    if (corpo.ferramenta === "blueprint") return "## O produto\n⭐ 30 Receitas Naturais para Lancheira: e-book com cardápio.\n## O método e o mecanismo único\nMétodo Lancheira em 10 Minutos: Planejar, Preparar, Montar.\n## Estrutura completa\n1. Noite 1: ...\n## Layout e diagramação\nCores #F4EDE4, #2F5D50, #D9B26F.\n## Comando para criar no Claude\n```\nVocê é uma especialista em receitas naturais... (exemplo do modo demonstração)\n```";
    if (corpo.ferramenta === "nicho" || corpo.ferramenta === "ideias_produto" || corpo.ferramenta === "analisar_ideia" || corpo.ferramenta === "produtos_virais") {
      const n = !["ideias_produto", "produtos_virais"].includes(corpo.ferramenta) ? ["Mães que querem lanches naturais", "Mulheres que querem desinchar", "Famílias que gastam muito no mercado"] : ["30 Receitas Naturais para Lancheira", "Desafio 7 Dias Sem Açúcar", "Minicurso Marmita da Semana em 2 Horas"];
      return `Este é um exemplo do modo demonstração.\n\n${n.map((t, i) => `### OPÇÃO ${i + 1}: ${t}\n**Para quem:** exemplo de cliente.\n**A dor que você resolve:** exemplo de dor.\n**Por que você:** exemplo.`).join("\n\n")}\n\n## Minha recomendação\nComece pela opção 1: é a que mais combina com a sua história.`;
    }
    if (corpo.ferramenta === "raio_x") {
      return `## Nota do perfil: 6/10\nExemplo do modo demonstração (${(corpo.imagens || []).length} print(s) recebido(s)). Com a IA ligada, a Sócia lê os seus prints de verdade.\n\n## O que está travando\n- A bio não diz para quem é nem qual a promessa\n- As capas não usam as fórmulas que param a rolagem\n\n## O que está funcionando\n- Os posts com passo a passo tiveram mais alcance\n\n## Ajustes de hoje\n- Nova bio...\n\n## Conteúdos da semana\n- Carrossel: Durante 7 noites...`;
    }
    if (corpo.ferramenta === "carrossel") {
      const sl = [["Durante 7 noites, faça isto antes de dormir", "e veja a sua casa mudar"], ["Desligue o celular 30 minutos antes", "A sua mente precisa de silêncio para descansar de verdade."], ["Escreva 3 coisas boas do dia", "Gratidão muda o foco do que falta para o que você já tem."], ["Planeje a lancheira de amanhã", "Separe as frutas e os potes antes de dormir."], ["Prepare o dia seguinte", "Separe a roupa e a lista: amanhã começa mais leve."], ["Durma no mesmo horário", "Rotina simples é o que sustenta a mudança."], ["Quer a jornada completa de 21 noites?", "Está tudo no meu guia. Clique no link da bio."]];
      return sl.map(([t, x], i) => `### SLIDE ${i + 1}\nTÍTULO: ${t}\nTEXTO: ${x}`).join("\n") + "\n### LEGENDA\nSalve este post e comece hoje à noite. Qual dessas você vai fazer primeiro? #rotina #fé #mulhercristã";
    }
    if (corpo.ferramenta === "pagina_vendas") {
      return "### TITULO\n21 noites para dormir em paz e acordar com direção\n### SUBTITULO\nUm guia simples para mulheres cansadas de viver no automático.\n### DOR\nVocê deita exausta e a mente não para.\n### VIRADA\nCom pequenos passos por noite, sua rotina muda.\n### CONTEUDO\n- 21 noites guiadas\n- Exercícios simples\n### BONUS\n- Checklist da noite\n### SOBRE\n[SUA HISTÓRIA AQUI]\n### GARANTIA\n7 dias de garantia.\n### PRECO\nR$ 29 à vista ou em até 3x.\n### FAQ\n**Como recebo?**\nPor e-mail, na hora.\n### CHAMADA\nSua próxima noite pode ser diferente.";
    }
    const f = FERR[corpo.ferramenta] || { titulo: "Material" };
    return `## ${f.titulo}\n\nEste é um **exemplo do modo demonstração**. Com o Supabase e a chave da IA configurados, a Sócia cria aqui o material completo para o seu nicho${corpo.extra ? ` sobre *${corpo.extra}*` : ""}, no método da Vanessa, pronto para copiar.\n\n> Tudo fica salvo em **Meus materiais**.`;
  }

  async function gerar(id) {
    if (gerando[id] || bloqueio(id)) return;
    const f = FERR[id];
    const extra = f.campo ? (dados.respostas["x_" + id] || "").trim() : "";
    gerando[id] = true; delete erros[id]; atualizarFerr(id);
    try {
      if (id === "ajustes_perfil" && extra) dados.respostas.arroba = extra;
      const corpo = { ferramenta: id, extra };
      if (f.campo?.tipo === "imagens") corpo.imagens = prints.map((p) => ({ media_type: "image/jpeg", data: p.data }));
      const texto = await chamarIA(corpo);
      dados.saidas[id] = { texto, em: new Date().toISOString(), extra };
      if (f.carrossel) Object.assign(dados.saidas[id], lerSlides(texto));
      await salvarAgora();
    } catch (e) {
      erros[id] = e.message;
    }
    gerando[id] = false;
    atualizarFerr(id);
  }

  async function enviarChat() {
    const campo = document.getElementById("chat-texto");
    const msg = (campo?.value || "").trim();
    if (!msg || chatEnviando) return;
    const historico = dados.chat.slice(-10);
    dados.chat.push({ role: "user", content: msg });
    campo.value = ""; chatEnviando = true; render();
    try {
      const texto = await chamarIA({ ferramenta: "chat", mensagem: msg, historico });
      dados.chat.push({ role: "assistant", content: texto });
      dados.chat = dados.chat.slice(-40);
      salvar();
    } catch (e) {
      dados.chat.pop();
      toast(e.message);
      chatEnviando = false; render();
      const c = document.getElementById("chat-texto"); if (c) c.value = msg;
      return;
    }
    chatEnviando = false; render();
  }

  // ------------------------------------------------------------------ telas de acesso
  function telaLogin(msg) {
    $app.innerHTML = `
    <div class="login">
      <section class="login-arte">
        <div class="topo"><div class="marca-sd">SD</div><span>${esc(C.NOME_CURSO)}</span></div>
        <div>
          <h1>Seu negócio digital, <em>do zero</em> até a publicação.</h1>
          <p>A Sócia Digital caminha com você em cada etapa: descobrir seu dom, criar seu produto, montar a oferta, viralizar no Instagram e lançar.</p>
        </div>
        <div class="rodape">Um método de ${esc(C.MENTORA)}</div>
      </section>
      <section class="login-form">
        <form id="f-login">
          <div class="olho">Área da aluna</div>
          <h2>Bem-vinda de volta</h2>
          <p class="sub">Entre com o e-mail que você usou na compra.</p>
          ${msg ? `<div class="erro-ia" style="border-radius:12px;margin-bottom:16px">${esc(msg)}</div>` : ""}
          <div class="campo"><label for="email">E-mail</label><input class="input" id="email" type="email" autocomplete="email" ${DEMO ? "" : "required"}></div>
          <div class="campo"><label for="senha">Senha</label><input class="input" id="senha" type="password" autocomplete="current-password" ${DEMO ? "" : "required"}></div>
          <button class="btn btn-pri btn-bloco" type="submit">Entrar ${I.seta}</button>
          <div class="links"><a href="#" data-acao="esqueci">Esqueci minha senha</a>${C.LINK_COMPRA ? `<a href="${esc(C.LINK_COMPRA)}" target="_blank" rel="noopener">Quero acesso</a>` : ""}</div>
          ${DEMO ? `<div class="aviso-demo"><b>Modo demonstração.</b> Preencha o arquivo <code>js/config.js</code> com os dados do Supabase para ligar o login real. Clique em Entrar com qualquer e-mail para ver o app.</div>` : ""}
        </form>
      </section>
    </div>`;
    document.getElementById("f-login").onsubmit = async (ev) => {
      ev.preventDefault();
      const btn = ev.target.querySelector("button"); btn.disabled = true; btn.textContent = "Entrando...";
      if (DEMO) { iniciarDemo(); return; }
      const { error } = await sb.auth.signInWithPassword({
        email: document.getElementById("email").value.trim(), password: document.getElementById("senha").value,
      });
      if (error) return telaLogin("E-mail ou senha incorretos.");
      await carregarTudo();
    };
  }

  function telaEsqueci(msg) {
    $app.innerHTML = `<div class="login"><section class="login-arte"><div class="topo"><div class="marca-sd">SD</div><span>${esc(C.NOME_CURSO)}</span></div><div><h1>Vamos <em>recuperar</em> seu acesso.</h1></div><div class="rodape">Um método de ${esc(C.MENTORA)}</div></section>
    <section class="login-form"><form id="f-esq"><h2>Esqueci minha senha</h2><p class="sub">Enviaremos um link para você criar uma nova senha.</p>
    ${msg ? `<div class="aviso-demo" style="margin:0 0 16px">${esc(msg)}</div>` : ""}
    <div class="campo"><label for="email">E-mail</label><input class="input" id="email" type="email" required></div>
    <button class="btn btn-pri btn-bloco" type="submit">Enviar link</button>
    <div class="links"><a href="#" data-acao="login">Voltar para o login</a></div></form></section></div>`;
    document.getElementById("f-esq").onsubmit = async (ev) => {
      ev.preventDefault();
      if (DEMO) return telaEsqueci("No modo demonstração não enviamos e-mails.");
      await sb.auth.resetPasswordForEmail(document.getElementById("email").value.trim(), { redirectTo: location.origin + location.pathname + "?definir-senha=1" });
      telaEsqueci("Pronto! Se este e-mail tiver acesso, você vai receber o link em alguns minutos. Olhe também o spam.");
    };
  }

  function telaDefinirSenha(msg) {
    $app.innerHTML = `<div class="login"><section class="login-arte"><div class="topo"><div class="marca-sd">SD</div><span>${esc(C.NOME_CURSO)}</span></div><div><h1>Que alegria ter você <em>aqui</em>.</h1><p>Crie sua senha para entrar na Sócia Digital sempre que quiser.</p></div><div class="rodape">Um método de ${esc(C.MENTORA)}</div></section>
    <section class="login-form"><form id="f-senha"><h2>Crie sua senha</h2><p class="sub">Use pelo menos 6 caracteres.</p>
    ${msg ? `<div class="erro-ia" style="border-radius:12px;margin-bottom:16px">${esc(msg)}</div>` : ""}
    <div class="campo"><label for="s1">Nova senha</label><input class="input" id="s1" type="password" minlength="6" required></div>
    <div class="campo"><label for="s2">Repita a senha</label><input class="input" id="s2" type="password" minlength="6" required></div>
    <button class="btn btn-pri btn-bloco" type="submit">Salvar e entrar ${I.seta}</button></form></section></div>`;
    document.getElementById("f-senha").onsubmit = async (ev) => {
      ev.preventDefault();
      const s1 = document.getElementById("s1").value, s2 = document.getElementById("s2").value;
      if (s1 !== s2) return telaDefinirSenha("As senhas não são iguais.");
      const { error } = await sb.auth.updateUser({ password: s1 });
      if (error) return telaDefinirSenha("Não consegui salvar: " + error.message);
      history.replaceState(null, "", location.pathname + "#/inicio");
      modoRecuperacao = false;
      await carregarTudo();
    };
  }

  function telaBloqueada() {
    $app.innerHTML = `<div class="login"><section class="login-arte"><div class="topo"><div class="marca-sd">SD</div><span>${esc(C.NOME_CURSO)}</span></div><div><h1>Seu acesso está <em>pausado</em>.</h1></div><div class="rodape"></div></section>
    <section class="login-form"><div style="max-width:380px"><h2>Acesso inativo</h2><p class="sub">Se você acha que isso é um engano, fale com o suporte.</p>
    ${C.SUPORTE_URL ? `<a class="btn btn-pri" href="${esc(C.SUPORTE_URL)}" target="_blank" rel="noopener">Falar com o suporte</a>` : ""}
    <div class="links"><a href="#" data-acao="sair">Sair</a></div></div></section></div>`;
  }

  // ------------------------------------------------------------------ estrutura do app
  function rota() {
    const h = location.hash.replace(/^#\/?/, "");
    const [nome, arg] = h.split("/");
    return { nome: nome || "inicio", arg };
  }

  function lateral(r) {
    const item = (href, ic, txt, ativo) => `<a class="lat-item ${ativo ? "ativo" : ""}" href="#/${href}">${ic}<span>${txt}</span></a>`;
    const grupos = !dados.jornada.funil ? "" : `<div class="lat-sec">Ferramentas do funil</div>` + CATS.map((c) => c.ferramentas.map((f) => {
      const ativo = r.nome === "f" && r.arg === f.id, feito = !!dados.saidas[f.id];
      return `<a class="lat-item pq ${ativo ? "ativo" : ""}" href="#/f/${f.id}"><span class="ponto ${feito ? "feito" : ""}"></span><span>${esc(f.titulo)}</span></a>`;
    }).join("")).join("");
    const fase = FASES[passoAtual().fase] || "";
    return `
    <aside class="lateral">
      <div class="lat-topo"><div class="marca-sd">SD</div><div><b>Sócia Digital</b><small>${esc(C.NOME_CURSO)}</small><div class="status-ia"><i></i> IA online</div></div></div>
      <nav class="lat-nav">
        ${item("inicio", I.casa, `Minha jornada <small class="lat-fase">${fase}</small>`, r.nome === "inicio")}
        ${item("funil", I.lista, `Funil de vendas${dados.jornada.funil ? "" : " 🔒"}`, r.nome === "funil")}
        ${item("socia", I.chat, "Fale com a Sócia", r.nome === "socia")}
        ${item("materiais", I.pasta, "Meus materiais", r.nome === "materiais")}
        ${grupos}
      </nav>
      <div class="lat-rodape">
        <div class="avatar">${esc(primeiroNome().charAt(0).toUpperCase())}</div>
        <a class="quem" href="#/conta"><b>${esc(perfil.nome || "Minha conta")}</b><small>Minha conta</small></a>
        <button class="btn-leve" data-acao="sair" title="Sair">${I.sair}</button>
      </div>
    </aside>`;
  }

  function render() {
    if (!usuaria) return;
    const r = rota();
    let corpo = "";
    if (r.nome === "f") corpo = viewFerramenta(r.arg);
    else if (r.nome === "socia") corpo = viewChat();
    else if (r.nome === "materiais") corpo = viewMateriais();
    else if (r.nome === "conta") corpo = viewConta();
    else if (r.nome === "funil") corpo = viewFunil();
    else corpo = viewJornada();
    $app.innerHTML = `
    <div class="casca" id="casca">
      ${lateral(r)}
      <div class="veu" data-acao="fechar-menu"></div>
      <main class="principal">
        <div class="barra-movel"><button data-acao="menu" aria-label="Abrir menu">${I.menu}</button><div class="marca-sd">SD</div><b>Sócia Digital</b></div>
        <div class="conteudo">${corpo}</div>
      </main>
    </div>`;
    if (r.nome === "inicio") {
      const p = passoAtual();
      if (p.tipo === "ia" && p.auto && !dados.saidas[p.ferramenta] && !gerando[p.ferramenta] && !erros[p.ferramenta] && !autoFeito.has(p.ferramenta)) {
        autoFeito.add(p.ferramenta); gerar(p.ferramenta);
      }
    }
    if (r.nome === "socia") {
      const l = document.getElementById("chat-lista"); if (l) l.scrollTop = l.scrollHeight;
      const t = document.getElementById("chat-texto"); if (t && !chatEnviando && window.innerWidth > 920) t.focus();
    }
  }

  // ------------------------------------------------------------------ Início (painel)
  function cardFerr(f) {
    f = FERR[f.id] || f;
    const feito = !!dados.saidas[f.id];
    return `<a class="atalho ${feito ? "feito" : ""}" href="#/f/${f.id}"><span class="ic">${ICONE_CAT[f.cat] || I.brilho}</span><b>${esc(f.titulo)}</b><span>${esc(f.desc)}</span>${feito ? `<span class="selo-ok">${I.check} criado</span>` : ""}</a>`;
  }

  // Lê as "### OPÇÃO N: nome" da resposta da IA
  function opcoes(texto) {
    const partes = String(texto || "").split(/^#{2,4}\s*\**\s*OP[ÇC][ÃA]O\s*\d+\s*[:\-–.]\s*/mi);
    if (partes.length < 3) return null;
    let rec = "";
    const ops = partes.slice(1).map((p) => {
      const linhas = p.split("\n");
      const titulo = linhas.shift().replace(/[*#]/g, "").trim();
      let corpo = linhas.join("\n");
      const k = corpo.search(/^##\s/m);
      if (k >= 0) { rec += corpo.slice(k); corpo = corpo.slice(0, k); }
      return { titulo, corpo: corpo.trim() };
    });
    return { intro: partes[0].trim(), ops, rec: rec.trim() };
  }

  function bloqueio(id) {
    const f = FERR[id];
    if (f?.campo?.tipo === "imagens") return prints.length ? "" : "Adicione pelo menos 1 print para liberar.";
    if (f?.pagina && (!String(dados.respostas.produto || "").trim() || !String(dados.respostas.preco || "").trim())) return "Preencha o nome do produto e o preço para liberar.";
    if (f?.campo?.obrig && !String(dados.respostas["x_" + id] || "").trim()) return "Preencha o campo acima para liberar.";
    return "";
  }
  function atualizarBotoes() {
    const r = rota();
    if (r.nome === "inicio" && passoAtual().tipo === "texto") {
      const p = passoAtual(), b = document.getElementById("b-passo");
      if (b) b.disabled = !!(p.obrig && !String(dados.respostas[p.campo] || "").trim());
      return;
    }
    const id = r.nome === "f" ? r.arg : (r.nome === "inicio" ? passoAtual().ferramenta : null);
    if (!id || !FERR[id] || gerando[id]) return;
    const b = document.getElementById("b-" + id), m = document.getElementById("m-" + id), motivo = bloqueio(id);
    if (b) b.disabled = !!motivo;
    if (m) m.textContent = motivo;
  }

  const FRASES = ["A Sócia está pensando na sua cliente ideal...", "Organizando as ideias com carinho...", "Escrevendo na sua voz...", "Quase pronto, só os últimos detalhes..."];

  function resultadoHTML(id) {
    const s = dados.saidas[id];
    if (gerando[id]) return `<div class="ferr"><div class="ferr-res"><div class="pensando"><span class="pontos"><i></i><i></i><i></i></span><span data-frase>${FRASES[0]}</span></div></div></div>`;
    if (!s) return "";
    return `<div class="ferr"><div class="ferr-res"><div class="ferr-acoes"><span class="quando">Criado em ${dataBR(s.em)}${s.extra ? ` · ${esc(s.extra)}` : ""}</span>
        <button class="btn-leve" data-acao="copiar" data-id="${id}">${I.copiar} Copiar</button>
        <button class="btn-leve" data-acao="baixar" data-id="${id}">${I.baixar} Baixar</button>
        <button class="btn-leve" data-acao="expandir" data-id="${id}">${I.expandir} Ver tudo</button></div>
        ${corpoSaida(id, s)}</div></div>`;
  }
  function corpoSaida(id, s) {
    const f = FERR[id];
    if (f.carrossel) { const h = carrosselHTML(id, s); if (h) return h; }
    if (f.pagina) { const h = paginaHTML(id, s); if (h) return h; }
    const o = f.escolha ? opcoes(s.texto) : null;
    if (!o) return `<div class="texto-ia" id="t-${id}">${md(s.texto)}</div>`;
    const escolhido = dados.respostas[f.escolha];
    return `<div class="texto-ia aberto" id="t-${id}">${o.intro ? md(o.intro) : ""}
      <div class="opcoes">${o.ops.map((op, i) => {
        const sel = escolhido === op.titulo;
        return `<div class="opcao ${sel ? "sel" : ""}"><div class="op-tit"><span class="passo">${i + 1}</span><b>${esc(op.titulo)}</b></div>${md(op.corpo)}
          <button class="btn ${sel ? "btn-pri" : "btn-sec"} btn-bloco" data-acao="escolher" data-id="${id}" data-i="${i}">${sel ? `${I.check} Escolhido` : esc(f.botaoEscolha || "Escolher")}</button></div>`;
      }).join("")}</div>${o.rec ? md(o.rec) : ""}</div>`;
  }


  // ================================================================ CARROSSEL
  function lerSlides(texto) {
    const t = String(texto || "");
    const partes = t.split(/^#{2,4}\s*SLIDE\s*(\d+)[^\n]*$/mi);
    const slides = [];
    for (let k = 1; k < partes.length; k += 2) {
      let corpo = partes[k + 1] || "";
      const li = corpo.search(/^#{2,4}\s*LEGENDA/mi);
      if (li >= 0) corpo = corpo.slice(0, li);
      const tm = corpo.match(/T[ÍI]TULO\s*:\s*(.*)/i), xm = corpo.match(/TEXTO\s*:\s*([\s\S]*)/i);
      const limpa = (v) => String(v || "").replace(/\*\*/g, "").replace(/^\(.*\)$/s, "").trim();
      slides.push({ titulo: limpa(tm && tm[1]), texto: limpa(xm && xm[1]) });
    }
    const lm = t.match(/^#{2,4}\s*LEGENDA[^\n]*\n([\s\S]*)$/mi);
    return { slides, legenda: lm ? lm[1].trim() : "" };
  }

  const textoSlides = (s) => s.slides.map((sl, i) => `SLIDE ${i + 1}\n${sl.titulo}${sl.texto ? "\n" + sl.texto : ""}`).join("\n\n") + (s.legenda ? `\n\nLEGENDA\n${s.legenda}` : "");

  function carrosselHTML(id, s) {
    if (!s.slides) Object.assign(s, lerSlides(s.texto));
    if (!s.slides || s.slides.length < 2) return "";
    const n = s.slides.length;
    return `<div class="texto-ia aberto">
      <div class="carr-barra"><button class="btn btn-pri" data-acao="carr-copiar" data-id="${id}">${I.copiar} Copiar o carrossel inteiro</button><span class="dica-cel" style="margin:0">Cole no Canva e monte com a sua identidade visual.</span></div>
      <div class="slides-txt">${s.slides.map((sl, i) => `<div class="slide-txt ${i === 0 ? "capa" : i === n - 1 ? "pitch" : ""}">
        <div class="slide-cab"><span class="passo">${i + 1}</span><small>${i === 0 ? "Capa" : i === n - 1 ? "Último slide" : "Slide"}</small><button class="btn-leve" data-acao="slide-copiar" data-id="${id}" data-i="${i}">${I.copiar}</button></div>
        <b>${esc(sl.titulo)}</b>${sl.texto ? `<p>${esc(sl.texto)}</p>` : ""}</div>`).join("")}</div>
      ${s.legenda ? `<div class="legenda"><div class="legenda-cab"><b>Legenda</b><button class="btn-leve" data-acao="carr-legenda" data-id="${id}">${I.copiar} Copiar legenda</button></div><p>${esc(s.legenda).replace(/\n/g, "<br>")}</p></div>` : ""}
    </div>`;
  }

  // ================================================================ PÁGINA DE VENDAS
  const CORES_PAGINA = { rosa: "Rosa elegante", verde: "Verde", azul: "Azul", dourado: "Dourado", lilas: "Lilás" };
  function lerSecoes(texto) {
    const out = {}, partes = String(texto || "").split(/^\s*#{1,4}\s*\**\s*([A-Za-zÀ-ú]+)\s*\**\s*:?\s*$/m);
    for (let k = 1; k < partes.length; k += 2) {
      const nome = partes[k].normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
      out[nome] = (partes[k + 1] || "").trim();
    }
    return out;
  }
  const urlPagina = (slug) => location.origin + location.pathname.replace(/[^/]*$/, "") + "pagina.html?p=" + encodeURIComponent(slug);

  function paginaHTML(id, s) {
    const sec = lerSecoes(s.texto);
    if (!sec.TITULO) return `<div class="texto-ia aberto"><div class="erro-ia" style="border-radius:12px;margin-bottom:14px">A Sócia escreveu a página num formato que eu não consegui ler para publicar. Clique em <b>Gerar de novo</b> no topo.</div>${md(s.texto)}</div>`;
    const slug = dados.respostas.pagina_slug, cor = dados.respostas.cor_pagina || "rosa";
    return `<div class="texto-ia aberto">
      <div class="pag-prev"><small class="olho">Prévia do topo da página</small><h3>${esc(sec.TITULO)}</h3><p>${esc(sec.SUBTITULO || "")}</p></div>
      <details class="pag-editar"><summary>Ver ou editar o texto completo da página</summary>
        <textarea class="area" data-pagina-texto="${id}" rows="16">${esc(s.texto)}</textarea>
        <small class="dica-cel">Mantenha os marcadores que começam com ### (TITULO, DOR, CONTEUDO...).</small></details>
      <div class="pub">
        <button class="btn btn-pri" data-acao="publicar-pagina" data-id="${id}">${I.brilho} ${slug ? "Atualizar minha página" : "Publicar minha página"}</button>
        ${slug ? `<div class="pag-link"><b>${I.check} Sua página está no ar:</b><input class="input" readonly value="${esc(urlPagina(slug))}" aria-label="Link da página"><div class="linha-acoes"><button class="btn btn-sec" data-acao="copiar-link-pagina">${I.copiar} Copiar link</button><a class="btn btn-sec" href="${esc(urlPagina(slug))}" target="_blank" rel="noopener">Abrir página ${I.seta}</a></div><small class="dica-cel">Coloque este link na sua bio do Instagram.</small></div>` : ""}
      </div></div>`;
  }

  function dadosPaginaHTML() {
    const r = dados.respostas, cor = r.cor_pagina || "rosa", sobre = r.mostrar_sobre !== "nao";
    return `<section class="cartao dados-pagina">
      <div class="cartao-cab"><span class="ic">${I.lista}</span><div><h4>Dados da sua página</h4><p class="desc">Preencha o básico. A Sócia escreve a página com estes dados. Salva sozinho. <span class="salvo" id="salvo"></span></p></div></div>
      <div class="duas">
        <div class="campo"><label for="c-produto">Nome do produto <span class="obrig">*</span></label><input class="input" id="c-produto" data-campo="produto" value="${esc(r.produto || "")}"></div>
        <div class="campo"><label for="c-preco">Preço <span class="obrig">*</span></label><input class="input" id="c-preco" data-campo="preco" placeholder="Ex.: R$ 27 à vista ou 3x de R$ 9,90" value="${esc(r.preco || "")}"></div>
        <div class="campo cheia"><label for="c-checkout">Link do checkout da Kiwify</label><div class="dica">Na Kiwify: Produtos → seu produto → Links → copie o link do checkout. Precisa dele só para publicar.</div><input class="input" id="c-checkout" data-campo="checkout" placeholder="https://pay.kiwify.com.br/..." value="${esc(r.checkout || "")}"></div>
        <div class="campo cheia"><label for="c-bonus">Bônus (opcional)</label><div class="dica">Um por linha. Deixe em branco se não tiver bônus: a página fica sem essa parte.</div><textarea class="area" id="c-bonus" data-campo="bonus_pagina" placeholder="Ex.: Checklist da semana&#10;Lista de compras pronta">${esc(r.bonus_pagina || "")}</textarea></div>
        <div class="campo cheia"><label class="check-linha"><input type="checkbox" data-sobre ${sobre ? "checked" : ""}> Mostrar a parte “Quem sou eu” na página</label>
          ${sobre ? `<div class="dica" style="margin-top:8px">Sua história em 2 ou 3 linhas, em primeira pessoa.</div><textarea class="area" id="c-hist" data-campo="historia_pagina" placeholder="Ex.: Eu dormia mal e vivia cansada. Quando troquei o café da noite por chás naturais, tudo mudou...">${esc(r.historia_pagina ?? r.vivencia ?? "")}</textarea>` : ""}</div>
        <div class="campo"><label>Imagem do produto (opcional)</label><div class="dica">Sem imagem, a página cria uma capa automática. Mockup bonito: Canva → “mockup e-book”.</div>
          <div class="prints">${r.mockup ? `<figure><img src="data:image/jpeg;base64,${r.mockup}" alt="Imagem do produto" style="object-fit:contain;background:#fff"><button class="btn-leve" data-acao="tirar-mockup" aria-label="Tirar imagem">✕</button></figure>` : `<label class="add-print"><input type="file" accept="image/*" data-mockup hidden>${I.baixar}<span>Enviar imagem</span></label>`}</div></div>
        <div class="campo"><label for="c-cor">Cor da página</label><select class="select" id="c-cor" data-campo="cor_pagina">${Object.entries(CORES_PAGINA).map(([k, n]) => `<option value="${k}" ${k === cor ? "selected" : ""}>${n}</option>`).join("")}</select></div>
      </div></section>`;
  }

  async function publicarPagina(id) {
    const s = dados.saidas[id], sec = lerSecoes(s?.texto);
    const checkout = String(dados.respostas.checkout || "").trim();
    if (!/^https:\/\/\S+$/.test(checkout)) return toast("Cole o link do checkout da Kiwify (começa com https://).");
    if (!sec.TITULO) return toast("O texto da página está sem o ### TITULO.");
    const hist = String(dados.respostas.historia_pagina ?? dados.respostas.vivencia ?? "").trim();
    if (dados.respostas.mostrar_sobre === "nao") delete sec.SOBRE;
    if (!String(dados.respostas.bonus_pagina || "").trim()) delete sec.BONUS;
    if (sec.SOBRE && /\[[^\]]*\]/.test(sec.SOBRE)) {
      if (!hist) { document.getElementById("c-hist")?.focus(); return toast("Escreva a sua história no campo “Sua história” antes de publicar."); }
      sec.SOBRE = sec.SOBRE.replace(/\[[^\]]*\]/g, hist);
    } else if (hist && !sec.SOBRE && dados.respostas.mostrar_sobre !== "nao") sec.SOBRE = hist;
    const pendentes = Object.entries(sec).filter(([, t]) => /\[[^\]]{3,}\]/.test(t)).map(([k]) => k.toLowerCase());
    if (pendentes.length) return toast(`Complete os trechos entre [colchetes] no texto da página (${pendentes.join(", ")}).`);
    if (sec.BONUS && /^\s*[-*•]?\s*(nenhum|sem b[oô]nus|n[aã]o h[aá])/i.test(sec.BONUS)) delete sec.BONUS;
    if (sec.SOBRE && /^\s*nenhum/i.test(sec.SOBRE)) delete sec.SOBRE;
    let slugAtual = dados.respostas.pagina_slug;
    if (!slugAtual) slugAtual = (slug(dados.respostas.produto || perfil.nome || "minha-pagina").slice(0, 40) || "pagina") + "-" + Math.random().toString(36).slice(2, 6);
    const conteudo = { secoes: sec, checkout, cor: dados.respostas.cor_pagina || "rosa", produto: dados.respostas.produto || "", autora: perfil.nome || "", arroba: dados.respostas.arroba || "", mockup: dados.respostas.mockup || "" };
    if (DEMO) { try { localStorage.setItem("sd_pagina_" + slugAtual, JSON.stringify(conteudo)); } catch {} }
    else {
      const { error } = await sb.from("paginas").upsert({ slug: slugAtual, user_id: usuaria.id, dados: conteudo, publicada: true, atualizado_em: new Date().toISOString() });
      if (error) { console.error(error); return toast("Não consegui publicar. Tente de novo."); }
    }
    dados.respostas.pagina_slug = slugAtual;
    await salvarAgora();
    toast("Página publicada! 🎉");
    render();
  }

  const FORMULAS = [
    ["Prazo + direção + área", "“Durante 7 dias, tome este suco antes do café para desinchar”"],
    ["Chamada pela identidade", "“Mãe, não dê este lanche antes da escola”"],
    ["Número + resultado", "“3 jantares com o que sobrou na geladeira”"],
    ["Direção clara", "“Faça isso hoje, antes de pagar qualquer conta”"],
  ];
  const EVITAR = [
    "Capa que só faz sentido para quem já conhece a história",
    "Capa que expõe vergonha: quem sente vergonha não para",
    "Texto que diminui a seguidora, como se ela não soubesse fazer",
    "Pitch sem promessa forte: sem promessa forte não vende",
  ];
  function formulasHTML() {
    return `<section class="cartao formulas"><div class="cartao-cab"><span class="ic">${I.brilho}</span><div><h4>As fórmulas de capa da Vanessa</h4><p class="desc">A estrutura que fez o perfil dela vender, para usar no SEU nicho: capa que para a rolagem e convite no último slide.</p></div></div>
      <div class="duas"><div><b class="f-tit">Use</b><ul class="f-lista">${FORMULAS.map(([n, ex]) => `<li><b>${n}</b><span>${ex}</span></li>`).join("")}</ul></div>
      <div><b class="f-tit">Evite</b><ul class="f-lista evitar">${EVITAR.map((t) => `<li>${t}</li>`).join("")}</ul></div></div></section>`;
  }

  function atualizarFerr() { render(); }

  function usandoHTML(id) {
    const r = dados.respostas;
    if (FERR[id]?.cat === "jornada") return "";
    if (!String(r.vivencia || r.nicho || "").trim()) return `<div class="usa aviso">Você ainda não respondeu as 4 perguntas da jornada. <a href="#/inicio">Responda aqui</a>: assim o texto sai sob medida para o seu nicho.</div>`;
    const base = r.produto ? `produto <b>${esc(r.produto)}</b>` : r.nicho ? `<b>${esc(r.nicho)}</b>` : "as suas respostas da jornada";
    return `<div class="usa">Usando: ${base} · <a href="#/conta">ajustar</a></div>`;
  }

  function caixaGerar(id) {
    const f = FERR[id], s = dados.saidas[id], g = gerando[id], motivo = g ? "" : bloqueio(id), c = f.campo;
    const v = dados.respostas["x_" + id] || "";
    const campo = c?.tipo === "imagens" ? `<div class="campo"><label>${esc(c.rotulo)} <span class="obrig">*</span></label>${c.dica ? `<div class="dica">${esc(c.dica)}</div>` : ""}
        <div class="prints">${prints.map((p, i) => `<figure><img src="data:image/jpeg;base64,${p.data}" alt="Print ${i + 1}"><button class="btn-leve" data-acao="tirar-print" data-i="${i}" aria-label="Tirar print ${i + 1}">✕</button></figure>`).join("")}
          ${prints.length < 5 ? `<label class="add-print"><input type="file" accept="image/*" multiple data-prints hidden>${I.baixar}<span>Adicionar prints</span></label>` : ""}</div>
        <small class="dica-cel">Os prints não ficam salvos: são usados só nesta análise.</small></div>`
      : c ? `<div class="campo"><label for="x-${id}">${esc(c.rotulo)}${c.obrig ? ' <span class="obrig">*</span>' : ""}</label>${c.tipo === "area"
        ? `<textarea class="area" id="x-${id}" data-campo="x_${id}" placeholder="${esc(c.placeholder || "")}">${esc(v)}</textarea>`
        : `<input class="input" id="x-${id}" data-campo="x_${id}" placeholder="${esc(c.placeholder || "")}" value="${esc(v)}">`}</div>` : "";
    return `<section class="cartao caixa-gerar">
        ${campo}
        ${f.cat === "jornada" ? "" : usandoHTML(id)}
        <div class="linha-acoes" style="margin-top:${campo ? 4 : 0}px;align-items:center">
          ${g ? `<button class="btn btn-pri" disabled>Criando...</button>` : `<button class="btn ${s ? "btn-sec" : "btn-pri"}" id="b-${id}" data-acao="gerar" data-id="${id}" ${motivo ? "disabled" : ""}>${I.brilho} ${s ? "Gerar de novo" : "Gerar com a Sócia"}</button>`}
          <span class="motivo" id="m-${id}">${esc(motivo)}</span>
        </div>
      </section>
      ${erros[id] ? `<div class="erro-ia" style="border-radius:12px;margin-bottom:16px">${esc(erros[id])}</div>` : ""}`;
  }

  function viewFerramenta(id) {
    const f = FERR[id];
    if (!f) { location.hash = "#/inicio"; return ""; }
    const daJornada = f.cat === "jornada";
    const outras = daJornada ? [] : (CATS.find((x) => x.id === f.cat)?.ferramentas || []).filter((x) => x.id !== id).slice(0, 3);
    return `
      <a class="voltar" href="${daJornada ? "#/inicio" : "#/funil"}">${I.voltar} ${daJornada ? "Voltar para a jornada" : "Todas as ferramentas do funil"}</a>
      <div class="olho">${esc(f.catTitulo)}</div><h1 class="titulo">${esc(f.titulo)}</h1><p class="lead">${esc(f.desc)}</p>
      ${f.formulas ? `<details class="det-formulas"><summary>Ver as fórmulas de capa da Vanessa</summary>${formulasHTML()}</details>` : ""}
      ${f.pagina ? dadosPaginaHTML() : ""}
      ${caixaGerar(id)}
      ${resultadoHTML(id)}
      ${outras.length ? `<div class="secao-tit"><h3>Continue com</h3></div><div class="grade">${outras.map(cardFerr).join("")}</div>` : ""}`;
  }

  // ================================================================ JORNADA
  const passoAtual = () => JORNADA.find((p) => p.id === dados.jornada.passo) || JORNADA[0];
  function irPara(id) {
    if (!JORNADA.find((p) => p.id === id)) return;
    const faseAntes = passoAtual().fase;
    dados.jornada.trilha.push(dados.jornada.passo);
    dados.jornada.passo = id;
    if (id === "funil") dados.jornada.funil = true;
    const faseDepois = passoAtual().fase;
    if (faseDepois > faseAntes) setTimeout(() => toast(`Fase ${FASES[faseAntes]} concluída! 🎉 Agora: ${FASES[faseDepois]}`), 150);
    salvar(); location.hash = "#/inicio"; render(); window.scrollTo(0, 0);
  }
  function secaoMd(texto, titulo) {
    const t = String(texto || ""), re = new RegExp("^##\\s*" + titulo + "[^\\n]*\\n([\\s\\S]*?)(?=^##\\s|$(?![\\s\\S]))", "mi");
    const m = t.match(re);
    return m ? m[1].trim() : "";
  }
  function checklistHTML(chave, itens) {
    const ok = dados.checks[chave] || [];
    return `<section class="cartao"><ul class="checklist">${itens.map((c, i) => `<li class="${ok.includes(i) ? "ok" : ""}" data-acao="check" data-chave="${chave}" data-i="${i}"><span class="caixa">${ok.includes(i) ? I.check : ""}</span><span>${esc(c)}</span></li>`).join("")}</ul></section>`;
  }

  function aulaHTML(fase) {
    const link = (C.AULAS || {})[(window.FASES_CHAVE || [])[fase]];
    return link ? `<div class="aula"><a class="btn btn-sec" href="${esc(link)}" target="_blank" rel="noopener">▶ Assistir à aula: ${esc(FASES[fase])}</a></div>` : "";
  }

  function viewJornada() {
    const p = passoAtual(), r = dados.respostas;
    const fases = FASES.map((n, i) => `<div class="fase ${i < p.fase ? "feita" : i === p.fase ? "atual" : ""}"><span class="num ${i < p.fase ? "feito" : ""}">${i < p.fase ? I.check : i + 1}</span><span>${n}</span></div>`).join('<span class="fase-linha"></span>');
    let corpo = "";
    if (p.tipo === "texto") {
      const v = r[p.campo] || "";
      corpo = `<div class="respostas"><textarea class="area" id="t-passo" data-campo="${p.campo}" placeholder="${esc(p.placeholder || "")}">${esc(v)}</textarea>
        <div class="continuar">${p.pular ? `<button class="btn btn-leve" data-acao="pular-texto" data-chave="${p.campo}" data-proximo="${proxDe(p)}">${esc(p.pular)}</button>` : ""}
        <button class="btn btn-pri" id="b-passo" data-acao="proxima-texto" data-proximo="${proxDe(p)}" ${p.obrig && !String(v).trim() ? "disabled" : ""}>Próxima ${I.seta}</button></div></div>`;
    } else if (p.tipo === "multi") {
      const marcados = String(r[p.campo] || "").split(",").filter(Boolean);
      corpo = `<div class="respostas"><div class="chips-multi">${p.opcoes.map((o) => `<button class="chip-multi ${marcados.includes(o) ? "sel" : ""}" data-acao="multi" data-chave="${p.campo}" data-valor="${esc(o)}">${marcados.includes(o) ? I.check + " " : ""}${esc(o)}</button>`).join("")}</div>
        <div class="continuar"><button class="btn btn-pri" data-acao="proxima-texto" data-proximo="${proxDe(p)}" ${marcados.length ? "" : "disabled"}>Próxima ${I.seta}</button></div></div>`;
    } else if (p.tipo === "pergunta" || p.tipo === "boasvindas") {
      const campo = p.campo || "caminho";
      corpo = `<div class="respostas ${p.tipo === "boasvindas" ? "grandes" : ""}">${p.opcoes.map(([v, rot, prox]) => `<button class="btn-resp ${r[campo] === v ? "sel" : ""}" data-acao="responder" data-chave="${campo}" data-valor="${esc(v)}" data-proximo="${prox}">${esc(rot)} ${I.seta}</button>`).join("")}</div>`;
    } else if (p.tipo === "ia") {
      const f = FERR[p.ferramenta], s = dados.saidas[p.ferramenta];
      const falta = !s ? "" : f.escolha && !r[f.escolha] ? "Escolha uma das opções acima para continuar." : "";
      const topo = p.auto
        ? (s && !gerando[p.ferramenta] ? `<div class="linha-acoes" style="justify-content:flex-end;margin:0 0 10px"><button class="btn btn-leve" data-acao="gerar" data-id="${p.ferramenta}">${I.brilho} ${f.escolha ? "Ver outras opções" : "Gerar de novo"}</button></div>`
          : erros[p.ferramenta] ? caixaGerar(p.ferramenta) : "")
        : caixaGerar(p.ferramenta);
      corpo = `${topo}${resultadoHTML(p.ferramenta)}
        ${p.checklist && s ? `<div class="passo-tit"><span class="passo">✓</span><div><b>Coloque em prática</b><small>Marque o que você já fez no seu perfil.</small></div></div>${checklistHTML(p.id, p.checklist)}` : ""}
        ${s ? `<div class="continuar">${falta ? `<span class="motivo">${falta}</span>` : ""}<button class="btn btn-pri" data-acao="avancar" data-proximo="${proxDe(p)}" ${falta ? "disabled" : ""}>Continuar ${I.seta}</button></div>` : ""}
        ${p.pulavel && !s ? `<div class="continuar"><button class="btn btn-leve" data-acao="avancar" data-proximo="${proxDe(p)}">Pular esta parte</button></div>` : ""}`;
    } else if (p.tipo === "resumo") {
      const persona = secaoMd(dados.saidas.persona?.texto, "Quem é ela") || "";
      const perfilHoje = secaoMd(dados.saidas.raio_x?.texto, "O que o seu perfil mostra");
      corpo = `<div class="resumo">
          <div class="res-item"><small>Seu nicho</small><b>${esc(r.nicho || "Ainda não definido")}</b>${r.nicho_detalhe ? md(r.nicho_detalhe) : ""}</div>
          ${persona ? `<div class="res-item"><small>Sua cliente ideal</small>${md(persona)}<a class="mini-link" href="#/f/persona">Ver o retrato completo ${I.seta}</a></div>` : ""}
          ${perfilHoje ? `<div class="res-item"><small>O seu perfil hoje</small>${md(perfilHoje)}</div>` : ""}
          <div class="res-item"><small>O que vem agora</small><b>Definir o seu primeiro infoproduto. Depois, ajustar o seu Instagram para ele.</b></div>
        </div>
        <div class="continuar"><button class="btn btn-pri" data-acao="avancar" data-proximo="${proxDe(p)}">Vamos lá ${I.seta}</button></div>`;
    } else if (p.tipo === "pausa") {
      corpo = `<div class="linha-acoes" style="margin-bottom:16px"><a class="btn btn-sec" href="#/f/blueprint">${I.livro} Ver o plano do meu produto</a></div>
        ${checklistHTML(p.id, p.checklist)}
        <div class="continuar"><button class="btn btn-pri" data-acao="avancar" data-proximo="${proxDe(p)}">${I.check} ${esc(p.botao)}</button></div>`;
    } else if (p.tipo === "funil") {
      corpo = `<div class="continuar" style="justify-content:flex-start"><a class="btn btn-pri" href="#/funil">Abrir o meu funil ${I.seta}</a><a class="btn btn-sec" href="#/f/blueprint">${I.livro} Plano do produto</a></div>`;
    }
    return `
      <div class="fases">${fases}</div>
      ${p.contador ? `<div class="contador">Pergunta ${p.contador}</div>` : ""}
      <div class="bolha"><div class="marca-sd">SD</div><div class="fala">${md(p.fala.replace("{nome}", primeiroNome()))}
        ${p.termos || p.exemplo ? `<div class="ajudas">${(p.termos || []).filter((t) => GLOSSARIO[t]).map((t) => `<details class="termo"><summary>O que é ${esc(GLOSSARIO[t][0].toLowerCase())}?</summary><p>${esc(GLOSSARIO[t][1])}</p></details>`).join("")}${p.exemplo ? `<details class="termo"><summary>Ver um exemplo de resposta</summary><p>${esc(p.exemplo)}</p></details>` : ""}</div>` : ""}</div></div>
      ${aulaHTML(p.fase)}
      ${corpo}
      ${dados.jornada.trilha.length ? `<button class="voltar" style="margin-top:22px" data-acao="voltar-passo">${I.voltar} Voltar ao passo anterior</button>` : ""}`;
  }

  function viewFunil() {
    if (!dados.jornada.funil && !espiarFunil) {
      return `<div class="olho">Funil de vendas</div><h1 class="titulo">O seu <em>funil</em></h1>
        <section class="cartao vazio"><p><b>O funil abre depois que você cria o seu produto.</b></p><p style="margin-top:8px">Antes de qualquer post, você precisa ter o que vender. Continue a jornada: falta pouco!</p>
        <div class="continuar" style="justify-content:center"><a class="btn btn-pri" href="#/inicio">Continuar a jornada ${I.seta}</a><button class="btn btn-leve" data-acao="espiar-funil">Ver mesmo assim</button></div></section>`;
    }
    const hoje = new Date().getDay(), m = (window.MISSOES || [])[hoje], dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const mf = m && FERR[m.ferramenta];
    return `<div class="olho">Funil de vendas</div><h1 class="titulo">O seu <em>funil</em></h1>
      <p class="lead" style="margin-bottom:8px">Atrair as pessoas certas, criar conexão e vender, com as técnicas do método e a sua essência.</p>
      ${usandoHTML("")}
      ${m ? `<section class="cartao missao"><div class="olho">Sua missão de hoje · ${dias[hoje]}</div><h4>Pilar: ${esc(m.pilar)}</h4><p class="desc" style="margin:6px 0 14px">${esc(m.texto)}</p>${mf ? `<a class="btn btn-pri" href="#/f/${m.ferramenta}">${I.brilho} Abrir ${esc(mf.titulo)}</a>` : ""}</section>` : ""}
      ${aulaHTML(4)}
      ${CATS.map((c) => `<div class="secao-tit"><h3>${esc(c.titulo)}</h3><span class="desc-cat">${esc(c.desc)}</span></div>
        <div class="grade">${c.ferramentas.map(cardFerr).join("")}</div>`).join("")}`;
  }

  // ------------------------------------------------------------------ Chat
  function viewChat() {
    const msgs = dados.chat.map((m) => m.role === "user"
      ? `<div class="msg eu">${esc(m.content)}</div>`
      : `<div class="msg ela">${md(m.content)}</div>`).join("");
    const sugest = ["Tenho vergonha de aparecer. Por onde começo?", "Como vender sem perder a minha essência?", "Me dá 5 ganchos de Reels para o meu nicho", "Como responder quem diz que está caro?"];
    return `<div class="chat">
      <div class="chat-cab"><div><div class="olho">Sempre com você</div><h1 class="titulo" style="margin-bottom:0">Fale com a <em>Sócia</em></h1></div>
        ${dados.chat.length ? `<button class="btn btn-leve" data-acao="limpar-chat">Nova conversa</button>` : ""}</div>
      <div class="chat-lista" id="chat-lista">
        ${msgs || `<div class="chat-vazio"><div class="marca-sd">SD</div><p>Pergunte o que quiser sobre o seu negócio. Eu já conheço o seu produto, o seu plano e o seu manifesto.</p>
          <div class="sugestoes">${sugest.map((s) => `<button data-acao="sugestao" data-txt="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>`}
        ${chatEnviando ? `<div class="msg ela"><div class="pontos" style="padding:6px 0"><i></i><i></i><i></i></div></div>` : ""}
      </div>
      <div class="chat-entrada"><textarea id="chat-texto" rows="1" placeholder="Escreva para a Sócia..." ${chatEnviando ? "disabled" : ""}></textarea>
        <button class="btn btn-pri" data-acao="enviar" ${chatEnviando ? "disabled" : ""} aria-label="Enviar">${I.enviar}</button></div>
    </div>`;
  }

  // ------------------------------------------------------------------ Materiais
  function viewMateriais() {
    const itens = Object.entries(dados.saidas).filter(([id]) => FERR[id]).sort((a, b) => (b[1].em || "").localeCompare(a[1].em || ""));
    const lista = itens.map(([id, s]) => {
      const f = FERR[id];
      return `<div class="ferr"><div class="ferr-cab"><span class="ic">${ICONE_CAT[f.cat] || I.brilho}</span><div class="txt"><b>${esc(f.titulo)}</b><span>${esc(f.catTitulo)}${s.extra ? ` · ${esc(s.extra)}` : ""}</span></div><a class="btn btn-sec" href="#/f/${id}">Abrir</a></div>
        <div class="ferr-res"><div class="ferr-acoes"><span class="quando">${dataBR(s.em)}</span>
        <button class="btn-leve" data-acao="copiar" data-id="${id}">${I.copiar} Copiar</button>
        <button class="btn-leve" data-acao="baixar" data-id="${id}">${I.baixar} Baixar</button>
        <button class="btn-leve" data-acao="expandir" data-id="${id}">${I.expandir} Ver tudo</button></div>
        <div class="texto-ia" id="t-${id}" style="max-height:240px">${md(s.texto)}</div></div></div>`;
    }).join("");
    return `<div class="olho">Tudo guardado</div><h1 class="titulo">Meus <em>materiais</em></h1><p class="lead" style="margin-bottom:28px">Cada texto que a Sócia criou para você, do mais recente para o mais antigo.</p>
      ${lista || `<div class="cartao vazio"><p>Você ainda não gerou nenhum material.</p><p style="margin-top:14px"><a class="btn btn-pri" href="#/inicio">Escolher uma ferramenta ${I.seta}</a></p></div>`}`;
  }

  // ------------------------------------------------------------------ Conta
  function viewConta() {
    const p = Math.min(100, Math.round((uso.hoje / uso.limite) * 100));
    return `<div class="olho">Minha conta</div><h1 class="titulo">Olá, <em>${esc(primeiroNome())}</em></h1><p class="lead" style="margin-bottom:28px">${esc(perfil.email)}</p>
      <section class="cartao"><h4>Como você quer ser chamada?</h4><p class="desc" style="margin-bottom:16px">A Sócia usa este nome nas conversas.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><input class="input" id="nome-conta" value="${esc(perfil.nome)}" style="flex:1;min-width:200px"><button class="btn btn-pri" data-acao="salvar-nome">Salvar</button></div></section>
      <section class="cartao negocio"><h4>Meu negócio</h4><p class="desc" style="margin-bottom:14px">A Sócia preenche isto durante a jornada, mas você pode ajustar. Salva sozinho enquanto você digita. <span class="salvo" id="salvo"></span></p>
        <div class="tres">
          <div class="campo"><label for="c-nicho">Meu nicho</label><input class="input" id="c-nicho" data-campo="nicho" value="${esc(dados.respostas.nicho || "")}"></div>
          <div class="campo"><label for="c-arroba">Meu @</label><input class="input" id="c-arroba" data-campo="arroba" placeholder="@seuperfil" value="${esc(dados.respostas.arroba || "")}"></div>
          <div class="campo"><label for="c-produto">Meu produto</label><input class="input" id="c-produto" data-campo="produto" value="${esc(dados.respostas.produto || "")}"></div>
        </div>
        <button class="btn btn-pri" data-acao="salvar-negocio">${I.check} Salvar</button></section>
      <section class="cartao"><h4>Criações de hoje</h4><p class="desc">Você pode gerar até ${uso.limite} materiais ou respostas por dia. Amanhã renova.</p>
        <div class="uso"><i style="width:${p}%"></i></div><small style="color:var(--suave)">${uso.hoje} de ${uso.limite} usadas hoje</small></section>
      ${DEMO ? "" : `<section class="cartao"><h4>Trocar senha</h4><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><input class="input" id="nova-senha" type="password" placeholder="Nova senha (mínimo 6)" style="flex:1;min-width:200px"><button class="btn btn-sec" data-acao="trocar-senha">Trocar</button></div></section>`}
      <section class="cartao"><h4>Recomeçar do zero</h4><p class="desc" style="margin-bottom:14px">Apaga a sua jornada, o seu negócio e todos os materiais.</p>
        <button class="btn btn-sec" data-acao="recomecar">${confirmarReset ? "Clique de novo para apagar tudo" : "Recomeçar do zero"}</button></section>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${C.SUPORTE_URL ? `<a class="btn btn-sec" href="${esc(C.SUPORTE_URL)}" target="_blank" rel="noopener">Falar com o suporte</a>` : ""}<button class="btn btn-leve" data-acao="sair">${I.sair} Sair</button></div>`;
  }

  // Reduz o print para no máximo 1280px (fica mais rápido e mais barato)
  function lerPrint(arquivo, max = 1280) {
    return new Promise((ok, falha) => {
      const leitor = new FileReader();
      leitor.onerror = falha;
      leitor.onload = () => {
        const img = new Image();
        img.onerror = falha;
        img.onload = () => {
          const k = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          ok({ data: c.toDataURL("image/jpeg", 0.82).split(",")[1] });
        };
        img.src = leitor.result;
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  // ------------------------------------------------------------------ eventos
  document.addEventListener("click", async (ev) => {
    const el = ev.target.closest("[data-acao]");
    if (!el) {
      if (ev.target.closest(".lat-item, .lat-rodape a")) document.getElementById("casca")?.classList.remove("menu-aberto");
      return;
    }
    const a = el.dataset.acao, id = el.dataset.id;
    if (el.tagName === "A") ev.preventDefault();
    switch (a) {
      case "esqueci": return telaEsqueci();
      case "login": return telaLogin();
      case "menu": return document.getElementById("casca").classList.add("menu-aberto");
      case "fechar-menu": return document.getElementById("casca").classList.remove("menu-aberto");
      case "gerar": return gerar(id);
      case "copiar": return copiar(dados.saidas[id]?.texto || "");
      case "baixar": return baixar(slug(FERR[id].titulo), dados.saidas[id]?.texto || "");
      case "expandir": { const t = document.getElementById("t-" + id); if (t) { t.classList.toggle("aberto"); t.style.maxHeight = t.classList.contains("aberto") ? "none" : ""; } return; }
      case "responder": {
        const k = el.dataset.chave;
        if (dados.respostas[k] !== el.dataset.valor && DEP_CAMPO[k]) limparDepois(DEP_CAMPO[k]);
        dados.respostas[k] = el.dataset.valor; return irPara(el.dataset.proximo);
      }
      case "multi": {
        const k = el.dataset.chave, v = el.dataset.valor, l = String(dados.respostas[k] || "").split(",").filter(Boolean);
        const pos = l.indexOf(v); pos >= 0 ? l.splice(pos, 1) : l.push(v);
        dados.respostas[k] = l.join(","); salvar(); return render();
      }
      case "proxima-texto": {
        const p = passoAtual();
        if (dados.respostas["_ult_" + p.campo] !== dados.respostas[p.campo]) { limparDepois(DEP_CAMPO[p.campo] || []); dados.respostas["_ult_" + p.campo] = dados.respostas[p.campo]; }
        return irPara(el.dataset.proximo);
      }
      case "pular-texto": {
        if (dados.respostas[el.dataset.chave]) limparDepois(DEP_CAMPO[el.dataset.chave] || []);
        dados.respostas[el.dataset.chave] = ""; return irPara(el.dataset.proximo);
      }
      case "avancar": return irPara(el.dataset.proximo);
      case "voltar-passo": { const ant = dados.jornada.trilha.pop(); if (ant) { dados.jornada.passo = ant; salvar(); render(); window.scrollTo(0, 0); } return; }
      case "espiar-funil": espiarFunil = true; return render();
      case "check": {
        const k = el.dataset.chave, i = Number(el.dataset.i), l = dados.checks[k] || (dados.checks[k] = []);
        const pos = l.indexOf(i); pos >= 0 ? l.splice(pos, 1) : l.push(i);
        salvar(); return render();
      }
      case "tirar-mockup": dados.respostas.mockup = ""; salvar(); return render();
      case "tirar-print": prints.splice(Number(el.dataset.i), 1); return render();
      case "salvar-negocio": {
        ["nicho", "arroba", "produto"].forEach((k) => { const c = document.getElementById("c-" + k); if (c) dados.respostas[k] = c.value.trim(); });
        await salvarAgora();
        const s = document.getElementById("salvo"); if (s) s.innerHTML = `${I.check} Salvo`;
        return toast("Meu negócio salvo! ✨");
      }
      case "copiar-bloco": return copiar(el.closest(".bloco-cod")?.querySelector("pre")?.textContent || "");
      case "recomecar": {
        if (!confirmarReset) { confirmarReset = true; return render(); }
        confirmarReset = false; dados = novosDados(); await salvarAgora();
        toast("Tudo apagado. Vamos de novo!"); location.hash = "#/inicio"; render(); return;
      }
      case "carr-copiar": return copiar(textoSlides(dados.saidas[id]));
      case "slide-copiar": { const sl = dados.saidas[id]?.slides?.[Number(el.dataset.i)]; return copiar(sl ? `${sl.titulo}${sl.texto ? "\n" + sl.texto : ""}` : ""); }
      case "carr-legenda": return copiar(dados.saidas[id]?.legenda || "");
      case "publicar-pagina": return publicarPagina(id);
      case "copiar-link-pagina": return copiar(urlPagina(dados.respostas.pagina_slug));
      case "escolher": {
        const f = FERR[id], o = opcoes(dados.saidas[id]?.texto), op = o?.ops[Number(el.dataset.i)];
        if (!op) return;
        if (dados.respostas[f.escolha] !== op.titulo && DEPENDE[id]) limparDepois(DEPENDE[id]);
        dados.respostas[f.escolha] = op.titulo;
        dados.respostas[f.escolha + "_detalhe"] = op.corpo;
        await salvarAgora();
        toast(`Escolhido: ${op.titulo} ✨`);
        return render();
      }
      case "enviar": return enviarChat();
      case "sugestao": { const t = document.getElementById("chat-texto"); t.value = el.dataset.txt; return enviarChat(); }
      case "limpar-chat": dados.chat = []; salvar(); return render();
      case "salvar-nome": {
        const nome = document.getElementById("nome-conta").value.trim();
        if (!nome) return;
        perfil.nome = nome;
        if (DEMO) localStorage.setItem("sd_demo_nome", nome);
        else { const { error } = await sb.from("perfis").update({ nome }).eq("id", usuaria.id); if (error) return toast("Não consegui salvar."); }
        toast("Nome salvo!"); return render();
      }
      case "trocar-senha": {
        const s = document.getElementById("nova-senha").value;
        if (s.length < 6) return toast("A senha precisa ter pelo menos 6 caracteres.");
        const { error } = await sb.auth.updateUser({ password: s });
        return toast(error ? "Não consegui trocar a senha." : "Senha alterada!");
      }
      case "sair":
        if (DEMO) { usuaria = null; try { localStorage.removeItem("sd_demo_on"); } catch {} return telaLogin(); }
        await sb.auth.signOut(); usuaria = null; return telaLogin();
    }
  });

  let timerSalvo = null;
  document.addEventListener("input", (ev) => {
    const pt = ev.target.closest("[data-pagina-texto]");
    if (pt) { const s = dados.saidas[pt.dataset.paginaTexto]; if (s) { s.texto = pt.value; salvar(); } return; }
    const el = ev.target.closest("[data-campo]");
    if (!el) return;
    dados.respostas[el.dataset.campo] = el.value;
    if (el.dataset.campo === "nicho" || el.dataset.campo === "produto") dados.respostas[el.dataset.campo + "_detalhe"] = "";
    salvar();
    atualizarBotoes();
    const s = document.getElementById("salvo");
    if (s) { s.textContent = "Salvando..."; clearTimeout(timerSalvo); timerSalvo = setTimeout(() => { s.innerHTML = `${I.check} Salvo`; }, 900); }
  });

  document.addEventListener("change", async (ev) => {
    if (ev.target.matches("[data-sobre]")) { dados.respostas.mostrar_sobre = ev.target.checked ? "sim" : "nao"; salvar(); return render(); }
    if (ev.target.matches("[data-mockup]")) {
      const a = ev.target.files[0];
      if (a && a.type.startsWith("image/")) { try { dados.respostas.mockup = (await lerPrint(a, 900)).data; await salvarAgora(); } catch { toast("Não consegui ler a imagem."); } }
      return render();
    }
    if (ev.target.matches("[data-prints]")) {
      const arquivos = [...ev.target.files].filter((a) => a.type.startsWith("image/")).slice(0, 5 - prints.length);
      try { for (const a of arquivos) prints.push(await lerPrint(a)); }
      catch { toast("Não consegui ler uma das imagens."); }
      return render();
    }
    const el = ev.target.closest("select[data-campo]");
    if (el) {
      dados.respostas[el.dataset.campo] = el.value; salvar(); atualizarBotoes();
    }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.target.id === "chat-texto" && ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); enviarChat(); }
  });
  document.addEventListener("input", (ev) => {
    if (ev.target.id === "chat-texto") { ev.target.style.height = "auto"; ev.target.style.height = Math.min(160, ev.target.scrollHeight) + "px"; }
  });

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

  // Troca as frases enquanto a Sócia pensa
  let iFrase = 0;
  setInterval(() => {
    const els = document.querySelectorAll("[data-frase]");
    if (!els.length) return;
    iFrase = (iFrase + 1) % FRASES.length;
    els.forEach((e) => (e.textContent = FRASES[iFrase]));
  }, 2600);

  // ------------------------------------------------------------------ início
  function iniciarDemo() {
    usuaria = { id: "demo", email: "demo@sociadigital" };
    try { localStorage.setItem("sd_demo_on", "1"); } catch {}
    perfil = { nome: localStorage.getItem("sd_demo_nome") || "Vanessa", email: "modo demonstração" };
    try { dados = normalizar(JSON.parse(localStorage.getItem("sd_demo") || "null")); } catch { dados = novosDados(); }
    if (!location.hash) location.hash = "#/inicio";
    render();
  }

  async function carregarTudo() {
    const { data } = await sb.auth.getUser();
    if (!data?.user) return telaLogin();
    usuaria = { id: data.user.id, email: data.user.email };
    const [pf, pj, us] = await Promise.all([
      sb.from("perfis").select("nome, email, ativo").eq("id", usuaria.id).maybeSingle(),
      sb.from("projetos").select("dados").eq("user_id", usuaria.id).maybeSingle(),
      sb.from("uso_ia").select("total").eq("user_id", usuaria.id).eq("dia", hojeSP()).maybeSingle(),
    ]);
    if (pf.data && pf.data.ativo === false) { usuaria = null; return telaBloqueada(); }
    perfil = { nome: pf.data?.nome || (usuaria.email || "").split("@")[0], email: usuaria.email };
    dados = normalizar(pj.data?.dados);
    if (!pj.data) await sb.from("projetos").insert({ user_id: usuaria.id, dados });
    uso.hoje = us.data?.total || 0;
    if (!location.hash || location.hash === "#") location.hash = "#/inicio";
    render();
  }

  function carregarSupabase() {
    return new Promise((ok, falha) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload = ok; s.onerror = falha; document.head.appendChild(s);
    });
  }

  async function iniciar() {
    if (DEMO) { try { if (localStorage.getItem("sd_demo_on")) return iniciarDemo(); } catch {} return telaLogin(); }
    try { await carregarSupabase(); }
    catch { $app.innerHTML = `<div class="vazio">Não consegui carregar o app. Verifique sua internet e recarregue a página.</div>`; return; }
    const querSenha = new URLSearchParams(location.search).has("definir-senha");
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    sb.auth.onAuthStateChange((evento) => {
      if (evento === "PASSWORD_RECOVERY") { modoRecuperacao = true; telaDefinirSenha(); }
    });
    const { data } = await sb.auth.getSession();
    if (modoRecuperacao) return;
    if (data?.session && querSenha) return telaDefinirSenha();
    if (data?.session) return carregarTudo();
    telaLogin();
  }

  iniciar();
})();
