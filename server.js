const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const PORT = process.env.PORT || 1234;
// Suporta tanto 'whitelist.json' quanto 'Whitelist.json' (compatibilidade Windows/Linux)
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

// ─── Persistência de páginas ───────────────────────────────────────────────
const PAGES_FILE = 'pages.json';

function loadPages() {
  try {
    if (fs.existsSync(PAGES_FILE)) {
      const data = JSON.parse(fs.readFileSync(PAGES_FILE, 'utf8'));
      console.log(`[pages] ${Object.keys(data).length} páginas carregadas do disco`);
      return data;
    }
  } catch (e) { console.error('Erro ao ler pages.json:', e.message); }
  return {};
}

function savePages() {
  try { fs.writeFileSync(PAGES_FILE, JSON.stringify(pages)); }
  catch (e) { console.error('Erro ao salvar pages.json:', e.message); }
}

const pages   = loadPages();
const clients = new Set();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // Endpoint público: retorna a whitelist para validar login em qualquer máquina
  if (req.url === '/whitelist') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(whitelist));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', clients: clients.size }));
});

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
  ws.send(JSON.stringify({ type: 'init', pages }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      if (msg.type === 'join') {
        ws.userName  = msg.name;
        ws.userColor = msg.color || '#6366f1';
        // Busca case-insensitive ("thales alexandre" encontra "Thales Alexandre")
        const joinNameLower = (msg.name || '').toLowerCase();
        const joinKey = Object.keys(whitelist).find(k => k.toLowerCase() === joinNameLower);
        ws.role = joinKey ? whitelist[joinKey] : 'viewer';
        console.log(`[+] ${ws.userName} -> ${ws.role}`);
        // Envia whitelist completa para TODOS — cliente salva no localStorage
        // Assim qualquer máquina fica sincronizada com a lista atual
        ws.send(JSON.stringify({ type: 'confirm_role', role: ws.role, whitelist }));
        broadcast({ type: 'online', users: onlineList() });
        ws.send(JSON.stringify({ type: 'online', users: onlineList() }));
      }

      if (msg.type === 'manage_users') {
        if (ws.role !== 'admin') return console.warn('Gestão negada para:', ws.userName);
        if (msg.action === 'add')    whitelist[msg.userName] = msg.userRole;
        if (msg.action === 'delete') delete whitelist[msg.userName];
        saveWhitelist(whitelist);
        clients.forEach(c => {
          if (c.role === 'admin' && c.readyState === WebSocket.OPEN)
            c.send(JSON.stringify({ type: 'whitelist_update', whitelist }));
        });
      }

      if (msg.type === 'page_update') {
        if (ws.role === 'viewer') return;
        pages[msg.pageKey] = { title: msg.title, content: msg.content, icon: msg.icon, intro: msg.intro || '', links: msg.links || [] };
        savePages();
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