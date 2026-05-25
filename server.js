const http  = require('http');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');

const PORT = process.env.PORT || 1234;
const WHITELIST_FILE = fs.existsSync('Whitelist.json') ? 'Whitelist.json' : 'whitelist.json';

function loadWhitelist() {
  try {
    if (fs.existsSync(WHITELIST_FILE)) return JSON.parse(fs.readFileSync(WHITELIST_FILE, 'utf8'));
  } catch (e) { console.error('Erro ao ler whitelist:', e.message); }
  return {};
}
function saveWhitelist(wl) {
  try { fs.writeFileSync(WHITELIST_FILE, JSON.stringify(wl, null, 2)); }
  catch (e) { console.error('Erro ao salvar whitelist:', e.message); }
}

let whitelist = loadWhitelist();

// ─── GitHub como banco de dados persistente ────────────────────────────────
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_OWNER = 'Ellkaalmeida';
const GH_REPO  = 'Manual_compragil';
const GH_FILE  = 'data/pages.json';
const GH_WL_FILE = 'data/whitelist.json';
let   _ghSha   = null;
let   _ghWlSha = null;
let   _ghSaveTimer = null;
let   _ghWlSaveTimer = null;

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization':  'token ' + GH_TOKEN,
        'User-Agent':     'Manual-Compragil-Server',
        'Accept':         'application/vnd.github.v3+json',
        'Content-Type':   'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function loadFromGitHub() {
  if (!GH_TOKEN) return null;
  try {
    const res = await ghRequest('GET', `/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`);
    if (res.content && res.sha) {
      _ghSha = res.sha;
      const data = JSON.parse(Buffer.from(res.content, 'base64').toString('utf8'));
      console.log(`[github] ${Object.keys(data).length} páginas carregadas`);
      return data;
    }
  } catch (e) { console.warn('[github] load:', e.message); }
  return null;
}

function scheduleGitHubSave() {
  if (!GH_TOKEN) return;
  clearTimeout(_ghSaveTimer);
  _ghSaveTimer = setTimeout(async () => {
    try {
      const content = Buffer.from(JSON.stringify(pages)).toString('base64');
      const res = await ghRequest('PUT', `/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`, {
        message: 'auto-save: páginas do manual',
        content,
        ...(_ghSha ? { sha: _ghSha } : {})
      });
      if (res.content && res.content.sha) {
        _ghSha = res.content.sha;
        console.log('[github] páginas salvas com sucesso');
      }
    } catch (e) { console.error('[github] save error:', e.message); }
  }, 30000); // Agrupa saves — máximo 1 commit a cada 30s
}

async function loadWhitelistFromGitHub() {
  if (!GH_TOKEN) return null;
  try {
    const res = await ghRequest('GET', `/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_WL_FILE}`);
    if (res.content && res.sha) {
      _ghWlSha = res.sha;
      const data = JSON.parse(Buffer.from(res.content, 'base64').toString('utf8'));
      console.log(`[github] whitelist carregada (${Object.keys(data).length} usuários)`);
      return data;
    }
  } catch (e) { console.warn('[github] whitelist load:', e.message); }
  return null;
}

function scheduleWhitelistGitHubSave() {
  if (!GH_TOKEN) return;
  clearTimeout(_ghWlSaveTimer);
  _ghWlSaveTimer = setTimeout(async () => {
    try {
      const content = Buffer.from(JSON.stringify(whitelist, null, 2)).toString('base64');
      const res = await ghRequest('PUT', `/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_WL_FILE}`, {
        message: 'auto-save: whitelist de usuários',
        content,
        ...(_ghWlSha ? { sha: _ghWlSha } : {})
      });
      if (res.content && res.content.sha) {
        _ghWlSha = res.content.sha;
        console.log('[github] whitelist salva com sucesso');
      } else {
        console.error('[github] whitelist save falhou:', JSON.stringify(res).substring(0, 300));
      }
    } catch (e) { console.error('[github] whitelist save error:', e.message); }
  }, 5000); // Salva rapidamente — permissões são críticas
}

// ─── Persistência local (fallback) ────────────────────────────────────────
const DATA_DIR   = fs.existsSync('/data') ? '/data' : '.';
const PAGES_FILE = DATA_DIR + '/pages.json';

function loadPages() {
  try {
    if (fs.existsSync(PAGES_FILE)) {
      const data = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
      console.log(`[local] ${Object.keys(data).length} páginas carregadas do disco`);
      return data;
    }
  } catch (e) { console.error('Erro ao ler pages.json:', e.message); }
  return {};
}

