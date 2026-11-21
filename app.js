// =====================================================================
// SÓCIA DIGITAL — app principal
// =====================================================================
(function () {
  "use strict";
  const C = window.CONFIG || {};
  const ETAPAS = window.ETAPAS || [];
  const DEMO = !C.SUPABASE_URL || !C.SUPABASE_ANON_KEY;
  const $app = document.getElementById("app");

  // Todas as ferramentas, por id
  const FERR = {};
  ETAPAS.forEach((e) => e.ferramentas.forEach((f) => (FERR[f.id] = { ...f, etapa: e.id })));

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


  function novosDados() { return { respostas: {}, saidas: {}, concluidas: [], checks: {}, chat: [] }; }
  function normalizar(d) {
    const n = novosDados();
    if (d && typeof d === "object") Object.keys(n).forEach((k) => { if (d[k] != null) n[k] = d[k]; });
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

  // ------------------------------------------------------------------ utilidades
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const primeiroNome = () => (perfil.nome || "").trim().split(/\s+/)[0] || "querida";
  const hojeSP = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const pct = () => Math.round((ETAPAS.filter((e) => dados.concluidas.includes(e.id)).length / ETAPAS.length) * 100);
  const proximaEtapa = () => ETAPAS.find((e) => !dados.concluidas.includes(e.id));
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
    if (j.usadosHoje) uso.hoje = j.usadosHoje;
    if (j.limite) uso.limite = j.limite;
    return j.texto || "";
  }

  function demoTexto(corpo) {
    if (corpo.ferramenta === "chat") {
      return `## Que bom que você perguntou, ${primeiroNome()}!\n\nEste é o **modo demonstração**: quando o app estiver ligado ao Supabase, aqui vai aparecer a resposta real da Sócia, usando tudo o que você já preencheu nas etapas.\n\n- Ela lembra do seu nicho, da sua cliente e da sua oferta\n- Responde dúvidas sobre conteúdo, preço, Kiwify e lançamento\n- Cria textos na hora\n\n**Seu próximo passo:** continue preenchendo a etapa em que você está.`;
    }
    if (corpo.ferramenta === "nichos" || corpo.ferramenta === "ideias_produto") {
      const n = corpo.ferramenta === "nichos" ? ["Mães que querem voltar a orar", "Mulheres ansiosas que buscam paz", "Esposas que querem organizar a casa"] : ["E-book: 21 Dias no Secreto", "Desafio: 7 Dias de Paz", "Minicurso: Rotina de Oração Real"];
      return `Este é um exemplo do modo demonstração.\n\n${n.map((t, i) => `### OPÇÃO ${i + 1}: ${t}\n**Para quem:** exemplo de cliente.\n**A dor que você resolve:** exemplo de dor.\n**Por que você:** exemplo.`).join("\n\n")}\n\n## Minha recomendação\nComece pela opção 1: é a que mais combina com a sua história.`;
    }
    if (corpo.ferramenta === "carrossel_viral") {
      const sl = [["Durante 7 noites, faça isto antes de dormir", "e veja a sua casa mudar"], ["Desligue o celular 30 minutos antes", "A sua mente precisa de silêncio para descansar de verdade."], ["Escreva 3 coisas boas do dia", "Gratidão muda o foco do que falta para o que você já tem."], ["Ore pelo nome de cada filho", "Coloque diante de Deus o que você não consegue resolver sozinha."], ["Prepare o dia seguinte", "Separe a roupa e a lista: amanhã começa mais leve."], ["Durma no mesmo horário", "Rotina simples é o que sustenta a mudança."], ["Quer a jornada completa de 21 noites?", "Está tudo no meu guia. Clique no link da bio."]];
      return sl.map(([t, x], i) => `### SLIDE ${i + 1}\nTÍTULO: ${t}\nTEXTO: ${x}`).join("\n") + "\n### LEGENDA\nSalve este post e comece hoje à noite. Qual dessas você vai fazer primeiro? #rotina #fé #mulhercristã";
    }
    if (corpo.ferramenta === "pagina_vendas") {
      return "### TITULO\n21 noites para dormir em paz e acordar com direção\n### SUBTITULO\nUm guia simples para mulheres cansadas de viver no automático.\n### DOR\nVocê deita exausta e a mente não para.\n### VIRADA\nCom pequenos passos por noite, sua rotina muda.\n### CONTEUDO\n- 21 noites guiadas\n- Exercícios simples\n### BONUS\n- Checklist da noite\n### SOBRE\n[SUA HISTÓRIA AQUI]\n### GARANTIA\n7 dias de garantia.\n### PRECO\nR$ 29 à vista ou em até 3x.\n### FAQ\n**Como recebo?**\nPor e-mail, na hora.\n### CHAMADA\nSua próxima noite pode ser diferente.";
    }
    const f = FERR[corpo.ferramenta] || { titulo: "Material" };
    return `## ${f.titulo}\n\nEste é um **exemplo do modo demonstração**. Com o Supabase e a chave da IA configurados, a Sócia cria aqui o material completo a partir das suas respostas${corpo.extra ? ` sobre *${corpo.extra}*` : ""}.\n\n### Como vai ficar\n1. Um diagnóstico do que você contou\n2. O material pronto para copiar e usar\n3. Ajustes sugeridos para a sua cliente ideal\n\n> Tudo fica salvo em **Meus materiais**.\n\n---\n\n**Seu próximo passo:** leia, ajuste com a sua história real e marque a etapa como concluída.`;
  }

  async function gerar(id) {
    if (gerando[id] || bloqueio(id)) return;
    const f = FERR[id];
    const extra = f.extra ? (dados.respostas["x_" + id] || "").trim() : "";
    gerando[id] = true; delete erros[id]; atualizarFerr(id);
    try {
      const texto = await chamarIA({ ferramenta: id, extra });
      dados.saidas[id] = { texto, em: new Date().toISOString(), extra };
      if (f.carrossel) Object.assign(dados.saidas[id], lerSlides(texto));
      await salvarAgora();
    } catch (e) {
      erros[id] = e.message;
    }
    gerando[id] = false; atualizarFerr(id);
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
    const etapas = ETAPAS.map((e) => {
      const feito = dados.concluidas.includes(e.id);
      const ativo = r.nome === "etapa" && Number(r.arg) === e.id;
      return `<a class="lat-item ${ativo ? "ativo" : ""} ${etapaLiberada(e.id) ? "" : "fechada"}" href="#/etapa/${e.id}"><span class="num ${feito ? "feito" : ""}">${feito ? I.check : e.id}</span><span>${esc(e.titulo)}</span></a>`;
    }).join("");
    return `
    <aside class="lateral">
      <div class="lat-topo"><div class="marca-sd">SD</div><div><b>Sócia Digital</b><small>${esc(C.NOME_CURSO)}</small><div class="status-ia"><i></i> IA online</div></div></div>
      <nav class="lat-nav">
        ${item("inicio", I.casa, "Início", r.nome === "inicio")}
        ${item("socia", I.chat, "Fale com a Sócia", r.nome === "socia")}
        ${item("materiais", I.pasta, "Meus materiais", r.nome === "materiais")}
        <div class="lat-sec">O mapa · ${pct()}%</div>
        ${etapas}
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
    if (r.nome === "etapa") corpo = viewEtapa(Number(r.arg));
    else if (r.nome === "socia") corpo = viewChat();
    else if (r.nome === "materiais") corpo = viewMateriais();
    else if (r.nome === "conta") corpo = viewConta();
    else corpo = viewInicio();
    $app.innerHTML = `
    <div class="casca" id="casca">
      ${lateral(r)}
      <div class="veu" data-acao="fechar-menu"></div>
      <main class="principal">
        <div class="barra-movel"><button data-acao="menu" aria-label="Abrir menu">${I.menu}</button><div class="marca-sd">SD</div><b>Sócia Digital</b></div>
        <div class="conteudo">${corpo}</div>
      </main>
    </div>`;
    desenharCarrosseis();
    if (r.nome === "socia") {
      const l = document.getElementById("chat-lista"); if (l) l.scrollTop = l.scrollHeight;
      const t = document.getElementById("chat-texto"); if (t && !chatEnviando && window.innerWidth > 920) t.focus();
    }
  }

  // ------------------------------------------------------------------ Início
  function anel(p) {
    const R = 56, L = 2 * Math.PI * R;
    return `<div class="anel"><svg width="132" height="132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="#1A221F" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="url(#g)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - p / 100)}"/><defs><linearGradient id="g"><stop offset="0" stop-color="#3DDCFF"/><stop offset="1" stop-color="#39FF88"/></linearGradient></defs></svg><div class="pct"><div><b>${p}%</b><small>do mapa</small></div></div></div>`;
  }

  function viewInicio() {
    const prox = proximaEtapa();
    const nMat = Object.keys(dados.saidas).length;
    const heroi = prox
      ? `<div><div class="olho">Seu próximo passo</div><h2 class="titulo" style="font-size:clamp(28px,3vw,36px)">Etapa ${prox.id} · ${esc(prox.titulo)}</h2><p class="lead">${esc(prox.subtitulo)}. ${esc(prox.intro)}</p>
         <div class="proximo"><a class="btn btn-pri" href="#/etapa/${prox.id}">${dados.concluidas.length ? "Continuar" : "Começar agora"} ${I.seta}</a><a class="btn btn-sec" href="#/socia">${I.chat} Tirar uma dúvida</a></div></div>`
      : `<div><div class="olho">Mapa completo</div><h2 class="titulo" style="font-size:clamp(28px,3vw,36px)">Você publicou o seu infoproduto! 🎉</h2><p class="lead">Agora é constância: conteúdo, conversa no direct e melhorias a cada venda. A Sócia continua aqui.</p>
         <div class="proximo"><a class="btn btn-pri" href="#/etapa/7">Criar mais conteúdo ${I.seta}</a><a class="btn btn-sec" href="#/socia">${I.chat} Falar com a Sócia</a></div></div>`;
    const mapa = ETAPAS.map((e) => {
      const feito = dados.concluidas.includes(e.id), atual = prox && prox.id === e.id;
      return `<a class="mapa-item ${atual ? "atual" : ""} ${etapaLiberada(e.id) ? "" : "fechada"}" href="#/etapa/${e.id}">${atual ? '<span class="selo">Agora</span>' : ""}<span class="num ${feito ? "feito" : ""}">${feito ? I.check : e.id}</span><b>${esc(e.titulo)}</b><small>${esc(e.subtitulo)}</small></a>`;
    }).join("");
    return `
      <div class="olho">${esc(C.NOME_CURSO)}</div>
      <h1 class="titulo">Olá, <em>${esc(primeiroNome())}</em>.</h1>
      <p class="lead" style="margin-bottom:28px">Eu sou a sua Sócia Digital. Vamos construir o seu infoproduto do zero até a publicação, uma etapa de cada vez.</p>
      <section class="heroi">${heroi}${anel(pct())}</section>
      <div class="grade">
        <a class="atalho" href="#/socia"><span class="ic">${I.chat}</span><b>Fale com a Sócia</b><span>Dúvidas, ideias e textos na hora, já com o contexto do seu negócio.</span></a>
        <a class="atalho ouro" href="#/materiais"><span class="ic">${I.pasta}</span><b>Meus materiais</b><span>${nMat ? `${nMat} ${nMat === 1 ? "material criado" : "materiais criados"} e guardados para você.` : "Tudo o que a Sócia criar fica guardado aqui."}</span></a>
        <a class="atalho verde" href="#/conta"><span class="ic">${I.pessoa}</span><b>Minha conta</b><span>Seu nome e quantas criações você ainda tem hoje (${Math.max(0, uso.limite - uso.hoje)} de ${uso.limite}).</span></a>
      </div>
      <div class="secao-tit"><h3>O seu mapa</h3><span class="olho" style="color:var(--suave)">${dados.concluidas.length} de ${ETAPAS.length} etapas</span></div>
      <div class="mapa">${mapa}</div>`;
  }

  // ------------------------------------------------------------------ Etapa
  function campoHTML(c) {
    const v = dados.respostas[c.id] || "";
    let input;
    if (c.tipo === "area") input = `<textarea class="area" id="c-${c.id}" data-campo="${c.id}">${esc(v)}</textarea>`;
    else if (c.tipo === "select") input = `<select class="select" id="c-${c.id}" data-campo="${c.id}"><option value="">Escolha...</option>${c.opcoes.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else input = `<input class="input" id="c-${c.id}" data-campo="${c.id}" value="${esc(v)}">`;
    return `<div class="campo ${c.tipo === "area" ? "cheia" : ""}"><label for="c-${c.id}">${esc(c.rotulo)}${c.obrig ? ' <span class="obrig">*</span>' : ""}</label>${c.dica ? `<div class="dica">${esc(c.dica)}</div>` : ""}${input}</div>`;
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

  // Etapa liberada quando a anterior foi concluída
  const etapaLiberada = (id) => id === 1 || dados.concluidas.includes(id - 1);
  const faltando = (e) => e.campos.filter((c) => c.obrig && !String(dados.respostas[c.id] || "").trim());
  function bloqueio(id) {
    const f = FERR[id], e = ETAPAS.find((x) => x.id === f.etapa);
    if (!etapaLiberada(e.id)) return `Conclua a etapa ${e.id - 1} primeiro.`;
    const fl = faltando(e);
    if (fl.length) return `Responda ${fl.length === 1 ? "a pergunta obrigatória" : `as ${fl.length} perguntas obrigatórias`} acima para liberar.`;
    if (f.extra && !f.extra.opcional && !String(dados.respostas["x_" + id] || "").trim()) return `Escreva o tema para liberar.`;
    if (f.requer && !dados.respostas[f.requer]) return "Escolha uma das opções acima para liberar.";
    return "";
  }
  function atualizarBotoes() {
    const r = rota(); if (r.nome !== "etapa") return;
    const e = ETAPAS.find((x) => x.id === Number(r.arg)); if (!e) return;
    e.ferramentas.forEach((f) => {
      if (gerando[f.id]) return;
      const b = document.getElementById("b-" + f.id), m = document.getElementById("m-" + f.id);
      const motivo = bloqueio(f.id);
      if (b) b.disabled = !!motivo;
      if (m) { m.textContent = motivo; m.style.display = motivo ? "" : "none"; }
    });
  }

  const FRASES = ["A Sócia está pensando na sua cliente ideal...", "Organizando as ideias com carinho...", "Escrevendo na sua voz...", "Quase pronto, só os últimos detalhes..."];

  function ferrHTML(id) {
    const f = FERR[id], s = dados.saidas[id], g = gerando[id];
    const motivo = g ? "" : bloqueio(id);
    const botao = g
      ? `<button class="btn btn-pri" disabled>Criando...</button>`
      : `<button class="btn ${s ? "btn-sec" : "btn-pri"}" id="b-${id}" data-acao="gerar" data-id="${id}" ${motivo ? "disabled" : ""}>${I.brilho} ${s ? "Gerar de novo" : "Gerar com a Sócia"}</button>`;
    let res = "";
    if (g) res = `<div class="ferr-res"><div class="pensando"><span class="pontos"><i></i><i></i><i></i></span><span data-frase>${FRASES[0]}</span></div></div>`;
    else if (s) res = `<div class="ferr-res"><div class="ferr-acoes"><span class="quando">Criado em ${dataBR(s.em)}${s.extra ? ` · ${esc(s.extra)}` : ""}</span>
        <button class="btn-leve" data-acao="copiar" data-id="${id}">${I.copiar} Copiar</button>
        <button class="btn-leve" data-acao="baixar" data-id="${id}">${I.baixar} Baixar</button>
        <button class="btn-leve" data-acao="expandir" data-id="${id}">${I.expandir} Ver tudo</button></div>
        ${corpoSaida(id, s)}</div>`;
    return `<div class="ferr" id="f-${id}">
      <div class="ferr-cab"><span class="ic">${I.brilho}</span><div class="txt"><b>${esc(f.titulo)}</b><span>${esc(f.descricao)}</span></div>${botao}</div>
      <div class="motivo" id="m-${id}" ${motivo ? "" : 'style="display:none"'}>${esc(motivo)}</div>
      ${f.extra ? `<div class="ferr-extra"><div class="campo"><label for="x-${id}">${esc(f.extra.rotulo)}</label><input class="input" id="x-${id}" data-campo="x_${id}" placeholder="${esc(f.extra.placeholder)}" value="${esc(dados.respostas["x_" + id] || "")}"></div></div>` : ""}
      ${erros[id] ? `<div class="erro-ia">${esc(erros[id])}</div>` : ""}
      ${res}</div>`;
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
  const TEMAS = {
    escuro: { nome: "Escuro elegante", bg: "#121212", bg2: "#1C1C1C", tx: "#F6F1E9", sub: "#CFC6B8", ac: "#D9B26F" },
    claro: { nome: "Claro delicado", bg: "#FBF7F2", bg2: "#F1E7DC", tx: "#2A2225", sub: "#6E6266", ac: "#B0646F" },
    verde: { nome: "Verde sofisticado", bg: "#1F3D36", bg2: "#28504A", tx: "#FFFFFF", sub: "#D7E6DF", ac: "#F2D06B" },
    lilas: { nome: "Lilás suave", bg: "#EFE9F7", bg2: "#E2D8F0", tx: "#2C2340", sub: "#5E5470", ac: "#7B5EA7" },
  };
  const carrEditando = new Set();

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

  function carrosselHTML(id, s) {
    if (!s.slides) Object.assign(s, lerSlides(s.texto));
    if (!s.slides || s.slides.length < 2) return "";
    const tema = dados.respostas.tema_carrossel || "escuro";
    const ed = carrEditando.has(id);
    return `<div class="texto-ia aberto" data-carrossel="${id}">
      <div class="carr-barra">
        <select class="select" data-campo="tema_carrossel" aria-label="Visual do carrossel">${Object.entries(TEMAS).map(([k, t]) => `<option value="${k}" ${k === tema ? "selected" : ""}>${t.nome}</option>`).join("")}</select>
        <button class="btn btn-pri" data-acao="carr-baixar" data-id="${id}">${I.baixar} Baixar os ${s.slides.length} slides</button>
        <button class="btn btn-sec" data-acao="carr-editar" data-id="${id}">${I.lapis} ${ed ? "Fechar edição" : "Editar textos"}</button>
      </div>
      <div class="carr-grade">${s.slides.map((_, i) => `<figure><img id="ci-${id}-${i}" alt="Slide ${i + 1}"><figcaption><button class="btn-leve" data-acao="carr-um" data-id="${id}" data-i="${i}">${I.baixar} Slide ${i + 1}</button></figcaption></figure>`).join("")}</div>
      <p class="dica-cel">No celular: toque e segure na imagem e escolha “Salvar imagem”.</p>
      ${ed ? `<div class="carr-edicao">${s.slides.map((sl, i) => `<div class="carr-ed"><span class="passo">${i + 1}</span><div><input class="input" data-slide="${id}|${i}|titulo" value="${esc(sl.titulo)}" aria-label="Título do slide ${i + 1}"><textarea class="area" data-slide="${id}|${i}|texto" aria-label="Texto do slide ${i + 1}">${esc(sl.texto)}</textarea></div></div>`).join("")}</div>` : ""}
      <div class="legenda"><div class="legenda-cab"><b>Legenda</b><button class="btn-leve" data-acao="carr-legenda" data-id="${id}">${I.copiar} Copiar legenda</button></div><p>${esc(s.legenda).replace(/\n/g, "<br>")}</p></div>
    </div>`;
  }

  function quebrar(ctx, txt, max) {
    const palavras = String(txt || "").split(/\s+/).filter(Boolean), linhas = [];
    let linha = "";
    for (const p of palavras) {
      const teste = linha ? linha + " " + p : p;
      if (ctx.measureText(teste).width > max && linha) { linhas.push(linha); linha = p; } else linha = teste;
    }
    if (linha) linhas.push(linha);
    return linhas;
  }
  function caber(ctx, txt, max, tam, minimo, maxLinhas, peso, fam) {
    for (let t = tam; t >= minimo; t -= 4) {
      ctx.font = `${peso} ${t}px ${fam}`;
      const l = quebrar(ctx, txt, max);
      if (l.length <= maxLinhas) return { l, t };
    }
    ctx.font = `${peso} ${minimo}px ${fam}`;
    return { l: quebrar(ctx, txt, max), t: minimo };
  }
  function retang(x, a, b, w, h, r) {
    x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
    x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
  }

  function desenharSlide(sl, i, total, chaveTema) {
    const W = 1080, H = 1350, M = 96, T = TEMAS[chaveTema] || TEMAS.escuro;
    const fam = '"Manrope", "Segoe UI", Arial, sans-serif', famT = '"Space Grotesk", "Manrope", Arial, sans-serif';
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = T.bg; x.fillRect(0, 0, W, H);
    x.fillStyle = T.bg2; x.beginPath(); x.arc(W - 40, 110, 250, 0, Math.PI * 2); x.fill();
    x.textBaseline = "top";
    const arroba = String(dados.respostas.arroba || "").trim();
    const capa = i === 0, ultimo = i === total - 1;
    if (capa) {
      const r = caber(x, sl.titulo, W - 2 * M, 104, 60, 6, "700", famT);
      const alt = r.l.length * r.t * 1.12;
      let y = Math.max(M + 60, (H - alt) / 2 - 80);
      x.fillStyle = T.tx; r.l.forEach((ln, k) => x.fillText(ln, M, y + k * r.t * 1.12));
      y += alt + 34; x.fillStyle = T.ac; x.fillRect(M, y, 120, 8); y += 42;
      if (sl.texto) { const s2 = caber(x, sl.texto, W - 2 * M, 46, 32, 3, "500", fam); x.fillStyle = T.sub; s2.l.forEach((ln, k) => x.fillText(ln, M, y + k * s2.t * 1.3)); }
      x.font = `700 34px ${fam}`; x.fillStyle = T.ac; x.textAlign = "right"; x.fillText("Arraste →", W - M, H - M - 34); x.textAlign = "left";
    } else if (ultimo) {
      x.font = `700 40px ${famT}`; x.fillStyle = T.ac; x.fillText(String(i + 1).padStart(2, "0"), M, M);
      const bx = M - 24, by = M + 110, bw = W - 2 * M + 48, bh = H - by - M - 80;
      x.fillStyle = T.ac; retang(x, bx, by, bw, bh, 40); x.fill();
      const r = caber(x, sl.titulo, bw - 120, 80, 48, 5, "700", famT);
      const s2 = sl.texto ? caber(x, sl.texto, bw - 120, 44, 30, 6, "600", fam) : { l: [], t: 0 };
      const alt = r.l.length * r.t * 1.12 + (s2.l.length ? 48 + s2.l.length * s2.t * 1.35 : 0);
      let y = by + (bh - alt) / 2;
      x.font = `700 ${r.t}px ${famT}`; x.fillStyle = T.bg; r.l.forEach((ln, k) => x.fillText(ln, bx + 60, y + k * r.t * 1.12));
      y += r.l.length * r.t * 1.12 + 48;
      if (s2.l.length) { x.font = `600 ${s2.t}px ${fam}`; s2.l.forEach((ln, k) => x.fillText(ln, bx + 60, y + k * s2.t * 1.35)); }
    } else {
      x.font = `700 40px ${famT}`; x.fillStyle = T.ac; x.fillText(String(i + 1).padStart(2, "0"), M, M);
      const r = caber(x, sl.titulo, W - 2 * M, 84, 52, 4, "700", famT);
      const s2 = sl.texto ? caber(x, sl.texto, W - 2 * M, 54, 34, 9, "500", fam) : { l: [], t: 0 };
      const alt = r.l.length * r.t * 1.14 + 95 + s2.l.length * s2.t * 1.4;
      let y = Math.max(M + 110, (H - alt) / 2 - 30);
      x.font = `700 ${r.t}px ${famT}`; x.fillStyle = T.tx; r.l.forEach((ln, k) => x.fillText(ln, M, y + k * r.t * 1.14));
      y += r.l.length * r.t * 1.14 + 36; x.fillStyle = T.ac; x.fillRect(M, y, 90, 7); y += 59;
      if (s2.l.length) { x.font = `500 ${s2.t}px ${fam}`; x.fillStyle = T.sub; s2.l.forEach((ln, k) => x.fillText(ln, M, y + k * s2.t * 1.4)); }
    }
    if (arroba) { x.font = `600 30px ${fam}`; x.fillStyle = ultimo ? T.sub : T.sub; x.fillText(arroba.startsWith("@") ? arroba : "@" + arroba, M, H - M - 30); }
    x.font = `600 28px ${fam}`; x.fillStyle = T.sub; x.textAlign = "right";
    if (!capa) x.fillText(`${i + 1}/${total}`, W - M, H - M - 28);
    x.textAlign = "left";
    return c.toDataURL("image/png");
  }

  let fontesProntas = null;
  function carregarFontes() {
    if (!fontesProntas) fontesProntas = Promise.all([
      document.fonts?.load('700 80px "Space Grotesk"'), document.fonts?.load('500 40px "Manrope"'), document.fonts?.load('700 40px "Manrope"'),
    ]).catch(() => {});
    return fontesProntas;
  }
  async function desenharCarrosseis(soId, soI) {
    const blocos = document.querySelectorAll("[data-carrossel]");
    if (!blocos.length) return;
    await carregarFontes();
    blocos.forEach((b) => {
      const id = b.dataset.carrossel; if (soId && soId !== id) return;
      const s = dados.saidas[id]; if (!s?.slides) return;
      s.slides.forEach((sl, i) => {
        if (soI != null && soI !== i) return;
        const img = document.getElementById(`ci-${id}-${i}`);
        if (img) img.src = desenharSlide(sl, i, s.slides.length, dados.respostas.tema_carrossel || "escuro");
      });
    });
  }
  function baixarImagem(src, nome) {
    const a = document.createElement("a"); a.href = src; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  }

  // ================================================================ PÁGINA DE VENDAS
  const CORES_PAGINA = { rosa: "Rosa elegante", verde: "Verde", azul: "Azul", dourado: "Dourado", lilas: "Lilás" };
  function lerSecoes(texto) {
    const out = {}, partes = String(texto || "").split(/^#{2,4}\s*([A-Za-zÀ-ú]+)\s*$/m);
    for (let k = 1; k < partes.length; k += 2) {
      const nome = partes[k].normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
      out[nome] = (partes[k + 1] || "").trim();
    }
    return out;
  }
  const urlPagina = (slug) => location.origin + location.pathname.replace(/[^/]*$/, "") + "pagina.html?p=" + encodeURIComponent(slug);

  function paginaHTML(id, s) {
    const sec = lerSecoes(s.texto);
    if (!sec.TITULO) return "";
    const slug = dados.respostas.pagina_slug, cor = dados.respostas.cor_pagina || "rosa";
    return `<div class="texto-ia aberto">
      <div class="pag-prev"><small class="olho">Prévia do topo da página</small><h3>${esc(sec.TITULO)}</h3><p>${esc(sec.SUBTITULO || "")}</p></div>
      <details class="pag-editar"><summary>Ver ou editar o texto completo da página</summary>
        <textarea class="area" data-pagina-texto="${id}" rows="16">${esc(s.texto)}</textarea>
        <small class="dica-cel">Mantenha os marcadores que começam com ### (TITULO, DOR, CONTEUDO...).</small></details>
      <div class="pub">
        <div class="campo"><label for="c-checkout">Link do checkout da Kiwify <span class="obrig">*</span></label><div class="dica">Na Kiwify: Produtos → seu produto → Links → copie o link do checkout.</div><input class="input" id="c-checkout" data-campo="checkout" placeholder="https://pay.kiwify.com.br/..." value="${esc(dados.respostas.checkout || "")}"></div>
        <div class="campo"><label for="c-cor">Cor da página</label><select class="select" id="c-cor" data-campo="cor_pagina">${Object.entries(CORES_PAGINA).map(([k, n]) => `<option value="${k}" ${k === cor ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <button class="btn btn-pri" data-acao="publicar-pagina" data-id="${id}">${I.brilho} ${slug ? "Atualizar minha página" : "Publicar minha página"}</button>
        ${slug ? `<div class="pag-link"><b>${I.check} Sua página está no ar:</b><input class="input" readonly value="${esc(urlPagina(slug))}" aria-label="Link da página"><div class="linha-acoes"><button class="btn btn-sec" data-acao="copiar-link-pagina">${I.copiar} Copiar link</button><a class="btn btn-sec" href="${esc(urlPagina(slug))}" target="_blank" rel="noopener">Abrir página ${I.seta}</a></div><small class="dica-cel">Coloque este link na sua bio do Instagram.</small></div>` : ""}
      </div></div>`;
  }

  async function publicarPagina(id) {
    const s = dados.saidas[id], sec = lerSecoes(s?.texto);
    const checkout = String(dados.respostas.checkout || "").trim();
    if (!/^https:\/\/\S+$/.test(checkout)) return toast("Cole o link do checkout da Kiwify (começa com https://).");
    if (!sec.TITULO) return toast("O texto da página está sem o ### TITULO.");
    let slugAtual = dados.respostas.pagina_slug;
    if (!slugAtual) slugAtual = (slug(dados.respostas.produto || perfil.nome || "minha-pagina").slice(0, 40) || "pagina") + "-" + Math.random().toString(36).slice(2, 6);
    const conteudo = { secoes: sec, checkout, cor: dados.respostas.cor_pagina || "rosa", produto: dados.respostas.produto || "", autora: perfil.nome || "", arroba: dados.respostas.arroba || "" };
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
    ["Prazo + direção + área", "“Durante 7 noites, faça X pela sua Y”"],
    ["Chamada pela identidade", "“Mãe, não durma sem...” / “Esposa, antes de discutir...”"],
    ["Número + resultado", "“3 hábitos que mudaram a minha manhã”"],
    ["Direção clara", "“Faça isso hoje, antes de dormir: ...”"],
  ];
  const EVITAR = [
    "Capa que só faz sentido para quem já conhece a história",
    "Capa que expõe vergonha: quem sente vergonha não para",
    "Texto que diminui a seguidora, como se ela não soubesse fazer",
    "Pitch sem promessa forte: sem promessa forte não vende",
  ];
  function formulasHTML() {
    return `<section class="cartao formulas"><div class="cartao-cab"><span class="ic">${I.brilho}</span><div><h4>As fórmulas de capa da Vanessa</h4><p class="desc">O que fez o perfil dela vender: carrossel com capa que para a rolagem e convite no último slide.</p></div></div>
      <div class="duas"><div><b class="f-tit">Use</b><ul class="f-lista">${FORMULAS.map(([n, ex]) => `<li><b>${n}</b><span>${ex}</span></li>`).join("")}</ul></div>
      <div><b class="f-tit">Evite</b><ul class="f-lista evitar">${EVITAR.map((t) => `<li>${t}</li>`).join("")}</ul></div></div></section>`;
  }

  function atualizarFerr(id) {
    const el = document.getElementById("f-" + id);
    if (el) el.outerHTML = ferrHTML(id);
    desenharCarrosseis(id);
  }

  function viewEtapa(n) {
    const e = ETAPAS.find((x) => x.id === n);
    if (!e) { location.hash = "#/inicio"; return ""; }
    const feito = dados.concluidas.includes(e.id);
    const liberada = etapaLiberada(e.id);
    const principal = e.principal || e.ferramentas[0].id, fp = FERR[principal];
    const falta = !dados.saidas[principal] ? `Gere o “${esc(fp.titulo)}” para poder concluir.`
      : fp.escolha && !dados.respostas[fp.escolha] ? "Escolha uma das opções para poder concluir." : "";
    const podeConcluir = !falta;
    const checks = dados.checks[e.id] || [];
    const ant = ETAPAS.find((x) => x.id === n - 1), prox = ETAPAS.find((x) => x.id === n + 1);
    let passo = 0;
    const tituloPasso = (t, d) => `<div class="passo-tit"><span class="passo">${++passo}</span><div><b>${t}</b>${d ? `<small>${d}</small>` : ""}</div></div>`;
    return `
      <div class="etapa-topo"><div><div class="olho">Etapa ${e.id} de ${ETAPAS.length}</div><h1 class="titulo">${esc(e.titulo)}</h1><p class="lead">${esc(e.intro)}</p></div></div>
      ${!liberada ? `<div class="aviso-trava">${I.lista}<div><b>Esta etapa ainda está fechada.</b><span>Termine a etapa ${e.id - 1} (${esc(ant.titulo)}) e marque como concluída para liberar.</span></div><a class="btn btn-sec" href="#/etapa/${e.id - 1}">Ir para a etapa ${e.id - 1}</a></div>` : ""}
      ${e.campos.length ? `${tituloPasso("Responda", "A Sócia usa estas respostas em tudo o que cria. O * indica as obrigatórias.")}
        <section class="cartao"><div class="duas">${e.campos.map(campoHTML).join("")}</div><span class="salvo" id="salvo"></span></section>` : ""}
      ${e.formulas ? formulasHTML() : ""}
      ${tituloPasso("Gere com a Sócia", e.ferramentas.length > 1 ? "Comece pela primeira; as outras completam." : "")}
      ${e.ferramentas.map((f) => ferrHTML(f.id)).join("")}
      ${e.checklist ? `${tituloPasso("Coloque em prática", "Marque o que você já fez.")}
        <section class="cartao"><ul class="checklist">${e.checklist.map((c, i) => `<li class="${checks.includes(i) ? "ok" : ""}" data-acao="check" data-etapa="${e.id}" data-i="${i}"><span class="caixa">${checks.includes(i) ? I.check : ""}</span><span>${esc(c)}</span></li>`).join("")}</ul></section>` : ""}
      <div class="concluir ${feito ? "feito" : ""}">
        <div><b>${feito ? "Etapa concluída ✓" : "Terminou esta etapa?"}</b><p>${feito ? "Você pode voltar aqui quando quiser para ajustar." : podeConcluir ? (prox ? `Marque como concluída para liberar a etapa ${prox.id}.` : "Marque como concluída para finalizar o seu mapa.") : falta}</p></div>
        <button class="btn ${feito ? "btn-sec" : "btn-pri"}" data-acao="concluir" data-etapa="${e.id}" ${!feito && !podeConcluir ? "disabled" : ""}>${feito ? "Desmarcar" : "Marcar como concluída"}</button>
      </div>
      <div class="nav-etapas">
        ${ant ? `<a class="btn btn-leve" href="#/etapa/${ant.id}">${I.voltar} ${esc(ant.titulo)}</a>` : "<span></span>"}
        ${prox ? `<a class="btn btn-leve" href="#/etapa/${prox.id}">${esc(prox.titulo)} ${I.seta}</a>` : ""}
      </div>`;
  }

  // ------------------------------------------------------------------ Chat
  function viewChat() {
    const msgs = dados.chat.map((m) => m.role === "user"
      ? `<div class="msg eu">${esc(m.content)}</div>`
      : `<div class="msg ela">${md(m.content)}</div>`).join("");
    const sugest = ["Como escolher o preço do meu primeiro produto?", "Me dá 5 ganchos de Reels para o meu nicho", "Tenho vergonha de aparecer. Por onde começo?", "Como faço para vender sem ser chata?"];
    return `<div class="chat">
      <div class="chat-cab"><div><div class="olho">Sempre com você</div><h1 class="titulo" style="margin-bottom:0">Fale com a <em>Sócia</em></h1></div>
        ${dados.chat.length ? `<button class="btn btn-leve" data-acao="limpar-chat">Nova conversa</button>` : ""}</div>
      <div class="chat-lista" id="chat-lista">
        ${msgs || `<div class="chat-vazio"><div class="marca-sd">SD</div><p>Pergunte o que quiser sobre o seu negócio. Eu já conheço o que você preencheu nas etapas.</p>
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
      const f = FERR[id], e = ETAPAS.find((x) => x.id === f.etapa);
      return `<div class="ferr"><div class="ferr-cab"><span class="ic">${I.brilho}</span><div class="txt"><b>${esc(f.titulo)}</b><span>Etapa ${e.id} · ${esc(e.titulo)}${s.extra ? ` · ${esc(s.extra)}` : ""}</span></div><a class="btn btn-sec" href="#/etapa/${e.id}">Abrir etapa</a></div>
        <div class="ferr-res"><div class="ferr-acoes"><span class="quando">${dataBR(s.em)}</span>
        <button class="btn-leve" data-acao="copiar" data-id="${id}">${I.copiar} Copiar</button>
        <button class="btn-leve" data-acao="baixar" data-id="${id}">${I.baixar} Baixar</button>
        <button class="btn-leve" data-acao="expandir" data-id="${id}">${I.expandir} Ver tudo</button></div>
        <div class="texto-ia" id="t-${id}" style="max-height:240px">${md(s.texto)}</div></div></div>`;
    }).join("");
    return `<div class="olho">Tudo guardado</div><h1 class="titulo">Meus <em>materiais</em></h1><p class="lead" style="margin-bottom:28px">Cada texto que a Sócia criou para você, do mais recente para o mais antigo.</p>
      ${lista || `<div class="cartao vazio"><p>Você ainda não gerou nenhum material.</p><p style="margin-top:14px"><a class="btn btn-pri" href="#/etapa/1">Começar pela Descoberta ${I.seta}</a></p></div>`}`;
  }

  // ------------------------------------------------------------------ Conta
  function viewConta() {
    const p = Math.min(100, Math.round((uso.hoje / uso.limite) * 100));
    return `<div class="olho">Minha conta</div><h1 class="titulo">Olá, <em>${esc(primeiroNome())}</em></h1><p class="lead" style="margin-bottom:28px">${esc(perfil.email)}</p>
      <section class="cartao"><h4>Como você quer ser chamada?</h4><p class="desc" style="margin-bottom:16px">A Sócia usa este nome nas conversas.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><input class="input" id="nome-conta" value="${esc(perfil.nome)}" style="flex:1;min-width:200px"><button class="btn btn-pri" data-acao="salvar-nome">Salvar</button></div></section>
      <section class="cartao"><h4>Criações de hoje</h4><p class="desc">Você pode gerar até ${uso.limite} materiais ou respostas por dia. Amanhã renova.</p>
        <div class="uso"><i style="width:${p}%"></i></div><small style="color:var(--suave)">${uso.hoje} de ${uso.limite} usadas hoje</small></section>
      ${DEMO ? "" : `<section class="cartao"><h4>Trocar senha</h4><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><input class="input" id="nova-senha" type="password" placeholder="Nova senha (mínimo 6)" style="flex:1;min-width:200px"><button class="btn btn-sec" data-acao="trocar-senha">Trocar</button></div></section>`}
      <section class="cartao"><h4>Recomeçar do zero</h4><p class="desc" style="margin-bottom:14px">Apaga as suas respostas e os materiais e volta para a etapa 1.</p>
        <button class="btn btn-sec" data-acao="recomecar">${confirmarReset ? "Clique de novo para apagar tudo" : "Recomeçar meu mapa"}</button></section>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${C.SUPORTE_URL ? `<a class="btn btn-sec" href="${esc(C.SUPORTE_URL)}" target="_blank" rel="noopener">Falar com o suporte</a>` : ""}<button class="btn btn-leve" data-acao="sair">${I.sair} Sair</button></div>`;
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
      case "check": {
        const e = Number(el.dataset.etapa), i = Number(el.dataset.i);
        const l = dados.checks[e] || (dados.checks[e] = []);
        const k = l.indexOf(i); k >= 0 ? l.splice(k, 1) : l.push(i);
        salvar(); return render();
      }
      case "concluir": {
        const e = Number(el.dataset.etapa), k = dados.concluidas.indexOf(e);
        if (k >= 0) dados.concluidas.splice(k, 1);
        else { dados.concluidas.push(e); toast(e === ETAPAS.length ? "Você completou o mapa! 🎉" : "Etapa concluída! Seguimos juntas ✨"); }
        await salvarAgora();
        if (k < 0 && e < ETAPAS.length) { location.hash = `#/etapa/${e + 1}`; window.scrollTo(0, 0); }
        else render();
        return;
      }
      case "copiar-bloco": return copiar(el.closest(".bloco-cod")?.querySelector("pre")?.textContent || "");
      case "recomecar": {
        if (!confirmarReset) { confirmarReset = true; return render(); }
        confirmarReset = false; dados = novosDados(); await salvarAgora();
        toast("Mapa recomeçado!"); location.hash = "#/etapa/1"; return;
      }
      case "carr-editar": { carrEditando.has(id) ? carrEditando.delete(id) : carrEditando.add(id); atualizarFerr(id); return; }
      case "carr-um": { const img = document.getElementById(`ci-${id}-${el.dataset.i}`); if (img?.src) baixarImagem(img.src, `slide-${Number(el.dataset.i) + 1}.png`); return; }
      case "carr-baixar": {
        const n = dados.saidas[id]?.slides?.length || 0;
        for (let i = 0; i < n; i++) { const img = document.getElementById(`ci-${id}-${i}`); if (img?.src) baixarImagem(img.src, `slide-${i + 1}.png`); await new Promise((r) => setTimeout(r, 450)); }
        return toast("Slides baixados! Agora é só postar ✨");
      }
      case "carr-legenda": return copiar(dados.saidas[id]?.legenda || "");
      case "publicar-pagina": return publicarPagina(id);
      case "copiar-link-pagina": return copiar(urlPagina(dados.respostas.pagina_slug));
      case "escolher": {
        const f = FERR[id], o = opcoes(dados.saidas[id]?.texto), op = o?.ops[Number(el.dataset.i)];
        if (!op) return;
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
  let timerSlide = null;
  document.addEventListener("input", (ev) => {
    const sl = ev.target.closest("[data-slide]");
    if (sl) {
      const [id, i, campo] = sl.dataset.slide.split("|"), s = dados.saidas[id];
      if (s?.slides?.[i]) { s.slides[i][campo] = sl.value; salvar(); clearTimeout(timerSlide); timerSlide = setTimeout(() => desenharCarrosseis(id, Number(i)), 250); }
      return;
    }
    const pt = ev.target.closest("[data-pagina-texto]");
    if (pt) { const s = dados.saidas[pt.dataset.paginaTexto]; if (s) { s.texto = pt.value; salvar(); } return; }
    const el = ev.target.closest("[data-campo]");
    if (!el) return;
    dados.respostas[el.dataset.campo] = el.value;
    salvar();
    atualizarBotoes();
    const s = document.getElementById("salvo");
    if (s) { s.textContent = "Salvando..."; clearTimeout(timerSalvo); timerSalvo = setTimeout(() => { s.innerHTML = `${I.check} Salvo`; }, 900); }
  });

  document.addEventListener("change", (ev) => {
    const el = ev.target.closest("select[data-campo]");
    if (el) {
      dados.respostas[el.dataset.campo] = el.value; salvar(); atualizarBotoes();
      if (el.dataset.campo === "tema_carrossel") desenharCarrosseis();
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