function savePages() {
  try { fs.writeFileSync(PAGES_FILE, JSON.stringify(pages)); }
  catch (e) { console.error('Erro ao salvar pages.json:', e.message); }
}

// Carrega local primeiro (rápido), depois sobrescreve com GitHub (persistente)
const pages = loadPages();
const clients = new Set();

// ─── Seed: injeta seções 2.4-2.6 no Dashboard se ainda não existirem ─────────
function seedDashboardSections() {
  const key = 'sidebar-0';
  const p = pages[key];
  if (!p || !p.content) return; // página ainda não existe — nada a fazer
  if (p.content.includes('2.4') || p.content.includes('Vencimento dos Contratos')) return; // já tem

  const extra = `
<h2>2.4 Vencimento dos Contratos 2026</h2>
<p>O gráfico de barras <strong>Vencimento dos Contratos 2026</strong> apresenta, mês a mês, a quantidade de contratos com vencimento previsto ao longo do ano. As barras são segmentadas por categoria, permitindo identificar quais tipos de contrato exigem mais atenção em cada período.</p>
<p>As categorias exibidas são: <strong>Serviços</strong>, <strong>Transportes</strong>, <strong>Materiais</strong>, <strong>Aluguéis</strong>, <strong>Diárias</strong>, <strong>Pessoal</strong> e <strong>Outros</strong>.</p>
<p>O mês de <strong>Abril/2026</strong> concentra o maior número de vencimentos — com <strong>54 contratos</strong> a renovar ou encerrar — exigindo planejamento antecipado da equipe de compras. Use esse gráfico para programar com antecedência os processos de renovação ou substituição contratual.</p>

<h2>2.5 Resumo das Compras</h2>
<p>A tabela <strong>Resumo das Compras</strong> consolida os pedidos realizados por cada Secretaria, possibilitando uma visão comparativa do volume e do valor investido por unidade gestora no período selecionado.</p>
<table>
  <thead><tr><th>Coluna</th><th>Descrição</th></tr></thead>
  <tbody>
    <tr><td><strong>Secretaria</strong></td><td>Nome da unidade gestora responsável pelas compras</td></tr>
    <tr><td><strong>Quantidade Pedido</strong></td><td>Número total de pedidos realizados no período</td></tr>
    <tr><td><strong>Valor Total</strong></td><td>Soma dos valores dos pedidos da secretaria no exercício selecionado</td></tr>
  </tbody>
</table>
<p>É possível alternar entre os anos <strong>2024</strong>, <strong>2025</strong> e <strong>2026</strong> utilizando os botões de filtro no topo da seção. O filtro atualiza a tabela instantaneamente, exibindo apenas os dados do exercício selecionado.</p>

<h2>2.6 Últimos Processos</h2>
<p>A seção <strong>Últimos Processos</strong> exibe os processos mais recentes cadastrados no sistema, organizados em três abas conforme o tipo: <strong>Contratação</strong>, <strong>Contrato</strong> e <strong>Compra</strong>.</p>
<table>
  <thead><tr><th>Coluna</th><th>Descrição</th></tr></thead>
  <tbody>
    <tr><td><strong>Contratação</strong></td><td>Número ou identificador do processo</td></tr>
    <tr><td><strong>Tipo</strong></td><td>Modalidade do processo (ex.: Pregão, Dispensa, Inexigibilidade)</td></tr>
    <tr><td><strong>Secretaria</strong></td><td>Unidade gestora demandante do processo</td></tr>
    <tr><td><strong>Objeto</strong></td><td>Descrição resumida do bem ou serviço contratado</td></tr>
    <tr><td><strong>Status</strong></td><td>Situação atual do processo (ex.: Em andamento, Concluído, Cancelado)</td></tr>
    <tr><td><strong>Valor Total</strong></td><td>Valor estimado ou homologado do processo</td></tr>
  </tbody>
</table>
<p>Clique na aba desejada para filtrar os processos pelo tipo. A lista exibe os registros mais recentes em ordem cronológica decrescente, facilitando o acompanhamento da atividade mais atual do órgão.</p>`;

  pages[key] = { ...p, content: p.content + extra };
  savePages();
  scheduleGitHubSave();
  console.log('[seed] Seções 2.4-2.6 do Dashboard adicionadas com sucesso');
}

if (GH_TOKEN) {
  loadFromGitHub().then(ghPages => {
    if (ghPages && Object.keys(ghPages).length > 0) {
      Object.assign(pages, ghPages);
      savePages();
      console.log('[github] dados restaurados com sucesso');
    }
    seedDashboardSections();
  });
  // Restaura whitelist do GitHub (filesystem do Render é efêmero)
  loadWhitelistFromGitHub().then(ghWl => {
    if (ghWl && Object.keys(ghWl).length > 0) {
      // Substitui completamente (não merge) para preservar deleções feitas via interface
      whitelist = ghWl;
      saveWhitelist(whitelist);
      console.log('[github] whitelist restaurada com sucesso');
    }
  });
} else {
  seedDashboardSections();
}

// ─── HTTP + Arquivos estáticos ─────────────────────────────────────────────
const path = require('path');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.css':  'text/css',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.url === '/whitelist') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(whitelist));
    return;
  }

  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', clients: clients.size }));
    return;
  }

  // Serve arquivos estáticos (frontend)
  const urlPath = req.url.split('?')[0]; // ignora query string (?v=N)
  let filePath = urlPath === '/' ? '/Index.html' : urlPath;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback: serve o Index.html para qualquer rota desconhecida
  const index = path.join(__dirname, 'Index.html');
  if (fs.existsSync(index)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(index).pipe(res);
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

// ─── WebSocket ─────────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ server });

function broadcast(data, except = null) {
  const msg = JSON.stringify(data);
  clients.forEach(ws => {
    if (ws !== except && ws.readyState === WebSocket.OPEN) ws.send(msg);
  });
}

function onlineList() {
  const list = [];
  clients.forEach(c => { if (c.userName) list.push({ name: c.userName, color: c.userColor, role: c.role }); });
  return list;
}

wss.on('connection', (ws) => {
  clients.add(ws);
  const serverEmpty = Object.keys(pages).length === 0;
  ws.send(JSON.stringify({ type: 'init', pages }));
  if (serverEmpty) ws.send(JSON.stringify({ type: 'request_pages' }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      if (msg.type === 'join') {
        ws.userName  = msg.name;
        ws.userColor = msg.color || '#6366f1';
        const joinNameLower = (msg.name || '').toLowerCase();
        const joinKey = Object.keys(whitelist).find(k => k.toLowerCase() === joinNameLower);
        ws.role = joinKey ? whitelist[joinKey] : 'viewer';
        console.log(`[+] ${ws.userName} -> ${ws.role}`);
        ws.send(JSON.stringify({ type: 'confirm_role', role: ws.role, whitelist }));
        broadcast({ type: 'online', users: onlineList() });
        ws.send(JSON.stringify({ type: 'online', users: onlineList() }));
        if (Object.keys(pages).length === 0) ws.send(JSON.stringify({ type: 'request_pages' }));
      }

      if (msg.type === 'pages_dump') {
        const dump = msg.pages || {};
        let count = 0;
        Object.entries(dump).forEach(([key, val]) => {
          if (!pages[key] && val && (val.content || val.title)) {
            pages[key] = val; count++;
          }
        });
        if (count > 0) {
          savePages();
          scheduleGitHubSave();
          console.log(`[pages_dump] ${count} páginas restauradas de ${ws.userName}`);
        }
      }

      if (msg.type === 'manage_users') {
        if (ws.role !== 'admin') return console.warn('Gestão negada para:', ws.userName);
        if (msg.action === 'add')    whitelist[msg.userName] = msg.userRole;
        if (msg.action === 'delete') delete whitelist[msg.userName];
        saveWhitelist(whitelist);
        scheduleWhitelistGitHubSave();
        clients.forEach(c => {
          if (c.role === 'admin' && c.readyState === WebSocket.OPEN)
            c.send(JSON.stringify({ type: 'whitelist_update', whitelist }));
        });
      }

      if (msg.type === 'page_update') {
        if (ws.role === 'viewer') return;
        pages[msg.pageKey] = { title: msg.title, content: msg.content, icon: msg.icon, intro: msg.intro || '', links: msg.links || [] };
        savePages();
        scheduleGitHubSave();
        broadcast({ type: 'page_update', pageKey: msg.pageKey, title: msg.title, content: msg.content, icon: msg.icon, intro: msg.intro || '', links: msg.links || [], author: ws.userName, color: ws.userColor }, ws);
      }

      if (msg.type === 'typing') {
        broadcast({ type: 'typing', pageKey: msg.pageKey, name: ws.userName, color: ws.userColor }, ws);
      }

    } catch (e) { console.error('Erro:', e.message); }
  });

  ws.on('close', () => { clients.delete(ws); console.log(`[-] ${ws.userName || '?'} saiu`); broadcast({ type: 'online', users: onlineList() }); });
  ws.on('error', err => console.error('WS erro:', err.message));
});

server.listen(PORT, '0.0.0.0', () => console.log(`✅ COMPRAGIL na porta ${PORT}`));
