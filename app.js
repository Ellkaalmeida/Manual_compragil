// ════════════════════════════════════════════════════════════════════════════
//  COMPRÁGIL — Colaborativo com WebSocket puro (sem dependências externas)
// ════════════════════════════════════════════════════════════════════════════
console.log('%c COMPRÁGIL app.js v=36 carregado ✓', 'background:#6366f1;color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold');

// Captura qualquer erro JS e exibe na tela (debug em file://)
window.onerror = function(msg, src, line, col, err) {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f43f5e;color:#fff;padding:8px 16px;font-size:12px;z-index:999999;font-family:monospace;white-space:pre-wrap';
  d.textContent = '❌ JS Error L' + line + ': ' + msg + (err ? '\n' + err.stack : '');
  document.body && document.body.appendChild(d);
  return false;
};

const WS_URL = 'wss://manual-compragil.onrender.com';

const USER_COLORS = ['#6366f1','#f43f5e','#10b981','#f59e0b','#3b82f6','#8b5cf6','#ec4899'];
const EMOJIS = ['📄','📋','📊','⚠️','🧾','⚖️','📁','🚫','🪪','📢','📝','🤝','🛒','🏭','📈','⊞','📌','🗂','🗒','🗃','📎','🖇','✅','❌','⭐','🔍','🔒','🔑','💡','📣','🏷','📬','🧮','📐','✅', '✔️','👈','👉','👆','👇','✍️','🗝️','🔐','🔓','🔒','🪛','🔗','📲','📱','🖥️','💻','🖨️','💾','💡','📖','💸','📍','⌛','🗑️','🗃️','🚩','🚨','❌','❓','❗','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪'];

const navItems = [
  {label:'Painel/Dashboard',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'},
  {label:'DFD',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>'},
  {label:'Processo Administrativo',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>'},
  {label:'ETP',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>'},
  {label:'Análise de Risco',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'},
  {label:'Cotação',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>'},
  {label:'Termo Referência',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'},
  {label:'Licitação',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><path d="M9 15l2-2 2 2 3-3"/></svg>'},
  {label:'Dispensa',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'},
  {label:'Inexigibilidade',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'},
  {label:'Credenciamento',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="8" cy="15" r="1" fill="currentColor"/><line x1="12" y1="14" x2="16" y2="14"/><line x1="12" y1="16" x2="15" y2="16"/></svg>'},
  {label:'Chamada Pública',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'},
  {label:'Atas',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="11" y2="16"/><polyline points="13 16 15 18 19 14"/></svg>'},
  {label:'Contratos',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'},
  {label:'Compras',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'},
  {label:'Almoxarifado',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l5-4h12l5 4"/><path d="M1 6v14a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V6"/><line x1="1" y1="6" x2="23" y2="6"/><path d="M9 6v6h6V6"/></svg>'},
  {label:'Relatórios',icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M3 20h18"/><path d="M6 14l3-3 3 3 4-4"/></svg>'}
];

const subnavItems = ['Introdução','Cadastros','Almoxarifado','Planejar','Solicitar','Cotar','Contratar','Comprar','Relatórios','Utilitários','Configuração','Atualização','Clientes','Extras'];

// ─── Estado global ─────────────────────────────────────────────────────────
let currentUser  = { name: '', color: USER_COLORS[0] };
let ws           = null;
let wsReady      = false;
let activePageKey = 'sidebar-0';
let activeIdx    = 0;
let currentMode  = 'sidebar';
let activeSubIdx = 0;
let typingTimer  = null;

// Cache local de páginas (persiste no localStorage para sobreviver a recargas)
const localPages = (() => {
  try {
    const saved = localStorage.getItem('compragil_pages');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return {};
})();

function stripImages(html) {
  // Remove src de imagens base64 para não estourar o localStorage (ficam só no servidor)
  return (html || '').replace(/(<img[^>]*)\ssrc="data:[^"]*"/gi, '$1 src=""');
}

function saveLocalPages() {
  // Tenta salvar com imagens (base64) para preservar conteúdo visual
  try {
    localStorage.setItem('compragil_pages', JSON.stringify(localPages));
    return;
  } catch(e) { /* quota excedida — tenta versão sem base64 */ }

  // Fallback: salva sem base64 se localStorage estiver cheio
  try {
    const slim = {};
    Object.entries(localPages).forEach(([k, v]) => {
      slim[k] = { ...v, content: stripImages(v.content) };
    });
    localStorage.setItem('compragil_pages', JSON.stringify(slim));
    console.warn('[localStorage] quota excedida, imagens removidas do cache local');
  } catch(e2) {
    // Último recurso: só títulos e ícones
    try {
      const minimal = {};
      Object.entries(localPages).forEach(([k, v]) => {
        minimal[k] = { title: v.title, icon: v.icon };
      });
      localStorage.setItem('compragil_pages', JSON.stringify(minimal));
    } catch(e3) { console.warn('localStorage cheio mesmo após limpeza:', e3); }
  }
}

// ─── Estilos ───────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.innerHTML = `
*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,sans-serif}
:root{--sidebar-w:220px;--top:56px;--sub:42px;--sidebar-bg:#2d3561;--sidebar-txt:#c7d2fe;--accent:#6366f1}
html,body,#app{height:100%;overflow:hidden}
.layout{display:flex;height:100vh;background:#f0f4f8}
.sidebar{width:var(--sidebar-w);min-width:var(--sidebar-w);background:linear-gradient(180deg,#2d3561 0%,#242c58 100%);display:flex;flex-direction:column;transition:.3s;overflow:hidden}
.sidebar.collapsed{width:56px;min-width:56px}
.s-logo{padding:0 14px;display:flex;align-items:center;gap:10px;height:var(--top);min-height:var(--top);flex-shrink:0}
.sidebar.collapsed .s-logo{padding:0 0 0 9px}
.toggle-btn{width:56px;min-width:56px;background:transparent;border:none;color:var(--sidebar-txt);cursor:pointer;height:100%;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
.toggle-btn:hover{background:rgba(255,255,255,.08)}
.toggle-btn svg{width:16px;height:16px;transition:transform .3s}
.sidebar.collapsed~.main .toggle-btn svg{transform:rotate(180deg)}
.logo-icon{width:36px;height:36px;min-width:36px;background:linear-gradient(135deg,#6366f1,#818cf8);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:#fff;box-shadow:0 2px 8px rgba(99,102,241,.45)}
.logo-text{overflow:hidden;white-space:nowrap;transition:opacity .2s}
.logo-text strong{display:block;font-size:13px;font-weight:700;color:#fff;letter-spacing:.4px}
.logo-text small{font-size:10px;color:#a5b4fc;letter-spacing:.2px}
.sidebar.collapsed .logo-text{opacity:0;width:0}
.s-nav{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 8px;display:flex;flex-direction:column;gap:1px}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;white-space:nowrap;color:rgba(199,210,254,.7);transition:background .18s,color .18s;font-size:13px;position:relative;overflow:hidden}
.nav-item:hover{background:rgba(255,255,255,.07);color:#e0e7ff}
.nav-item.active{background:rgba(99,102,241,.28);color:#fff;box-shadow:inset 3px 0 0 #6366f1}
.nav-icon{min-width:26px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:6px;transition:background .18s,color .18s;color:rgba(165,180,252,.7)}
.nav-icon svg{width:15px;height:15px;display:block}
.nav-item:hover .nav-icon{color:#a5b4fc}
.nav-item.active .nav-icon{color:#c7d2fe}
.nav-label{overflow:hidden;transition:opacity .2s;white-space:nowrap;font-size:12.5px}
.sidebar.collapsed .nav-label{opacity:0;width:0}
.nav-tip{position:fixed;left:64px;background:#1a2040;color:#e0e7ff;font-size:11px;padding:5px 10px;border-radius:7px;white-space:nowrap;opacity:0;pointer-events:none;z-index:9999;border:1px solid rgba(99,102,241,.25);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.sidebar.collapsed .nav-item:hover .nav-tip{opacity:1}
.online-section{padding:10px 8px 14px;border-top:1px solid rgba(255,255,255,.06)}
.online-title{font-size:10px;color:rgba(165,180,252,.6);text-transform:uppercase;letter-spacing:.9px;padding:0 4px 8px;overflow:hidden;white-space:nowrap;transition:opacity .2s}
.sidebar.collapsed .online-title{opacity:0}
.online-list{display:flex;flex-direction:column;gap:3px}
.online-user{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:6px}
.online-avatar{width:26px;height:26px;min-width:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;position:relative;flex-shrink:0;box-shadow:0 0 0 2px rgba(255,255,255,.1)}
.online-avatar::after{content:'';position:absolute;bottom:0;right:0;width:7px;height:7px;background:#10b981;border-radius:50%;border:2px solid var(--sidebar-bg)}
.online-name{font-size:12px;color:#c7d2fe;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;transition:opacity .2s}
.sidebar.collapsed .online-name{opacity:0;width:0}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{background:var(--sidebar-bg);display:flex;align-items:center;padding:0 16px 0 0;height:var(--top);flex-shrink:0;box-shadow:0 1px 0 rgba(255,255,255,.07),0 2px 16px rgba(0,0,0,.2)}
.topbar-title{color:rgba(255,255,255,.88);font-size:13px;font-weight:600;padding:0 16px;margin-right:auto;white-space:nowrap;letter-spacing:.25px}
.topbar-user{color:var(--sidebar-txt);font-size:12px;white-space:nowrap}
.topbar-actions-wrap{display:flex;align-items:center;gap:6px}
.topbar-collapse-btn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.4);width:22px;height:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:background .15s,color .15s,border-color .15s;flex-shrink:0;padding:0}
.topbar-collapse-btn:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.8)}
.topbar-collapse-btn svg{transition:transform .3s ease}
.topbar-collapse-btn.collapsed svg{transform:rotate(180deg)}
.topbar-actions{display:flex;align-items:center;gap:1px;padding:0 4px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.07);border-radius:10px;overflow:hidden;max-width:600px;transition:max-width .3s ease,opacity .25s ease,padding .3s ease;opacity:1}
.topbar-actions.collapsed{max-width:0;opacity:0;pointer-events:none;padding:0;border-color:transparent}
.topbar-actions button{background:transparent;border:none;color:rgba(255,255,255,.55);padding:5px 10px;border-radius:7px;font-size:13px;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap;display:flex;align-items:center;gap:6px;position:relative;height:32px}
.topbar-actions button:hover{background:rgba(255,255,255,.1);color:#fff}
.topbar-actions button:active{background:rgba(255,255,255,.06)}
.topbar-actions button .btn-label{font-size:10.5px;font-weight:500;letter-spacing:.2px}
.topbar-action-sep{width:1px;height:18px;background:rgba(255,255,255,.1);margin:0 2px;flex-shrink:0}
.btn-icon{width:14px;height:14px;flex-shrink:0;opacity:.8;transition:opacity .15s}
.topbar-actions button:hover .btn-icon{opacity:1}
#previewBtn{display:flex;align-items:center;gap:6px}
.topbar-actions .btn-save{color:#a5b4fc;background:rgba(99,102,241,.22);border:1px solid rgba(99,102,241,.3)}
.topbar-actions .btn-save:hover{background:rgba(99,102,241,.42);color:#fff;border-color:rgba(99,102,241,.55)}
.subnav{background:#fff;display:flex;align-items:center;flex-wrap:wrap;min-height:var(--sub);border-bottom:1px solid #e2e8f0;flex-shrink:0;overflow:visible}
.subnav-item{font-size:12.5px;color:#64748b;padding:0 12px;height:var(--sub);display:flex;align-items:center;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;transition:color .2s}
.subnav-item:hover{color:#1e293b}
.subnav-item.active{color:#2d3561;font-weight:600;border-bottom-color:#2d3561}
.editor-wrap{flex:1;display:flex;overflow:hidden}
.editor-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#fff}
.page-header{padding:6px 60px 0}
.page-icon-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.page-icon-btn{background:none;border:none;cursor:pointer;font-size:30px;padding:4px 6px;border-radius:6px;transition:background .2s;line-height:1}
.page-icon-btn:hover{background:#f1f5f9}
.page-title-input{width:100%;border:none;outline:none;font-size:26px;font-weight:700;color:#1e293b;background:transparent;padding:0 0 8px;resize:none;line-height:1.3;overflow:hidden}
.page-title-input::placeholder{color:#cbd5e1}
.toolbar{position:fixed;background:#1e293b;border-radius:8px;padding:4px 6px;display:none;align-items:center;gap:2px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.25)}
.toolbar.visible{display:flex}
.tb-color-wrap{position:relative;display:flex;align-items:center}
.tb-color-apply{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 6px!important;border-radius:6px 0 0 6px!important}
.tb-color-toggle{padding:4px 4px!important;font-size:9px!important;border-radius:0 6px 6px 0!important;border-left:1px solid rgba(255,255,255,.1)!important}
.tb-color-bar{display:block;width:14px;height:3px;border-radius:2px;background:#ef4444;transition:background .15s}
.tb-color-palette{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px;display:none;z-index:10001;box-shadow:0 8px 32px rgba(0,0,0,.4);width:170px}
.tb-color-palette.open{display:block}
.tb-color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:8px}
.tb-swatch{width:24px;height:24px;border-radius:5px;cursor:pointer;display:block;transition:transform .1s,box-shadow .1s}
.tb-swatch:hover{transform:scale(1.2);box-shadow:0 2px 8px rgba(0,0,0,.4)}
.tb-color-custom-label{display:flex;align-items:center;gap:7px;cursor:pointer;border-top:1px solid rgba(255,255,255,.08);padding-top:8px;color:rgba(255,255,255,.6);font-size:11px}
.tb-color-custom-label input[type=color]{width:24px;height:24px;border:none;border-radius:5px;padding:0;cursor:pointer;background:none}
.tb-color-custom-label:hover{color:#fff}
.tb-btn{background:none;border:none;cursor:pointer;padding:5px 7px;border-radius:5px;font-size:13px;color:#e2e8f0;font-weight:500;transition:background .15s;white-space:nowrap}
.tb-btn:hover{background:rgba(255,255,255,.15);color:#fff}
.tb-sep{width:1px;height:16px;background:rgba(255,255,255,.2);margin:0 2px;flex-shrink:0}
.editor-scroll{flex:1;overflow-y:auto}
.editor-content.readonly-mode {background-color: #f8fafc;cursor: not-allowed;caret-color: transparent;}
.readonly-mode ~ .toolbar {display: none !important;}
.editor-content{padding:12px 60px 60px;outline:none;font-size:15px;line-height:1.7;color:#334155;caret-color:#6366f1;min-height:200px}
.editor-content:empty::before{content:attr(data-placeholder);color:#cbd5e1;pointer-events:none;display:block}
.editor-content h1{font-size:22px;font-weight:700;color:#0f172a;margin:20px 0 8px}
.editor-content h2{font-size:18px;font-weight:600;color:#1e293b;margin:16px 0 6px}
.editor-content h3{font-size:15px;font-weight:600;color:#334155;margin:12px 0 4px}
.editor-content p{margin:0 0 4px}
.editor-content ul,.editor-content ol{padding-left:24px;margin:6px 0}
.editor-content li{margin:2px 0}
.editor-content blockquote{border-left:3px solid #c7d2fe;padding-left:14px;color:#64748b;margin:8px 0}
.editor-content pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:13px;overflow-x:auto;margin:8px 0}
.html-code-block{background:#0f172a;color:#e2e8f0;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.7;padding:16px 20px;border-radius:10px;margin:8px 0;overflow-x:auto;white-space:pre-wrap;word-break:break-all;border:1px solid rgba(255,255,255,.08);display:block}
.code-del-btn{background:none;border:none;color:#475569;font-size:15px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:4px;margin-left:auto;transition:color .15s,background .15s;user-select:none}
.code-del-btn:hover{color:#f87171;background:rgba(248,113,113,.12)}
.editor-task{display:flex;align-items:flex-start;gap:8px;margin:3px 0;line-height:1.6}
.task-cb{display:inline-flex;align-items:center;justify-content:center;width:15px;min-width:15px;height:15px;border:2px solid #94a3b8;border-radius:3px;cursor:pointer;margin-top:3px;transition:all .15s;user-select:none}
.task-cb[data-checked="1"]{background:#6366f1;border-color:#6366f1}
.task-cb[data-checked="1"]::after{content:'✓';color:#fff;font-size:10px;font-weight:700;line-height:1}
.task-label{flex:1;min-width:0;outline:none}
.task-label.done{color:#94a3b8;text-decoration:line-through}
.editor-content hr{border:none;border-top:1px solid #e2e8f0;margin:16px 0}
.editor-content img{max-width:100%;border-radius:8px;margin:8px 0;display:block}
.editor-content img[src=""]{display:none}
.editor-content a[href]{color:#6366f1;text-decoration:underline}
.editor-content a:not([href]){color:inherit;text-decoration:none}
.editor-content table{border-collapse:collapse;width:100%;margin:8px 0}
.editor-content td,.editor-content th{border:1px solid #e2e8f0;padding:6px 10px;font-size:14px}
.editor-content th{background:#f8fafc;font-weight:600}
.status-bar{height:28px;border-top:1px solid #f1f5f9;padding:0 60px;display:flex;align-items:center;gap:16px;font-size:11px;color:#94a3b8;flex-shrink:0;background:#fff}
.login-overlay{position:fixed;inset:0;background:rgba(15,23,42,.85);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.login-box{background:#fff;border-radius:16px;padding:40px;width:360px;box-shadow:0 24px 60px rgba(0,0,0,.3);text-align:center}
.login-logo{width:56px;height:56px;background:#2d3561;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;margin:0 auto 16px}
.login-box h2{font-size:20px;font-weight:700;color:#1e293b;margin-bottom:4px}
.login-box p{font-size:13px;color:#64748b;margin-bottom:24px}
.login-box input{width:100%;border:1.5px solid #e2e8f0;border-radius:8px;padding:10px 14px;font-size:14px;outline:none;transition:border .2s;margin-bottom:12px}
.login-box input:focus{border-color:#6366f1}
.color-picker-row{display:flex;gap:8px;justify-content:center;margin-bottom:20px}
.color-opt{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:transform .15s,border .15s}
.color-opt:hover{transform:scale(1.15)}
.color-opt.selected{border-color:#1e293b;transform:scale(1.15)}
.login-btn{width:100%;background:#2d3561;color:#fff;border:none;border-radius:8px;padding:12px;font-size:14px;font-weight:600;cursor:pointer}
.login-btn:hover{background:#1e2340}
.emoji-picker{position:fixed;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.12);display:none;flex-wrap:wrap;gap:4px;width:220px}
.emoji-picker.show{display:flex}
.ep-emoji{font-size:20px;cursor:pointer;padding:4px;border-radius:4px;line-height:1}
.ep-emoji:hover{background:#f1f5f9}
.drop-overlay{position:fixed;inset:0;background:rgba(99,102,241,.1);border:3px dashed #6366f1;z-index:9998;display:none;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#4338ca;font-size:16px;font-weight:600;pointer-events:none}
.drop-overlay.show{display:flex}
.img-upload-btn{display:none}
.typing-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;color:#fff;margin-right:4px}
.logo-icon{cursor:pointer;transition:transform .15s,box-shadow .15s}
.logo-icon:hover{transform:scale(1.08);box-shadow:0 0 0 3px rgba(99,102,241,.35)}
.notes-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:9990;display:none;backdrop-filter:blur(3px)}
.notes-overlay.open{display:block}
.notes-drawer{position:fixed;top:0;left:0;width:400px;height:100vh;background:#f8fafc;z-index:9991;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);box-shadow:8px 0 40px rgba(15,23,42,.22)}
.notes-drawer.open{transform:translateX(0)}
.notes-drawer-header{background:#2d3561;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.notes-drawer-logo{display:flex;align-items:center;gap:12px}
.notes-drawer-badge{width:36px;height:36px;border-radius:9px;background:#fff;color:#2d3561;font-size:17px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.notes-drawer-title strong{display:block;font-size:13px;font-weight:700;letter-spacing:.5px;color:#fff}
.notes-drawer-title small{font-size:10px;color:#a5b4fc}
.notes-close-btn{background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.8);width:30px;height:30px;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.notes-close-btn:hover{background:rgba(255,255,255,.22);color:#fff}
.notes-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:20px;display:flex;flex-direction:column;gap:20px}
.notes-section{background:#fff;border-radius:12px;padding:16px;border:1px solid #e8edf4;box-shadow:0 1px 4px rgba(15,23,42,.05)}
.notes-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.notes-section-label{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2d3561;margin:0}
.notes-section-label svg{width:14px;height:14px;color:#6366f1;flex-shrink:0}
.notes-btn-inline-add{background:#eef2ff;border:none;color:#6366f1;width:26px;height:26px;border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s;flex-shrink:0}
.notes-btn-inline-add:hover{background:#6366f1;color:#fff}
.notes-textarea{width:100%;min-height:150px;border:1.5px solid #e2e8f0;border-radius:8px;padding:11px 13px;font-size:13px;line-height:1.7;color:#334155;background:#f8fafc;resize:vertical;font-family:Inter,sans-serif;box-sizing:border-box;transition:border .2s,background .2s}
.notes-textarea:focus{outline:none;border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.notes-link-list{display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
.notes-link-item{display:flex;align-items:stretch;border:1px solid #e8edf4;border-left:3px solid #6366f1;border-radius:10px;background:#fff;overflow:hidden;transition:border-color .15s,box-shadow .15s}
.notes-link-item:hover{border-color:#c7d2fe;border-left-color:#6366f1;box-shadow:0 3px 10px rgba(99,102,241,.12)}
.notes-link-anchor{flex:1;display:flex;align-items:center;gap:10px;padding:11px 12px;text-decoration:none;color:#334155;overflow:hidden;min-width:0}
.notes-link-anchor .nl-icon{flex-shrink:0;color:#6366f1;display:flex;opacity:.8}
.notes-link-info{overflow:hidden;min-width:0;flex:1}
.notes-link-name{font-weight:600;margin:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#1e293b}
.notes-link-url{font-size:11px;color:#94a3b8;margin:2px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.notes-link-ext{flex-shrink:0;color:#c7d2fe;display:flex;padding:0 10px;align-items:center;opacity:0;transition:opacity .15s}
.notes-link-item:hover .notes-link-ext{opacity:1}
.notes-link-del{border:none;background:none;cursor:pointer;color:#cbd5e1;padding:0 12px;display:flex;align-items:center;flex-shrink:0;transition:background .15s,color .15s;opacity:0}
.notes-link-item:hover .notes-link-del{opacity:1}
.notes-link-del:hover{background:#fee2e2;color:#f43f5e}
.notes-empty{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 0 8px;color:#94a3b8;font-size:12px;font-style:italic}
.notes-empty svg{opacity:.35}
.notes-btn-add-trigger{width:100%;padding:9px;background:#f8faff;color:#6366f1;border:1.5px solid #e0e7ff;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s,border-color .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.notes-btn-add-trigger:hover{background:#eef2ff;border-color:#a5b4fc}
.notes-add-form{display:none;flex-direction:column;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid #e8edf4}
.notes-add-form.open{display:flex}
.notes-input-wrap{position:relative;display:flex;align-items:center}
.notes-input-wrap svg{position:absolute;left:11px;color:#94a3b8;flex-shrink:0;pointer-events:none}
.notes-input-wrap input{width:100%;border:1.5px solid #e2e8f0;border-radius:8px;padding:9px 12px 9px 34px;font-size:13px;color:#334155;background:#f8fafc;font-family:Inter,sans-serif;transition:border .2s,background .2s;box-sizing:border-box}
.notes-input-wrap input:focus{outline:none;border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.notes-form-actions{display:flex;gap:8px}
.notes-btn-confirm{flex:1;padding:9px;background:#2d3561;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.notes-btn-confirm:hover{background:#6366f1}
.notes-btn-cancel{padding:9px 14px;background:#f1f5f9;color:#64748b;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s}
.notes-btn-cancel:hover{background:#e2e8f0}
.notes-footer{padding:14px 20px;background:#fff;border-top:1px solid #e8edf4;flex-shrink:0}
.notes-btn-save{width:100%;padding:11px;background:#2d3561;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;gap:7px}
.notes-btn-save:hover{background:#6366f1}
.notes-saved-msg{text-align:center;font-size:11px;color:#10b981;margin-top:8px;height:16px;transition:opacity .3s;font-weight:500}

/* ── Search overlay ── */
.search-overlay{position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:99995;display:none;align-items:flex-start;justify-content:center;padding-top:80px;backdrop-filter:blur(4px)}
.search-overlay.open{display:flex}
.search-modal{background:#fff;border-radius:14px;width:680px;max-width:95vw;box-shadow:0 24px 60px rgba(0,0,0,.3);display:flex;flex-direction:column;max-height:70vh;overflow:hidden}
.search-header{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #e2e8f0}
.search-header-icon{font-size:17px;color:#6366f1;flex-shrink:0}
.search-input{flex:1;border:none;outline:none;font-size:15px;color:#1e293b;font-family:Inter,sans-serif;background:transparent}
.search-input::placeholder{color:#94a3b8}
.search-close-btn{background:none;border:none;cursor:pointer;color:#94a3b8;font-size:18px;padding:2px 6px;border-radius:6px;transition:color .15s}
.search-close-btn:hover{color:#334155}
.search-results{flex:1;overflow-y:auto;padding:10px 8px}
.search-empty{text-align:center;padding:32px 16px;color:#94a3b8;font-size:13px}
.search-result-item{padding:10px 12px;border-radius:9px;cursor:pointer;transition:background .15s;margin-bottom:4px;border:1px solid transparent}
.search-result-item:hover{background:#f1f5ff;border-color:#c7d2fe}
.search-result-title{font-size:13px;font-weight:600;color:#1e293b;display:flex;align-items:center;gap:6px;margin-bottom:4px}
.search-result-page{font-size:10px;color:#6366f1;background:#eef2ff;padding:1px 7px;border-radius:10px;font-weight:600;flex-shrink:0}
.search-result-snippet{font-size:12px;color:#64748b;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.search-result-snippet mark{background:#fef08a;color:#713f12;border-radius:2px;padding:0 2px;font-style:normal}
.search-count{font-size:11px;color:#94a3b8;padding:6px 12px 0;border-top:1px solid #f1f5f9;margin-top:4px}
.search-btn{}
.search-btn:hover{background:rgba(255,255,255,.12);color:#fff}

/* ── Clients Panel ── */
.clients-panel{padding:36px 52px 60px;overflow-y:auto;flex:1;display:none;background:#f0f4f8}
.clients-panel.visible{display:block}
.clients-header{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.clients-header-icon{display:none}
.clients-header-text{flex:1}
.clients-title{font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-.3px}
.clients-form{display:flex;gap:14px;margin-bottom:16px;background:#fff;border-radius:14px;padding:20px 24px;flex-wrap:wrap;align-items:flex-end;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.clients-form-field{display:flex;flex-direction:column;gap:6px;flex:1;min-width:140px}
.clients-form-field label{font-size:10.5px;font-weight:600;letter-spacing:.05em;color:#94a3b8;text-transform:uppercase}
.clients-form-field input{border:1px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:13px;color:#1e293b;outline:none;transition:border .15s,box-shadow .15s;background:#fff}
.clients-form-field input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08)}
.clients-form-add{background:#2d3561;color:#fff;border:none;border-radius:8px;padding:0 22px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s;height:40px;align-self:flex-end}
.clients-form-add:hover{background:#6366f1}
.clients-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.clients-filter{flex:1;border:1px solid #e2e8f0;border-radius:9px;padding:9px 14px 9px 38px;font-size:13px;color:#1e293b;outline:none;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 13px center;box-shadow:0 1px 2px rgba(0,0,0,.04);transition:border .15s,box-shadow .15s}
.clients-filter:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08)}
.clients-copy-all-btn{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;color:#334155;cursor:pointer;white-space:nowrap;transition:all .15s;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.clients-copy-all-btn:hover{border-color:#6366f1;color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.08)}
.clients-copy-all-btn.copied{background:#f0fdf4;border-color:#86efac;color:#15803d}
.clients-table-wrap{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.clients-table{width:100%;border-collapse:collapse}
.clients-table th{background:#f8fafc;color:#94a3b8;font-size:10.5px;font-weight:700;padding:11px 16px;text-align:left;letter-spacing:.07em;text-transform:uppercase;border-bottom:1px solid #f1f5f9}
.clients-table td{padding:13px 16px;font-size:13px;color:#334155;border-bottom:1px solid #f8fafc;vertical-align:middle}
.clients-table tr:last-child td{border-bottom:none}
.clients-table tbody tr{transition:background .1s}
.clients-table tbody tr:hover td{background:#fafbff}
.clients-row-actions{display:flex;gap:4px;justify-content:flex-end;opacity:0;transition:opacity .15s}
.clients-table tbody tr:hover .clients-row-actions{opacity:1}
.clients-row-edit,.clients-row-del{background:transparent;border:1px solid #e2e8f0;border-radius:7px;width:28px;height:28px;padding:0;cursor:pointer;transition:all .15s;color:#94a3b8;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.clients-row-edit:hover{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
.clients-row-del:hover{background:#fef2f2;border-color:#fecaca;color:#dc2626}
.clients-row-save,.clients-row-cancel{border:none;border-radius:7px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px}
.clients-row-save{background:#6366f1;color:#fff}
.clients-row-save:hover{background:#4338ca}
.clients-row-cancel{background:#f1f5f9;color:#64748b}
.clients-row-cancel:hover{background:#e2e8f0}
.clients-footer{margin-top:16px;font-size:12px;color:#cbd5e1;padding-bottom:8px;text-align:center}
.status-badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:20px;white-space:nowrap}
.status-badge::before{content:'';width:6px;height:6px;border-radius:50%;flex-shrink:0}
.status-ativo{background:#f0fdf4;color:#16a34a}.status-ativo::before{background:#16a34a}
.status-bloqueado{background:#fef2f2;color:#dc2626}.status-bloqueado::before{background:#dc2626}
.status-offline{background:#f8fafc;color:#94a3b8}.status-offline::before{background:#cbd5e1}
.clients-status-select{border:1px solid #e2e8f0;border-radius:8px;padding:9px 10px;font-size:13px;color:#1e293b;outline:none;background:#fff;cursor:pointer;transition:border .15s}
.clients-status-select:focus{border-color:#6366f1}
.clients-empty{text-align:center;padding:60px 20px;color:#94a3b8;font-size:14px}
.clients-edit-input{border:1px solid #6366f1;border-radius:7px;padding:7px 10px;font-size:13px;color:#1e293b;outline:none;width:100%;background:#fff;box-sizing:border-box;box-shadow:0 0 0 3px rgba(99,102,241,.08)}

/* ── Image resize toolbar ── */
.img-resize-toolbar{position:fixed;background:#1e293b;border-radius:8px;padding:5px 8px;display:none;align-items:center;gap:4px;z-index:9997;box-shadow:0 4px 20px rgba(0,0,0,.3)}
.img-resize-toolbar.visible{display:flex}
.img-resize-toolbar input[type=range]{width:80px;accent-color:#6366f1;cursor:pointer;vertical-align:middle}
.img-resize-toolbar .it-pct{font-size:11px;color:#e2e8f0;min-width:34px;text-align:center;font-weight:700}
.it-preset{border:1px solid rgba(255,255,255,.2);background:transparent;color:#e2e8f0;border-radius:5px;padding:3px 7px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;line-height:1}
.it-preset:hover{background:rgba(255,255,255,.12)}
.it-preset.it-active{background:#4338ca;color:#fff;border-color:#6366f1}
.img-selected{outline:3px solid #6366f1 !important;outline-offset:3px;cursor:pointer}
.it-align-btn{background:none;border:1px solid rgba(255,255,255,.2);color:#e2e8f0;border-radius:5px;padding:3px 7px;font-size:12px;cursor:pointer;transition:all .15s;line-height:1}
.it-align-btn:hover{background:rgba(255,255,255,.12)}
.it-del-btn{background:none;border:1px solid rgba(244,63,94,.4);color:#f43f5e;border-radius:5px;padding:3px 7px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;line-height:1}
.it-del-btn:hover{background:rgba(244,63,94,.15)}

/* ── Table edit toolbar ── */
.tbl-edit-toolbar{position:fixed;background:#1e293b;border-radius:8px;padding:4px 6px;display:none;align-items:center;gap:2px;z-index:9997;box-shadow:0 4px 20px rgba(0,0,0,.3);white-space:nowrap}
.tbl-edit-toolbar.visible{display:flex}
.tbl-active td,.tbl-active th{border-color:#6366f1 !important}
.tbl-edit-toolbar .tb-btn{font-size:11px;padding:4px 7px}
.tbl-del-btn{background:none;border:none;color:#f43f5e;padding:4px 7px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;transition:background .15s;white-space:nowrap}
.tbl-del-btn:hover{background:rgba(244,63,94,.15)}
`;
document.head.appendChild(style);

// ─── HTML ──────────────────────────────────────────────────────────────────
document.getElementById('app').innerHTML = `
<div class="login-overlay" id="loginOverlay">
  <div class="login-box">
    <div class="login-logo">C</div>
    <h2>Manual COMPRÁGIL</h2>
    <p>O wikipedia do Compragil web</p>
    <input type="text" id="loginName" placeholder="Digite seu login..." maxlength="40" />
    <div class="color-picker-row" id="colorPicker"></div>
    <label style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#64748b;margin-bottom:16px;cursor:pointer;line-height:14px">
      <input type="checkbox" id="rememberMe" style="width:14px;height:14px;accent-color:#6366f1;margin:0;display:block"/> Lembrar meu nome
    </label>
    <button class="login-btn" id="loginBtn">Entrar</button>
  </div>
</div>

<div class="layout">
  <aside class="sidebar" id="sidebar">
    <div class="s-logo">
      <div class="logo-icon" id="logoIconBtn" title="Notas & Links do manual">C</div>
      <div class="logo-text"><strong>COMPRÁGIL</strong><small>Sistema de compras públicas</small></div>
    </div>
    <nav class="s-nav" id="sidebarNav"></nav>
    <div class="online-section">
      <div class="online-title">● Online agora</div>
      <div class="online-list" id="onlineList"></div>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <button class="toggle-btn" id="toggleBtn" title="Recolher/expandir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="topbar-title">Manual Compra ágil Web</span>
      <span id="roleBadge" style="display:none"></span>
      <span style="flex:1"></span>
      <span class="topbar-user" id="breadcrumb" style="display:none">—</span>
      <div class="topbar-actions-wrap">
        <button class="topbar-collapse-btn" id="topbarCollapseBtn" title="Recolher/expandir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="topbar-actions" id="topbarActions">
          <button class="search-btn" id="searchBtn" title="Buscar (Ctrl+K)"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><span class="btn-label">Buscar</span></button>
          <button id="previewBtn" title="Visualizar"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><span class="btn-label">Visualizar</span></button>
          <button id="exportBtn" title="Exportar PDF"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg><span class="btn-label">PDF</span></button>
          <div class="topbar-action-sep" id="editSep" style="display:none"></div>
          <button id="clearBtn" title="Limpar página" style="display:none"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg><span class="btn-label">Limpar</span></button>
          <button class="btn-save" id="saveBtn" title="Salvar" style="display:none"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg><span class="btn-label">Salvar</span></button>
          <div class="topbar-action-sep" id="adminSep" style="display:none"></div>
          <button id="adminBtn" title="Gerenciar usuários" style="display:none"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="btn-label">Admin</span></button>
          <button id="logoutBtn" title="Sair"><svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span class="btn-label">Sair</span></button>
        </div>
      </div>
    </div>
    <div class="subnav" id="subnav"></div>
    <div class="editor-wrap">
      <div class="editor-main">
        <div class="emoji-picker" id="emojiPicker"></div>
        <div class="toolbar" id="toolbar">
          <button class="tb-btn" data-cmd="bold"><b>N</b></button>
          <button class="tb-btn" data-cmd="italic"><i>I</i></button>
          <button class="tb-btn" data-cmd="underline"><u>S</u></button>
          <button class="tb-btn" data-cmd="strikeThrough"><s>R</s></button>
          <div class="tb-sep"></div>
          <button class="tb-btn" data-cmd="h1">H1</button>
          <button class="tb-btn" data-cmd="h2">H2</button>
          <button class="tb-btn" data-cmd="h3">H3</button>
          <div class="tb-sep"></div>
          <button class="tb-btn" data-cmd="insertUnorderedList">• Lista</button>
          <button class="tb-btn" data-cmd="insertOrderedList">1. Num.</button>
          <button class="tb-btn" data-cmd="blockquote">❝ Citar</button>
          <button class="tb-btn" id="checkboxBtn" title="Inserir checkbox">☑ Check</button>
          <div class="tb-sep"></div>
          <div class="tb-color-wrap" id="tbColorWrap">
            <button class="tb-btn tb-color-apply" id="tbColorApply" title="Aplicar cor (última usada)">
              <span style="font-weight:700;font-size:13px;line-height:1">A</span>
              <span class="tb-color-bar" id="tbColorBar"></span>
            </button>
            <button class="tb-btn tb-color-toggle" id="tbColorToggle" title="Escolher cor">▾</button>
            <div class="tb-color-palette" id="tbColorPalette">
              <div class="tb-color-grid">
                <span class="tb-swatch" data-color="#000000" style="background:#000000" title="Preto"></span>
                <span class="tb-swatch" data-color="#374151" style="background:#374151" title="Cinza escuro"></span>
                <span class="tb-swatch" data-color="#6b7280" style="background:#6b7280" title="Cinza"></span>
                <span class="tb-swatch" data-color="#94a3b8" style="background:#94a3b8" title="Cinza claro"></span>
                <span class="tb-swatch" data-color="#ffffff" style="background:#fff;border:1px solid #475569" title="Branco"></span>
                <span class="tb-swatch" data-color="#ef4444" style="background:#ef4444" title="Vermelho"></span>
                <span class="tb-swatch" data-color="#f97316" style="background:#f97316" title="Laranja"></span>
                <span class="tb-swatch" data-color="#eab308" style="background:#eab308" title="Amarelo"></span>
                <span class="tb-swatch" data-color="#22c55e" style="background:#22c55e" title="Verde"></span>
                <span class="tb-swatch" data-color="#3b82f6" style="background:#3b82f6" title="Azul"></span>
                <span class="tb-swatch" data-color="#6366f1" style="background:#6366f1" title="Índigo"></span>
                <span class="tb-swatch" data-color="#8b5cf6" style="background:#8b5cf6" title="Roxo"></span>
                <span class="tb-swatch" data-color="#ec4899" style="background:#ec4899" title="Rosa"></span>
                <span class="tb-swatch" data-color="#14b8a6" style="background:#14b8a6" title="Teal"></span>
                <span class="tb-swatch" data-color="#f43f5e" style="background:#f43f5e" title="Rosa forte"></span>
                <span class="tb-swatch" data-color="#2d3561" style="background:#2d3561" title="Azul escuro"></span>
              </div>
              <label class="tb-color-custom-label" title="Cor personalizada">
                <input type="color" id="tbColorCustom" value="#ef4444"/>
                <span>Personalizado</span>
              </label>
            </div>
          </div>
          <div class="tb-sep"></div>
          <button class="tb-btn" id="linkBtn">🔗 Link</button>
          <button class="tb-btn" id="tableBtn">⊞ Tabela</button>
          <button class="tb-btn" id="imgUploadTrigger"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Imagem</button>
          <input type="file" id="imgFileInput" accept="image/*" class="img-upload-btn"/>
          <button class="tb-btn" id="htmlPasteBtn" title="Inserir bloco de código HTML"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Código</button>
        </div>

        <!-- Image resize toolbar (shown on image click) -->
        <div class="img-resize-toolbar" id="imgResizeToolbar">
          <span style="color:#94a3b8;margin-right:2px;display:flex;align-items:center"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
          <input type="range" id="_itRange" min="10" max="100" value="100"/>
          <span class="it-pct" id="_itPct">100%</span>
          <div class="tb-sep"></div>
          <button class="it-preset" data-v="25">25%</button>
          <button class="it-preset" data-v="50">50%</button>
          <button class="it-preset" data-v="75">75%</button>
          <button class="it-preset" data-v="100">100%</button>
          <div class="tb-sep"></div>
          <button class="it-align-btn" id="_itAlignLeft" title="Alinhar à esquerda">◀</button>
          <button class="it-align-btn" id="_itAlignCenter" title="Centralizar">▐▌</button>
          <button class="it-align-btn" id="_itAlignRight" title="Alinhar à direita">▶</button>
          <div class="tb-sep"></div>
          <button class="it-del-btn" id="_itDelete" title="Remover imagem">🗑</button>
        </div>

        <!-- Table edit toolbar (shown on table cell click) -->
        <div class="tbl-edit-toolbar" id="tblEditToolbar">
          <button class="tb-btn" id="_tblAddRowAbove" title="Inserir linha acima">↑ Linha</button>
          <button class="tb-btn" id="_tblAddRowBelow" title="Inserir linha abaixo">↓ Linha</button>
          <div class="tb-sep"></div>
          <button class="tb-btn" id="_tblAddColLeft" title="Inserir coluna à esquerda">← Col</button>
          <button class="tb-btn" id="_tblAddColRight" title="Inserir coluna à direita">→ Col</button>
          <div class="tb-sep"></div>
          <button class="tb-btn" id="_tblDelRow" title="Remover linha">✕ Linha</button>
          <button class="tb-btn" id="_tblDelCol" title="Remover coluna">✕ Col</button>
          <div class="tb-sep"></div>
          <button class="tbl-del-btn" id="_tblDelete" title="Remover tabela">🗑 Tabela</button>
        </div>
        <!-- Clients Panel -->
        <div class="clients-panel" id="clientsPanel"></div>

        <div class="editor-scroll" id="editorScroll">
          <div class="page-header">
            <div class="page-icon-row">
              <button class="page-icon-btn" id="iconBtn">📄</button>
              <span style="font-size:11px;color:#94a3b8">Clique no ícone para mudar</span>
            </div>
            <textarea class="page-title-input" id="pageTitle" rows="1" placeholder="Título da página..." spellcheck="false"></textarea>
          </div>
          <div class="editor-content" id="editor" contenteditable="true"
               data-placeholder="Comece a escrever... Todos veem em tempo real."></div>
        </div>
        <div class="status-bar">
          <span id="wordCount">0 palavras</span>
          <span id="charCount">0 caracteres</span>
          <span id="typingInfo" style="color:#6366f1;font-size:11px"></span>
          <span style="margin-left:auto" id="saveStatus"></span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="drop-overlay" id="dropOverlay"><div style="display:flex;justify-content:center;margin-bottom:8px"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div>Solte a imagem aqui</div></div>

<div class="search-overlay" id="searchOverlay">
  <div class="search-modal">
    <div class="search-header">
      <span class="search-header-icon"> </span>
      <input class="search-input" id="searchInput" placeholder="Digite aqui..." autocomplete="off" spellcheck="false" />
      <button class="search-close-btn" id="searchCloseBtn">✕</button>
    </div>
    <div class="search-results" id="searchResults">
      <div class="search-empty">Digite para buscar no conteúdo do manual</div>
    </div>
  </div>
</div>

<div class="notes-overlay" id="notesOverlay"></div>
<div class="notes-drawer" id="notesDrawer" role="dialog" aria-label="Notas e links do manual">
  <div class="notes-drawer-header">
    <div class="notes-drawer-logo">
      <div class="notes-drawer-badge">C</div>
      <div class="notes-drawer-title">
        <strong>COMPRÁGIL</strong>
        <small>Sistema de compras públicas</small>
      </div>
    </div>
    <button class="notes-close-btn" id="notesCloseBtn" aria-label="Fechar painel">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="notes-body">
    <div class="notes-section">
      <p class="notes-section-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Notas &amp; Observações
      </p>
      <textarea class="notes-textarea" id="notesIntro" placeholder="Escreva aqui uma nota de contexto geral ou avisos importantes do manual..."></textarea>
    </div>
    <div class="notes-section">
      <div class="notes-section-header">
        <p class="notes-section-label">Links Úteis</p>
        <button class="notes-btn-inline-add" id="notesAddTrigger" title="Adicionar link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div class="notes-link-list" id="notesLinkList"></div>
      <div class="notes-add-form" id="notesAddForm">
        <div class="notes-input-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <input type="text" id="notesLinkLabel" placeholder="Nome do link" />
        </div>
        <div class="notes-input-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <input type="text" id="notesLinkUrl" placeholder="https://..." />
        </div>
        <div class="notes-form-actions">
          <button class="notes-btn-confirm" id="notesAddLinkBtn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Confirmar
          </button>
          <button class="notes-btn-cancel" id="notesAddCancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="notes-footer">
    <button class="notes-btn-save" id="notesSaveBtn">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Salvar
    </button>
    <div class="notes-saved-msg" id="notesSavedMsg" style="opacity:0">✓ Salvo com sucesso</div>
  </div>
</div>
`;

// ─── Notes Drawer ──────────────────────────────────────────────────────────
const NOTES_PAGE_KEY = '__notes__';
let notesLinks = [];

function openNotesDrawer() {
  // Carrega notas salvas
  const saved = localPages[NOTES_PAGE_KEY];
  if (saved) {
    document.getElementById('notesIntro').value = saved.intro || '';
    notesLinks = saved.links || [];
  } else {
    document.getElementById('notesIntro').value = '';
    notesLinks = [];
  }
  renderNotesLinks();
  // Controles de edição visíveis apenas para admin/editor
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'editor';
  // Campos de adicionar link e salvar: só para editor/admin
  const editOnlyEls = ['notesLinkLabel', 'notesLinkUrl', 'notesAddLinkBtn', 'notesSaveBtn'];
  editOnlyEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = canEdit ? '' : 'none';
  });
  // Introdução: todos veem, mas só editor/admin podem editar
  const introEl = document.getElementById('notesIntro');
  if (introEl) {
    introEl.style.display = '';
    introEl.readOnly = !canEdit;
    introEl.style.background = canEdit ? '' : '#f8fafc';
    introEl.style.cursor = canEdit ? '' : 'default';
    introEl.style.color = canEdit ? '' : '#475569';
  }
  // Label da seção de introdução sempre visível
  const introLabel = document.querySelector('.notes-section-label');
  if (introLabel) introLabel.style.display = '';
  document.getElementById('notesOverlay').classList.add('open');
  document.getElementById('notesDrawer').classList.add('open');
  document.getElementById('notesSavedMsg').style.opacity = '0';
}

function closeNotesDrawer() {
  document.getElementById('notesOverlay').classList.remove('open');
  document.getElementById('notesDrawer').classList.remove('open');
}

function renderNotesLinks() {
  const list = document.getElementById('notesLinkList');
  list.innerHTML = '';
  if (notesLinks.length === 0) {
    list.innerHTML = '<div class="notes-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Nenhum link adicionado ainda</span></div>';
    return;
  }
  notesLinks.forEach((lk, i) => {
    const row = document.createElement('div');
    row.className = 'notes-link-item';
    const short = lk.url.length > 42 ? lk.url.slice(0, 42) + '…' : lk.url;
    row.innerHTML = `
      <a class="notes-link-anchor" href="${lk.url}" target="_blank" rel="noopener">
        <span class="nl-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
        <div class="notes-link-info">
          <p class="notes-link-name">${lk.label}</p>
          <p class="notes-link-url">${short}</p>
        </div>
        <span class="notes-link-ext"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
      </a>
      ${(currentUser.role === "admin" || currentUser.role === "editor") ? `<button class="notes-link-del" data-i="${i}" title="Remover"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : ""}`;
    list.appendChild(row);
  });
  list.querySelectorAll('.notes-link-del').forEach(btn => {
    btn.addEventListener('click', () => {
      notesLinks.splice(parseInt(btn.dataset.i), 1);
      renderNotesLinks();
    });
  });
}

function saveNotes() {
  const intro = document.getElementById('notesIntro').value;
  const data  = { intro, links: notesLinks, title: '__notes__', content: '', icon: '📌' };
  localPages[NOTES_PAGE_KEY] = data;
  wsSend({ type: 'page_update', pageKey: NOTES_PAGE_KEY, ...data });
  const msg = document.getElementById('notesSavedMsg');
  msg.style.opacity = '1';
  setTimeout(() => { msg.style.opacity = '0'; }, 2500);
}

function setupNotesDrawer() {
  document.getElementById('logoIconBtn').addEventListener('click', openNotesDrawer);
  document.getElementById('notesOverlay').addEventListener('click', closeNotesDrawer);
  document.getElementById('notesCloseBtn').addEventListener('click', closeNotesDrawer);
  document.getElementById('notesSaveBtn').addEventListener('click', saveNotes);

  // Toggle formulário de adicionar link
  document.getElementById('notesAddTrigger').addEventListener('click', () => {
    document.getElementById('notesAddForm').classList.add('open');
    document.getElementById('notesAddTrigger').style.visibility = 'hidden';
    document.getElementById('notesLinkLabel').focus();
  });
  document.getElementById('notesAddCancel').addEventListener('click', () => {
    document.getElementById('notesAddForm').classList.remove('open');
    document.getElementById('notesAddTrigger').style.visibility = '';
    document.getElementById('notesLinkLabel').value = '';
    document.getElementById('notesLinkUrl').value = '';
  });

  document.getElementById('notesAddLinkBtn').addEventListener('click', () => {
    const label = document.getElementById('notesLinkLabel').value.trim();
    const url   = document.getElementById('notesLinkUrl').value.trim();
    if (!label || !url) return;
    notesLinks.push({ label, url });
    document.getElementById('notesLinkLabel').value = '';
    document.getElementById('notesLinkUrl').value = '';
    document.getElementById('notesAddForm').classList.remove('open');
    document.getElementById('notesAddTrigger').style.visibility = '';
    renderNotesLinks();
  });
  document.getElementById('notesLinkUrl').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('notesAddLinkBtn').click();
  });
}

// ─── WebSocket ─────────────────────────────────────────────────────────────
function connectWS() {
  try {
    ws = new WebSocket(WS_URL);
  } catch(e) {
    console.error('WS erro:', e);
    setSyncStatus(false);
    setTimeout(connectWS, 5000);
    return;
  }

  ws.binaryType = 'blob'; // Deixa claro que blobs serão ignorados
  ws.onopen = () => {
    debugLog('✅ WS conectado!', '#10b981');
    setSyncStatus(true);
    wsSend({ type: 'join', name: currentUser.name, color: currentUser.color });
    wsSend({ type: 'get_pages' });
  };

  ws.onmessage = async (event) => {
    
    try {
      // Ignora mensagens binárias (Blob) do servidor antigo com Yjs
      let data = event.data;
      if (data instanceof Blob) {
        console.warn('Mensagem binária ignorada - servidor ainda é o antigo');
        return;
      }
      if (data instanceof ArrayBuffer) return;
      const msg = JSON.parse(data);
      handleMessage(msg);
    } catch(e) { console.error('Erro mensagem:', e); }
  };

  

  ws.onclose = () => {
    debugLog('⚠️ WS desconectado, reconectando...', '#f59e0b');
    setSyncStatus(false);
    // Se nunca recebeu confirmação de role, tenta fallback local
    if (!wsRoleConfirmed) tryLocalWhitelistFallback();
    setTimeout(connectWS, 3000);
  };

  ws.onerror = (e) => {
    debugLog('❌ WS erro: ' + (e.message || 'verifique Railway'), '#f43f5e');
    setSyncStatus(false);
    if (!wsRoleConfirmed) tryLocalWhitelistFallback();
  };
}

function wsSend(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function handleMessage(msg) {
  if (msg.type === 'init') {
    const serverPages = msg.pages || {};
    const serverHasData = Object.keys(serverPages).some(k => {
      const p = serverPages[k];
      return p && (p.content || p.title);
    });

    if (serverHasData) {
      // Servidor tem conteúdo real — é a fonte da verdade
      Object.assign(localPages, serverPages);
      saveLocalPages();
    } else {
      // Servidor vazio (reiniciou) — reenvia localStorage para repovoar
      console.log('[init] servidor vazio, reenviando páginas do localStorage...');
      Object.keys(localPages).forEach(pageKey => {
        if (pageKey === '__notes__') return;
        const p = localPages[pageKey];
        if (p && (p.content || p.title)) {
          wsSend({ type: 'page_update', pageKey, title: p.title || '', content: p.content || '', icon: p.icon || '📄', intro: p.intro || '', links: p.links || [] });
        }
      });
    }
    loadPage(activePageKey);
  }

  // Servidor confirma a role real do usuário — o servidor é a fonte da verdade
  if (msg.type === 'confirm_role') {
    wsRoleConfirmed = true;

    // Servidor envia a whitelist completa para o admin atualizar cache local
    if (msg.whitelist) {
      currentWhitelist = msg.whitelist;
      localWhitelist = { ...msg.whitelist };
      saveLocalWhitelist();
    }

    // Usa exatamente o que o servidor definiu
    currentUser.role = msg.role || 'viewer';

    applyPermissions();
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
  }

  // Admin recebe whitelist atualizada
  if (msg.type === 'whitelist_update') {
    currentWhitelist = msg.whitelist;
    localWhitelist = { ...msg.whitelist }; // mantém espelho local sincronizado
    saveLocalWhitelist();
    if (document.getElementById('adminModal')) renderUserList();
  }

  if (msg.type === 'page_update') {
    debugLog(`📥 Atualizado por: ${msg.author}: ${msg.pageKey}`, '#10b981');
    localPages[msg.pageKey] = { title: msg.title, content: msg.content, icon: msg.icon, intro: msg.intro, links: msg.links };
    saveLocalPages();
    if (msg.pageKey === NOTES_PAGE_KEY) return;
    if (msg.pageKey === activePageKey) {
      const editor = document.getElementById('editor');
      const title  = document.getElementById('pageTitle');
      const icon   = document.getElementById('iconBtn');
      if (editor.innerHTML !== msg.content) editor.innerHTML = msg.content;
      if (title.value !== msg.title) title.value = msg.title;
      icon.textContent = msg.icon || '📄';
      updateCounts();
    }
  }

  if (msg.type === 'online') {
    renderOnlineUsers(msg.users);
  }

  if (msg.type === 'request_pages') {
    // Servidor reiniciou vazio — envia todo o localStorage para restaurar os dados
    const dump = {};
    const editor = document.getElementById('editor');
    Object.entries(localPages).forEach(([key, val]) => {
      if (val && (val.content || val.title)) {
        // Para a página ativa, usa o HTML real do editor (preserva base64 das imagens)
        if (key === activePageKey && editor) {
          dump[key] = { ...val, content: editor.innerHTML };
        } else {
          dump[key] = val;
        }
      }
    });
    if (Object.keys(dump).length > 0) wsSend({ type: 'pages_dump', pages: dump });
  }

  if (msg.type === 'typing') {
    if (msg.pageKey === activePageKey) {
      const el = document.getElementById('typingInfo');
      el.innerHTML = `<span class="typing-badge" style="background:${msg.color}">● ${msg.name} digitando</span>`;
      clearTimeout(window._typingClear);
      window._typingClear = setTimeout(() => { el.innerHTML = ''; }, 2500);
    }
  }
}

function debugLog(msg, color='#6366f1') {
  console.log(msg);
}

function setSyncStatus(_connected) {
  // indicador removido da UI — função mantida para não quebrar chamadas existentes
}

// ─── Syntax highlight HTML ────────────────────────────────────────────────
function highlightHTML(code) {
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const T='#93c5fd', A='#86efac', V='#fca5a5', P='#94a3b8', C='#475569';
  let out = '', i = 0;
  while (i < code.length) {
    if (code[i] === '<') {
      let j = i+1, inQ=false, qCh='';
      while (j < code.length) {
        if (!inQ && (code[j]==='"'||code[j]==="'")) { inQ=true; qCh=code[j]; }
        else if (inQ && code[j]===qCh) { inQ=false; }
        else if (!inQ && code[j]==='>') { j++; break; }
        j++;
      }
      const tag = code.slice(i, j);
      if (tag.startsWith('<!--')) { out+=`<span style="color:${C}">${esc(tag)}</span>`; i=j; continue; }
      let r='', k=0, close=tag[1]==='/';
      r += `<span style="color:${P}">&lt;${close?'/':''}</span>`; k=close?2:1;
      let tName=''; while(k<tag.length&&!/[\s\/>]/.test(tag[k])) tName+=tag[k++];
      r += `<span style="color:${T}">${esc(tName)}</span>`;
      while (k < tag.length) {
        if (tag[k]==='>'||(tag[k]==='/'&&tag[k+1]==='>')) break;
        if (/\s/.test(tag[k])) { r+=tag[k++]; continue; }
        let aN=''; while(k<tag.length&&!/[\s=\/>]/.test(tag[k])) aN+=tag[k++];
        if (aN) r+=`<span style="color:${A}">${esc(aN)}</span>`;
        if (tag[k]==='=') {
          r+='='; k++;
          if (k<tag.length&&(tag[k]==='"'||tag[k]==="'")) {
            const q=tag[k++]; let v=q; while(k<tag.length&&tag[k]!==q) v+=tag[k++];
            if(k<tag.length) v+=tag[k++];
            r+=`<span style="color:${V}">${esc(v)}</span>`;
          }
        }
      }
      r += tag[k]==='/'?`<span style="color:${P}">/&gt;</span>`:`<span style="color:${P}">&gt;</span>`;
      out+=r; i=j;
    } else {
      let j=i; while(j<code.length&&code[j]!=='<') j++;
      out+=esc(code.slice(i,j)); i=j;
    }
  }
  return out;
}

// ─── Páginas ───────────────────────────────────────────────────────────────
// Remove imagens com src relativo (ex: image.png colado do Word) que não existem no servidor
function sanitizeContent(html) {
  if (!html) return '';
  // Mantém apenas imagens base64 (data:) ou URLs absolutas (http/https)
  return html.replace(/<img([^>]*)\ssrc="(?!data:|https?:\/\/)([^"]*)"([^>]*)>/gi, (match, pre, src, post) => {
    // Se src está vazio já, esconde via CSS — não precisamos remover
    if (!src || src.trim() === '') return match;
    // Qualquer outro src relativo (image.png, ./img/foto.png, etc.) é removido
    return '';
  });
}

function loadPage(pageKey) {
  const page = localPages[pageKey];
  const editor = document.getElementById('editor');
  const title  = document.getElementById('pageTitle');
  const icon   = document.getElementById('iconBtn');
  const raw     = page?.content || '';
  const clean   = sanitizeContent(raw);
  editor.innerHTML = clean;

  // Se havia imagens quebradas, salva automaticamente a versão limpa
  if (clean !== raw) {
    localPages[pageKey] = { ...page, content: clean };
    saveLocalPages();
    wsSend({ type: 'page_update', pageKey, title: page?.title || '', content: clean, icon: page?.icon || '📄', intro: page?.intro || '', links: page?.links || [] });
    console.log('[sanitize] imagens com caminho relativo removidas de', pageKey);
  }
  title.value      = page?.title   || '';
  icon.textContent = page?.icon    || '📄';
  title.style.height = 'auto';
  title.style.height = title.scrollHeight + 'px';
  updateCounts();
}

function savePage() {
  const editor = document.getElementById('editor');
  const title  = document.getElementById('pageTitle');
  const icon   = document.getElementById('iconBtn');
  const data   = { title: title.value, content: editor.innerHTML, icon: icon.textContent.trim() };
  localPages[activePageKey] = data;
  saveLocalPages();
  wsSend({ type: 'page_update', pageKey: activePageKey, ...data });
  // Feedback visual
  const st = document.getElementById('saveStatus');
  st.textContent = '✓ Salvo';
  setTimeout(() => st.textContent = '', 2000);
}

// ─── Estado da whitelist ───────────────────────────────────────────────────
let currentWhitelist = {};
let wsRoleConfirmed  = false;

// ─── Whitelist local embutida (espelho do Whitelist.json) ──────────────────
// Atualizada automaticamente pelo servidor quando admin faz mudanças.
// É também usada como fallback quando o WS não está disponível (arquivo local).
// Carrega whitelist persistida no localStorage (sobrevive a F5 mesmo offline)
let localWhitelist = (() => {
  try {
    const saved = localStorage.getItem('compragil_whitelist');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return { 'Admin': 'admin' };
})();

function saveLocalWhitelist() {
  try { localStorage.setItem('compragil_whitelist', JSON.stringify(localWhitelist)); }
  catch(e) { console.warn('Erro ao salvar whitelist local:', e); }
}

function applyRoleFromLocalWhitelist() {
  // Busca case-insensitive: "admin", "Admin", "ADMIN" → todos encontram "Admin"
  const nameLower = (currentUser.name || '').toLowerCase();
  const matchedKey = Object.keys(localWhitelist).find(k => k.toLowerCase() === nameLower);
  const role = matchedKey ? localWhitelist[matchedKey] : 'viewer';
  // Nunca rebaixa um role já melhor (ex: admin por senha não vira viewer pela whitelist)
  const RANK = { admin: 3, editor: 2, viewer: 1 };
  if (RANK[role] > RANK[currentUser.role || 'viewer']) {
    currentUser.role = role;
  }
  currentWhitelist = { ...localWhitelist };
  applyPermissions();
  console.log(`[whitelist local] "${currentUser.name}" → matchedKey="${matchedKey}" → role="${role}" (atual: ${currentUser.role})`);
  console.log('[whitelist local] conteúdo:', JSON.stringify(localWhitelist));
}

// Tenta carregar whitelist local (Whitelist.json) — apenas quando servido por HTTP
async function tryLocalWhitelistFallback() {
  if (wsRoleConfirmed) return;
  // Em file:// o fetch é bloqueado pelo browser — usa apenas o localWhitelist embutido
  if (location.protocol !== 'file:') {
    try {
      const resp = await fetch('Whitelist.json');
      if (resp.ok) {
        const wl = await resp.json();
        localWhitelist = wl;
      }
    } catch(e) { /* falhou — usa localWhitelist embutida */ }
  }
  applyRoleFromLocalWhitelist();
}

// ─── Login ─────────────────────────────────────────────────────────────────
let selectedColor = USER_COLORS[0];
const colorPicker = document.getElementById('colorPicker');
USER_COLORS.forEach((c, i) => {
  const el = document.createElement('div');
  el.className = 'color-opt' + (i === 0 ? ' selected' : '');
  el.style.background = c;
  el.addEventListener('click', () => {
    document.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedColor = c;
  });
  colorPicker.appendChild(el);
});

// Storage seguro — funciona em file:// e http://
const SafeStorage = {
  _mem: {},
  get(k) {
    try { return sessionStorage.getItem(k); } catch(e) {}
    return this._mem[k] || null;
  },
  set(k, v) {
    try { sessionStorage.setItem(k, v); } catch(e) {}
    this._mem[k] = v;
  },
  remove(k) {
    try { sessionStorage.removeItem(k); } catch(e) {}
    delete this._mem[k];
  }
};

function showLoginError(msg) {
  const input = document.getElementById('loginName');
  input.style.borderColor = '#f43f5e';
  input.style.background = '#fff1f2';
  let errMsg = document.getElementById('loginError');
  if (!errMsg) {
    errMsg = document.createElement('p');
    errMsg.id = 'loginError';
    errMsg.style.cssText = 'font-size:12px;color:#f43f5e;margin:-8px 0 10px;text-align:center';
    input.insertAdjacentElement('afterend', errMsg);
  }
  errMsg.textContent = msg;
  setTimeout(() => { input.style.borderColor = ''; input.style.background = ''; }, 3000);
}

function doLogin() {
  const name = document.getElementById('loginName').value.trim();
  if (!name) { document.getElementById('loginName').focus(); return; }
  const remember = document.getElementById('rememberMe').checked;

  // Entra com role 'viewer' por padrão — o servidor corrige via confirm_role assim que o WS conectar
  // A validação de acesso é feita pelo servidor, não pelo cliente
  currentUser = { name, color: selectedColor, role: 'viewer' };

  if (remember) {
    SafeStorage.set('compragil_user', JSON.stringify({ name, color: selectedColor, remember: true, role: 'viewer' }));
  } else {
    SafeStorage.remove('compragil_user');
  }
  document.getElementById('loginOverlay').style.display = 'none';
  initApp();
}

function doLogout() {
  SafeStorage.remove('compragil_user');
  location.reload();
}

function applyPermissions() {
  const role   = currentUser.role || 'viewer';
  const isAdmin = role === 'admin';
  const canEdit = isAdmin || role === 'editor';

  const editor = document.getElementById('editor');
  if (editor) {
    editor.contentEditable = String(canEdit);
    editor.classList.toggle('readonly-mode', !canEdit);
    editor.setAttribute('data-placeholder',
      canEdit ? 'Comece a escrever... Todos veem em tempo real.' : 'Modo visualização — sem permissão para editar.');
  }

  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.readOnly = !canEdit;

  const toolbar = document.getElementById('toolbar');
  if (toolbar) toolbar.style.display = canEdit ? '' : 'none';

  const iconBtn = document.getElementById('iconBtn');
  if (iconBtn) { iconBtn.style.pointerEvents = canEdit ? '' : 'none'; iconBtn.style.opacity = canEdit ? '' : '0.5'; }

  ['saveBtn','clearBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = canEdit ? 'flex' : 'none';
  });

  const editSep = document.getElementById('editSep');
  if (editSep) editSep.style.display = canEdit ? '' : 'none';

  ['previewBtn','exportBtn','searchBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  });

  const adminBtn = document.getElementById('adminBtn');
  const adminSep = document.getElementById('adminSep');
  if (adminBtn) adminBtn.style.display = isAdmin ? 'flex' : 'none';
  if (adminSep) adminSep.style.display = isAdmin ? '' : 'none';

  const logoBtn = document.getElementById('logoIconBtn');
  if (logoBtn) {
    logoBtn.style.pointerEvents = '';
    logoBtn.style.opacity = '';
    logoBtn.title = 'Notas e links';
  }

  // Badge de role no topbar
  const roleBadge = document.getElementById('roleBadge');
  if (roleBadge) roleBadge.style.display = 'none';

  console.log(`[permissões] ${currentUser.name} → ${role}`);

  // Toast de debug — mostra nome e role na tela por 6 segundos
  const existing = document.getElementById('_debugToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = '_debugToast';
  toast.style.cssText = 'position:fixed;bottom:16px;right:16px;background:#2d3561;color:#fff;padding:10px 16px;border-radius:10px;font-size:12px;z-index:999999;border:1px solid rgba(255,255,255,.15);font-family:monospace;line-height:1.6';
  const firstName = (currentUser.name || '?').trim().split(' ')[0];
  toast.innerHTML = `👋 Bem-vindo(a), <b>${firstName}</b>! &nbsp;<span style="color:#10b981;font-size:14px">● online</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

document.getElementById('loginBtn').addEventListener('click', doLogin);
document.getElementById('loginName').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

// Restaura sessão salva — pula o overlay APENAS se o usuário marcou "Lembrar"
// ─── Init ──────────────────────────────────────────────────────────────────
let _appInited = false;
function initApp() {
  if (_appInited) return;
  _appInited = true;

  buildSidebarNav();
  buildSubnav();
  activePageKey = 'sidebar-0';
  document.getElementById('breadcrumb').textContent = navItems[0].label;

  // Mostra nome do usuário no topbar
  const topbarUser = document.getElementById('topbarUser');
  if (topbarUser) topbarUser.textContent = '';

  // Aplica whitelist local IMEDIATAMENTE — servidor corrige se necessário via confirm_role
  applyRoleFromLocalWhitelist();

  connectWS();

  // Servidor define a role via confirm_role — não há fallback local para evitar conflito

  // Auto-save enquanto digita
  const editor = document.getElementById('editor');
  let saveTimer;
  editor.addEventListener('input', () => {
    clearTimeout(saveTimer);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      wsSend({ type: 'typing', pageKey: activePageKey });
    }, 300);
    saveTimer = setTimeout(savePage, 2000);
    updateCounts();
  });

  document.getElementById('pageTitle').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(savePage, 2000);
  });

  setupToolbar();
  setupDragDrop();
  buildEmojiPicker();
  setupTopbarButtons();
  setupToggle();
  setupNotesDrawer();
  setupSearch();
  setupImageInteraction();
  setupTableInteraction();
}

// ─── Busca global ──────────────────────────────────────────────────────────

(function tryAutoLogin() {
  try {
    const saved = SafeStorage.get('compragil_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u && u.name && u.remember) {
        // Entra direto com viewer — servidor corrige a role via confirm_role
        currentUser = { name: u.name, color: u.color || USER_COLORS[0], role: 'viewer' };
        selectedColor = u.color || USER_COLORS[0];
        document.getElementById('loginName').value = u.name;
        document.getElementById('rememberMe').checked = true;
        const idx = USER_COLORS.indexOf(u.color);
        if (idx >= 0) document.querySelectorAll('.color-opt').forEach((el, i) => el.classList.toggle('selected', i === idx));
        document.getElementById('loginOverlay').style.display = 'none';
        initApp();
        return;
      } else if (u && u.name) {
        document.getElementById('loginName').value = u.name;
        const idx = USER_COLORS.indexOf(u.color);
        if (idx >= 0) document.querySelectorAll('.color-opt').forEach((el, i) => el.classList.toggle('selected', i === idx));
        selectedColor = u.color || USER_COLORS[0];
      }
    }
  } catch(e) { console.warn('SafeStorage erro:', e); }
})();

function setupSearch() {
  const overlay    = document.getElementById('searchOverlay');
  const input      = document.getElementById('searchInput');
  const resultsEl  = document.getElementById('searchResults');
  const closeBtn   = document.getElementById('searchCloseBtn');
  const searchBtn  = document.getElementById('searchBtn');

  function openSearch() {
    overlay.classList.add('open');
    input.value = '';
    resultsEl.innerHTML = '<div class="search-empty">Digite para buscar no conteúdo do manual.</div>';
    setTimeout(() => input.focus(), 60);
  }

  function closeSearch() {
    overlay.classList.remove('open');
  }

  function getPageLabel(pageKey) {
    if (pageKey.startsWith('sidebar-')) {
      const idx = parseInt(pageKey.replace('sidebar-', ''));
      return navItems[idx] ? `${navItems[idx].icon} ${navItems[idx].label}` : pageKey;
    }
    if (pageKey.startsWith('subnav-')) {
      const idx = parseInt(pageKey.replace('subnav-', ''));
      return subnavItems[idx] || pageKey;
    }
    return pageKey;
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(escaped, 'gi'), m => `<mark>${m}</mark>`);
  }

  function getSnippet(text, query, len = 140) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, len);
    const start = Math.max(0, idx - 50);
    const end   = Math.min(text.length, start + len);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < text.length) snippet += '…';
    return snippet;
  }

  function runSearch(query) {
    const q = query.trim();
    if (!q) {
      resultsEl.innerHTML = '<div class="search-empty">Digite para buscar no conteúdo do manual.</div>';
      return;
    }

    const matches = [];
    Object.entries(localPages).forEach(([pageKey, page]) => {
      if (pageKey === NOTES_PAGE_KEY) return;
      const titleText   = page.title || '';
      const bodyText    = stripHtml(page.content || '');
      const combined    = (titleText + ' ' + bodyText).toLowerCase();
      if (combined.includes(q.toLowerCase())) {
        matches.push({ pageKey, page, titleText, bodyText });
      }
    });

    if (matches.length === 0) {
      resultsEl.innerHTML = `<div class="search-empty">Nenhum resultado para "<strong>${q}</strong>"</div>`;
      return;
    }

    resultsEl.innerHTML = '';
    matches.forEach(({ pageKey, page, titleText, bodyText }) => {
      const label   = getPageLabel(pageKey);
      const snippet = highlight(getSnippet(bodyText, q), q);
      const titleHl = highlight(titleText || '(sem título)', q);

      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-title">
          ${titleHl}
          <span class="search-result-page">${label}</span>
        </div>
        <div class="search-result-snippet">${snippet}</div>`;

      item.addEventListener('click', () => {
        // Navega para a página encontrada
        savePage();
        hideClientsPanel(); // garante que o editor fica visível mesmo vindo do painel Clientes
        activePageKey = pageKey;
        if (pageKey.startsWith('sidebar-')) {
          const idx = parseInt(pageKey.replace('sidebar-', ''));
          activeIdx   = idx;
          currentMode = 'sidebar';
          document.querySelectorAll('.nav-item').forEach((x, j) => x.classList.toggle('active', j === idx));
          document.querySelectorAll('.subnav-item').forEach(x => x.classList.remove('active'));
          document.getElementById('breadcrumb').textContent = navItems[idx]?.label || '';
        } else if (pageKey.startsWith('subnav-')) {
          const idx = parseInt(pageKey.replace('subnav-', ''));
          activeSubIdx = idx;
          currentMode  = 'subnav';
          document.querySelectorAll('.subnav-item').forEach((x, j) => x.classList.toggle('active', j === idx));
          document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
          document.getElementById('breadcrumb').textContent = subnavItems[idx] || '';
        }
        loadPage(pageKey);
        closeSearch();
        // Tenta destacar visualmente o termo na página carregada
        setTimeout(() => {
          const editor = document.getElementById('editor');
          const text = editor.innerText.toLowerCase();
          const pos = text.indexOf(q.toLowerCase());
          if (pos !== -1) {
            const range = document.createRange();
            const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
            let charCount = 0;
            let node;
            while ((node = walker.nextNode())) {
              const len = node.textContent.length;
              if (charCount + len > pos) {
                range.setStart(node, pos - charCount);
                range.setEnd(node, Math.min(pos - charCount + q.length, len));
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                range.startContainer.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
              }
              charCount += len;
            }
          }
        }, 80);
      });

      resultsEl.appendChild(item);
    });

    const countEl = document.createElement('div');
    countEl.className = 'search-count';
    countEl.textContent = `${matches.length} página${matches.length !== 1 ? 's' : ''} encontrada${matches.length !== 1 ? 's' : ''}`;
    resultsEl.appendChild(countEl);
  }

  searchBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });

  input.addEventListener('input', () => runSearch(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  // Atalho de teclado: Ctrl+K ou Ctrl+F
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'f')) {
      // Só Ctrl+K abre a busca; Ctrl+F nativo apenas se o editor não estiver focado
      if (e.key === 'k') { e.preventDefault(); openSearch(); }
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
function buildSidebarNav() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) { console.error('ERRO: #sidebarNav não encontrado'); return; }
  console.log('[sidebar] construindo', navItems.length, 'itens');
  navItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'nav-item' + (i === 0 ? ' active' : '');

    // Ícone (SVG)
    const iconSpan = document.createElement('span');
    iconSpan.className = 'nav-icon';
    iconSpan.innerHTML = item.icon;
    el.appendChild(iconSpan);

    // Label
    const labelSpan = document.createElement('span');
    labelSpan.className = 'nav-label';
    labelSpan.textContent = item.label;
    el.appendChild(labelSpan);

    // Tooltip
    const tipSpan = document.createElement('span');
    tipSpan.className = 'nav-tip';
    tipSpan.textContent = item.label;
    el.appendChild(tipSpan);

    el.addEventListener('click', () => {
      savePage();
      activeIdx    = i;
      currentMode  = 'sidebar';
      activePageKey = 'sidebar-' + i;
      document.querySelectorAll('.nav-item').forEach((x, j) => x.classList.toggle('active', j === i));
      document.querySelectorAll('.subnav-item').forEach(x => x.classList.remove('active'));
      document.getElementById('breadcrumb').textContent = item.label;
      hideClientsPanel();
      loadPage(activePageKey);
      wsSend({ type: 'typing', pageKey: activePageKey });
    });
    nav.appendChild(el);
  });
  console.log('[sidebar] OK —', nav.children.length, 'itens adicionados');
}

function buildSubnav() {
  const subnavEl = document.getElementById('subnav');
  subnavItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'subnav-item';
    el.textContent = item;
    el.addEventListener('click', () => {
      savePage();
      activeSubIdx  = i;
      currentMode   = 'subnav';
      activePageKey = 'subnav-' + i;
      document.querySelectorAll('.subnav-item').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
      document.getElementById('breadcrumb').textContent = item;
      if (item === 'Clientes') {
        showClientsPanel();
      } else {
        hideClientsPanel();
        loadPage(activePageKey);
      }
    });
    subnavEl.appendChild(el);
  });
}

// ─── Usuários online ───────────────────────────────────────────────────────
function renderOnlineUsers(users) {
  const list = document.getElementById('onlineList');
  if (!list) return;
  // Deduplica por nome — evita duplicatas quando o WS reconecta
  const seen = new Set();
  const unique = users.filter(u => { if (seen.has(u.name)) return false; seen.add(u.name); return true; });
  list.innerHTML = '';
  const ROLE_LABEL = { admin: 'Admin', editor: 'Editor', viewer: 'Visualizador' };
  unique.forEach(u => {
    const el = document.createElement('div');
    el.className = 'online-user';
    el.title = `${u.name} — ${ROLE_LABEL[u.role] || 'Visualizador'}`;
    const firstName = u.name.trim().split(' ')[0];
    el.innerHTML = `
      <div class="online-avatar" style="background:${u.color}">${firstName.charAt(0).toUpperCase()}</div>
      <div class="online-name">${firstName}</div>`;
    list.appendChild(el);
  });
}

// ─── Toggle sidebar ────────────────────────────────────────────────────────
function setupToggle() {
  const sb  = document.getElementById('sidebar');
  const btn = document.getElementById('toggleBtn');

  btn.addEventListener('click', () => {
    sb.classList.toggle('collapsed');
  });
}

// ─── Toolbar ───────────────────────────────────────────────────────────────
function setupToolbar() {
  const toolbar = document.getElementById('toolbar');
  const editor  = document.getElementById('editor');

  document.addEventListener('mouseup', () => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        let rect = range.getBoundingClientRect();

        // Fallback para cursor colapsado (sem seleção): usa o elemento pai
        if (!rect.height) {
          const node = sel.anchorNode;
          const el = node.nodeType === 3 ? node.parentElement : node;
          rect = el ? el.getBoundingClientRect() : rect;
        }

        // Posição horizontal: centraliza sobre a seleção ou sobre o editor
        const edRect = editor.getBoundingClientRect();
        const cx = rect.width > 0
          ? rect.left + rect.width / 2
          : edRect.left + edRect.width / 2;

        toolbar.style.top  = Math.max(8, rect.top - 48 + window.scrollY) + 'px';
        toolbar.style.left = Math.max(8, cx - 220) + 'px';
        toolbar.classList.add('visible');
      } else {
        toolbar.classList.remove('visible');
      }
    }, 10);
  });
  document.addEventListener('mousedown', e => {
    if (!toolbar.contains(e.target) && !editor.contains(e.target)) {
      toolbar.classList.remove('visible');
    }
  });

  document.querySelectorAll('.tb-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      if (['h1','h2','h3'].includes(cmd)) document.execCommand('formatBlock', false, cmd);
      else if (cmd === 'blockquote') document.execCommand('formatBlock', false, 'blockquote');
      else if (cmd === 'pre') document.execCommand('formatBlock', false, 'pre');
      else document.execCommand(cmd, false, null);
      toolbar.classList.remove('visible');
    });
  });

  // ── Seletor de cor do texto ──────────────────────────────────────────────
  let _savedRange = null;
  let _lastColor  = '#ef4444';
  const colorBar     = document.getElementById('tbColorBar');
  const colorPalette = document.getElementById('tbColorPalette');
  const colorCustom  = document.getElementById('tbColorCustom');

  function saveRange() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) _savedRange = sel.getRangeAt(0).cloneRange();
  }

  function applyColor(color) {
    _lastColor = color;
    colorBar.style.background = color;
    if (/^#[0-9a-f]{6}$/i.test(color)) colorCustom.value = color;
    colorPalette.classList.remove('open');

    if (!_savedRange) return;

    editor.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(_savedRange.cloneRange());

    document.execCommand('styleWithCSS', false, true);
    document.execCommand('foreColor', false, color);

    savePage();
  }

  // Botão A — aplica a última cor diretamente sem abrir a paleta
  document.getElementById('tbColorApply').addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    saveRange();
    applyColor(_lastColor);
  });

  // Botão ▾ — abre/fecha a paleta de cores
  document.getElementById('tbColorToggle').addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    saveRange();
    colorPalette.classList.toggle('open');
  });

  // Swatches da paleta
  document.querySelectorAll('.tb-swatch').forEach(sw => {
    sw.addEventListener('mousedown', e => { e.preventDefault(); applyColor(sw.dataset.color); });
  });

  // Cor personalizada — salva range antes do picker nativo abrir (troca de foco)
  colorCustom.addEventListener('mousedown', e => {
    e.stopPropagation();
    saveRange(); // garante que _savedRange está atualizado antes do picker nativo tomar o foco
  });
  colorCustom.addEventListener('change', e => { applyColor(e.target.value); });

  document.addEventListener('mousedown', e => {
    const wrap = document.getElementById('tbColorWrap');
    if (wrap && !wrap.contains(e.target)) colorPalette.classList.remove('open');
  });

  document.getElementById('linkBtn').addEventListener('click', () => {
    const url = prompt('URL do link:', 'https://');
    if (url) { editor.focus(); document.execCommand('createLink', false, url); }
  });

  document.getElementById('tableBtn').addEventListener('click', () => {
    const rows = parseInt(prompt('Quantas linhas?', '3') || '3');
    const cols = parseInt(prompt('Quantas colunas?', '3') || '3');
    let t = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) t += `<th>Coluna ${c+1}</th>`;
    t += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) { t += '<tr>'; for (let c = 0; c < cols; c++) t += '<td>Célula</td>'; t += '</tr>'; }
    t += '</tbody></table>';
    editor.focus(); document.execCommand('insertHTML', false, t);
  });

  document.getElementById('imgUploadTrigger').addEventListener('click', () => document.getElementById('imgFileInput').click());
  document.getElementById('imgFileInput').addEventListener('change', e => { const f = e.target.files[0]; if (f) insertImage(f); e.target.value = ''; });

  // ── Checkbox ─────────────────────────────────────────────────────────────
  document.getElementById('checkboxBtn').addEventListener('mousedown', e => {
    e.preventDefault();
    // Salva o cursor antes do botão roubar o foco
    const sel = window.getSelection();
    let savedRange = null;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
    // Monta o elemento de tarefa
    const task = document.createElement('div');
    task.className = 'editor-task';
    const cb = document.createElement('span');
    cb.className = 'task-cb';
    cb.setAttribute('contenteditable', 'false');
    cb.setAttribute('data-checked', '0');
    const lbl = document.createElement('span');
    lbl.className = 'task-label';
    lbl.innerHTML = '&#8203;';
    task.appendChild(cb);
    task.appendChild(lbl);
    // Insere na posição do cursor
    editor.focus();
    if (savedRange) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(savedRange);
      savedRange.deleteContents();
      savedRange.insertNode(task);
    } else {
      editor.appendChild(task);
    }
    // Posiciona cursor dentro do label para o usuário digitar
    const r = document.createRange();
    r.setStart(lbl, 0);
    r.collapse(true);
    const s2 = window.getSelection();
    s2.removeAllRanges();
    s2.addRange(r);
    savePage();
  });

  // ── Colar HTML renderizado ───────────────────────────────────────────────
  document.getElementById('htmlPasteBtn').addEventListener('click', () => {
    console.log('[Código v37] modal aberto');
    // Salva posição do cursor ANTES do modal abrir e roubar o foco
    let _insertRange = null;
    const selNow = window.getSelection();
    if (selNow && selNow.rangeCount > 0) {
      _insertRange = selNow.getRangeAt(0).cloneRange();
      console.log('[HTML v36] range capturado:', _insertRange.startOffset);
    } else {
      console.log('[HTML v36] sem range — vai inserir no fim do editor');
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.75);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';
    overlay.innerHTML = `
      <div style="background:#0f172a;border-radius:14px;width:780px;max-width:97vw;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.6);overflow:hidden;font-family:Inter,sans-serif;border:1px solid rgba(255,255,255,.08)">

        <!-- Barra de título -->
        <div style="background:#1e293b;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:44px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.07)">
          <div style="display:flex;align-items:center;gap:10px">
            <!-- Botões decorativos estilo macOS -->
            <span style="width:12px;height:12px;border-radius:50%;background:#ef4444;display:inline-block"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block"></span>
          </div>
          <button id="_htmlClose" style="background:rgba(255,255,255,.06);border:none;color:#94a3b8;font-size:16px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1;transition:background .15s">✕</button>
        </div>

        <!-- Área do editor com numeração de linhas -->
        <div style="flex:1;display:flex;overflow:hidden;min-height:0;position:relative">
          <div id="_htmlLineNums" style="background:#0f172a;color:#334155;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.7;padding:16px 12px 16px 16px;text-align:right;user-select:none;border-right:1px solid rgba(255,255,255,.06);min-width:44px;overflow:hidden;flex-shrink:0">1</div>
          <textarea id="_htmlInput" spellcheck="false"
            style="flex:1;background:#0f172a;color:#e2e8f0;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:13px;line-height:1.7;padding:16px 20px;border:none;outline:none;resize:none;tab-size:2;overflow-y:auto;box-sizing:border-box;caret-color:#6366f1"
            placeholder="<!-- Cole ou digite seu HTML aqui -->"></textarea>
        </div>

        <!-- Barra de status + ações -->
        <div style="background:#1e293b;border-top:1px solid rgba(255,255,255,.07);padding:0 16px;height:44px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
          <span id="_htmlCharCount" style="color:#475569;font-size:11px;font-family:monospace">0 caracteres</span>
          <div style="display:flex;gap:8px">
            <button id="_htmlCancel" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:7px 16px;font-size:12px;font-weight:600;color:#94a3b8;cursor:pointer">Cancelar</button>
            <button id="_htmlInsert" style="background:#6366f1;color:#fff;border:none;border-radius:7px;padding:7px 18px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Inserir código
            </button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const textarea  = document.getElementById('_htmlInput');
    const lineNums  = document.getElementById('_htmlLineNums');
    const charCount = document.getElementById('_htmlCharCount');

    // Pré-preenche com o HTML da seleção atual (se houver)
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const div = document.createElement('div');
      div.appendChild(sel.getRangeAt(0).cloneContents());
      if (div.innerHTML) textarea.value = div.innerHTML;
    }

    function updateMeta() {
      const lines = textarea.value.split('\n');
      lineNums.innerHTML = lines.map((_, i) => i + 1).join('<br>');
      charCount.textContent = textarea.value.length + ' caracteres · ' + lines.length + ' linhas';
    }
    updateMeta();

    // Sincroniza scroll da numeração com o textarea
    textarea.addEventListener('scroll', () => { lineNums.scrollTop = textarea.scrollTop; });
    textarea.addEventListener('input', updateMeta);

    // Tab insere 2 espaços
    textarea.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = textarea.selectionStart, end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, s) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = s + 2;
        updateMeta();
      }
      if (e.key === 'Escape') overlay.remove();
    });

    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(textarea.value.length, textarea.value.length); }, 50);

    function doInsert() {
      const html = textarea.value.trim();
      console.log('[HTML v36] doInsert, html len:', html.length, 'range:', !!_insertRange);
      if (!html) { overlay.remove(); return; }

      // Bloco estilo editor de código com syntax highlight
      const block = document.createElement('div');
      block.setAttribute('data-code-block', '1');
      block.setAttribute('style',
        'background:#1e293b;border-radius:10px;margin:12px 0;overflow:hidden;' +
        'border:1px solid rgba(255,255,255,.07);display:block'
      );

      // Cabeçalho com badge "HTML" e botão de excluir
      const hdr = document.createElement('div');
      hdr.setAttribute('style',
        'background:rgba(255,255,255,.04);padding:5px 14px;display:flex;' +
        'align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.06)'
      );
      hdr.innerHTML =
        '<span style="color:#64748b;font-size:11px;font-weight:600;letter-spacing:.05em;' +
        'text-transform:uppercase;font-family:Inter,sans-serif">HTML</span>' +
        '<button class="code-del-btn" title="Apagar bloco de código" contenteditable="false">✕</button>';

      // Corpo com código realçado
      const body = document.createElement('div');
      body.setAttribute('style',
        "font-family:'Fira Code','Cascadia Code',Consolas,monospace;" +
        'font-size:13px;line-height:1.7;padding:16px 20px;' +
        'overflow-x:auto;white-space:pre-wrap;word-break:break-all;color:#e2e8f0'
      );
      body.innerHTML = highlightHTML(html); // syntax highlight sem interpretar tags

      block.appendChild(hdr);
      block.appendChild(body);

      editor.focus();

      if (_insertRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(_insertRange);
        _insertRange.deleteContents();
        _insertRange.insertNode(block);
        const r = document.createRange();
        r.setStartAfter(block);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      } else {
        editor.appendChild(block);
      }

      savePage();
      overlay.remove();
    }

    document.getElementById('_htmlInsert').addEventListener('click', doInsert);
    document.getElementById('_htmlCancel').addEventListener('click', () => overlay.remove());
    document.getElementById('_htmlClose').addEventListener('click',  () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  });
}

function insertImage(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    const src = ev.target.result;

    // ── Modal de tamanho de imagem ──────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;width:440px;max-width:94vw;box-shadow:0 24px 60px rgba(0,0,0,.35);overflow:hidden;font-family:Inter,sans-serif">
        <div style="background:#2d3561;padding:16px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Inserir imagem</div>
          <button id="_imgClose" style="background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;padding:2px 6px;border-radius:6px;line-height:1">✕</button>
        </div>
        <div style="padding:20px">
          <img id="_imgPreview" src="${src}" alt="preview"
            style="width:100%;max-height:180px;object-fit:contain;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:16px;background:#f8fafc"/>

          <label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:6px">Largura da imagem</label>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <input id="_imgRange" type="range" min="10" max="100" value="100"
              style="flex:1;accent-color:#6366f1;cursor:pointer"/>
            <span id="_imgPct" style="font-size:13px;font-weight:700;color:#6366f1;min-width:38px;text-align:right">100%</span>
          </div>

          <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">
            ${[25,50,75,100].map(v => `<button class="_imgPreset" data-v="${v}"
              style="flex:1;min-width:60px;border:1.5px solid #e2e8f0;background:#f8fafc;border-radius:8px;padding:6px 0;font-size:12px;font-weight:600;color:#334155;cursor:pointer;transition:all .15s">${v}%</button>`).join('')}
          </div>

          <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
            <button id="_imgCancel" style="border:1.5px solid #e2e8f0;background:#fff;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer">Cancelar</button>
            <button id="_imgInsert" style="background:#2d3561;color:#fff;border:none;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:600;cursor:pointer">Inserir</button>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const range    = document.getElementById('_imgRange');
    const pctLabel = document.getElementById('_imgPct');
    const preview  = document.getElementById('_imgPreview');

    function updatePreview(v) {
      pctLabel.textContent = v + '%';
      preview.style.width = v + '%';
      // Destaca o botão de preset ativo
      document.querySelectorAll('._imgPreset').forEach(b => {
        const active = parseInt(b.dataset.v) === parseInt(v);
        b.style.background     = active ? '#eef2ff' : '#f8fafc';
        b.style.borderColor    = active ? '#6366f1' : '#e2e8f0';
        b.style.color          = active ? '#6366f1' : '#334155';
      });
    }
    updatePreview(100);

    range.addEventListener('input', () => updatePreview(range.value));

    document.querySelectorAll('._imgPreset').forEach(b => {
      b.addEventListener('click', () => { range.value = b.dataset.v; updatePreview(b.dataset.v); });
    });

    async function doInsert() {
      const pct = range.value;
      const widthStyle = pct === '100' ? 'max-width:100%' : `width:${pct}%`;

      // Mostra loading no botão
      const insertBtn = document.getElementById('_imgInsert');
      insertBtn.textContent = 'Enviando…';
      insertBtn.disabled = true;

      // Tenta fazer upload para o servidor (salva no GitHub com URL permanente)
      let imgSrc = src; // fallback: base64
      try {
        const base64Data = src.split(',')[1]; // remove prefixo "data:image/...;base64,"
        const resp = await fetch('/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64Data, type: file.type, name: file.name })
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json.url) imgSrc = json.url; // URL permanente no GitHub
        }
      } catch (e) {
        console.warn('[insertImage] upload falhou, usando base64:', e.message);
      }

      document.getElementById('editor').focus();
      document.execCommand('insertHTML', false,
        `<img src="${imgSrc}" alt="${file.name}" style="${widthStyle};border-radius:8px;margin:8px 0;display:block"/>`);
      savePage();
      overlay.remove();
    }

    document.getElementById('_imgInsert').addEventListener('click', () => doInsert());
    document.getElementById('_imgCancel').addEventListener('click', () => overlay.remove());
    document.getElementById('_imgClose').addEventListener('click',  () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };
  reader.readAsDataURL(file);
}

// ─── Drag & Drop ───────────────────────────────────────────────────────────
function setupDragDrop() {
  const overlay = document.getElementById('dropOverlay');
  let dc = 0;
  document.addEventListener('dragenter', e => { if ([...e.dataTransfer.types].includes('Files')) { dc++; overlay.classList.add('show'); } });
  document.addEventListener('dragleave', () => { if (--dc <= 0) { dc = 0; overlay.classList.remove('show'); } });
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => { e.preventDefault(); overlay.classList.remove('show'); dc = 0; [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')).forEach(insertImage); });
  document.getElementById('editor').addEventListener('paste', e => {
    const img = [...(e.clipboardData?.items||[])].find(it => it.type.startsWith('image/'));
    if (img) { e.preventDefault(); insertImage(img.getAsFile()); }
  });
}

// ─── Clientes ──────────────────────────────────────────────────────────────
const CLIENTS_KEY = '__clients__';

const DEFAULT_CLIENTS = [
  // Policlínicas
  { client: 'Jacobina',               unit: 'Policlínica',       bank: 'BD_POLICLINICA_JACOBINA',           status: 'Ativo' },
  { client: 'Senhor do Bonfim',       unit: 'Policlínica',       bank: 'BD_POLICLINICA_SENHOR_DO_BONFIM',   status: 'Ativo' },
  { client: 'Jequié',                 unit: 'Policlínica',       bank: 'BD_POLICLINICA_JEQUIE',             status: 'Bloqueado' },
  // Previdências
  { client: 'Francisco Conde',        unit: 'Previdência',       bank: 'BD_PREVIDENCIA_FRANCISCO_CONDE',    status: 'Bloqueado' },
  // Câmaras
  { client: 'Almadina',               unit: 'Câmara',            bank: 'BD_ALMADINA_CAMARA',                status: 'Bloqueado' },
  { client: 'Castro Alves',           unit: 'Câmara',            bank: 'BD_CASTRO_ALVES_CAMARA',            status: 'Ativo' },
  { client: 'Madre de Deus',          unit: 'Câmara',            bank: 'BD_MADRE_DE_DEUS_CAMARA',           status: 'Ativo' },
  { client: 'Miguel Calmon',          unit: 'Câmara',            bank: 'BD_MIGUEL_CALMON_CAMARA',           status: 'Ativo' },
  { client: 'Santa Terezinha',        unit: 'Câmara',            bank: 'BD_SANTA_TEREZINHA_CAMARA',         status: 'Ativo' },
  { client: 'Seabra',                 unit: 'Câmara',            bank: 'BD_SEABRA_CAMARA',                  status: 'Ativo' },
  // Prefeituras
  { client: 'Almadina',               unit: 'Prefeitura',        bank: 'BD_ALMADINA',                       status: 'Ativo' },
  { client: 'Angical',                unit: 'Prefeitura',        bank: 'BD_ANGICAL',                        status: 'Ativo' },
  { client: 'Antônio Cardoso',        unit: 'Prefeitura',        bank: 'BD_ANTONIO_CARDOSO',                status: 'Ativo' },
  { client: 'Breijões',               unit: 'Prefeitura',        bank: 'BD_BREJOES',                        status: 'Ativo' },
  { client: 'Cairu',                  unit: 'Prefeitura',        bank: 'BD_CAIRU',                          status: 'Ativo' },
  { client: 'Canarana',               unit: 'Prefeitura',        bank: 'BD_CANARANA',                       status: 'Ativo' },
  { client: 'Capim Grosso',           unit: 'Prefeitura',        bank: 'BD_CAPIM_GROSSO',                   status: 'Ativo' },
  { client: 'Castro Alves',           unit: 'Prefeitura',        bank: 'BD_CASTRO_ALVES',                   status: 'Ativo' },
  { client: 'Coaraci',                unit: 'Prefeitura',        bank: 'BD_COARACI',                        status: 'Ativo' },
  { client: 'Conceição da Feira',     unit: 'Prefeitura',        bank: 'BD_CONCEICAO_FEIRA',                status: 'Ativo' },
  { client: 'Euclides da Cunha',      unit: 'Prefeitura',        bank: 'BD_EUCLIDES',                       status: 'Offline' },
  { client: 'Euclides da Cunha',      unit: 'Prefeitura',        bank: 'BD_EUCLIDES_DA_CUNHA',              status: 'Offline' },
  { client: 'Euclides da Cunha',      unit: 'Prefeitura',        bank: 'BD_EUCLIDES_DA_CUNHA_PROD_ANTIGO',  status: 'Offline' },
  { client: 'Formosa do Rio Preto',   unit: 'Prefeitura',        bank: 'BD_FORMOSA_RIO_PRETO',              status: 'Ativo' },
  { client: 'Ibitita',                unit: 'Prefeitura',        bank: 'BD_IBITITA',                        status: 'Ativo' },
  { client: 'Inhambupe',              unit: 'Prefeitura',        bank: 'BD_INHAMBUPE',                      status: 'Ativo' },
  { client: 'Irará',                  unit: 'Prefeitura',        bank: 'BD_IRARA',                          status: 'Ativo' },
  { client: 'Itagibá',               unit: 'Prefeitura',        bank: 'BD_ITAGIBA',                        status: 'Ativo' },
  { client: 'Jaguaripe',              unit: 'Prefeitura',        bank: 'BD_JAGUARIPE',                      status: 'Ativo' },
  { client: 'Jitauna',               unit: 'Prefeitura',        bank: 'BD_JITAUNA',                        status: 'Ativo' },
  { client: 'Lajedinho',              unit: 'Prefeitura',        bank: 'BD_LAJEDINHO',                      status: 'Ativo' },
  { client: 'Lauro de Freitas',       unit: 'Prefeitura',        bank: 'BD_LAURO_DE_FREITAS',               status: 'Ativo' },
  { client: 'Lençóis',               unit: 'Prefeitura',        bank: 'BD_LENCOIS',                        status: 'Bloqueado' },
  { client: 'Maragogi',               unit: 'Prefeitura',        bank: 'BD_MARAGOGI',                       status: 'Ativo' },
  { client: 'Mirante',                unit: 'Prefeitura',        bank: 'BD_MIRANTE',                        status: 'Ativo' },
  { client: 'Mulungu do Morro',       unit: 'Prefeitura',        bank: 'BD_MULUNGU_DO_MORRO',               status: 'Bloqueado' },
  { client: 'Mutuípe',               unit: 'Prefeitura',        bank: 'BD_MUTUIPE',                        status: 'Ativo' },
  { client: 'Nazaré',                unit: 'Prefeitura',        bank: 'BD_NAZARE',                         status: 'Ativo' },
  { client: 'Palmeiras',              unit: 'Prefeitura',        bank: 'BD_PALMEIRAS',                      status: 'Ativo' },
  { client: 'Penedo',                 unit: 'Prefeitura',        bank: 'BD_PENEDO',                         status: 'Ativo' },
  { client: 'Piritiba',               unit: 'Prefeitura',        bank: 'BD_PIRITIBA',                       status: 'Ativo' },
  { client: 'Pojuca',                 unit: 'Prefeitura',        bank: 'BD_POJUCA',                         status: 'Ativo' },
  { client: 'Ruy Barbosa',            unit: 'Prefeitura',        bank: 'BD_RUY_BARBOSA',                    status: 'Ativo' },
  { client: 'São Desidério',         unit: 'Prefeitura',        bank: 'BD_SAO_DESIDERIO',                  status: 'Bloqueado' },
  { client: 'Seabra',                 unit: 'Prefeitura',        bank: 'BD_SEABRA',                         status: 'Ativo' },
  { client: 'Tancredo Neves',         unit: 'Prefeitura',        bank: 'BD_TANCREDO_NEVES',                 status: 'Ativo' },
  { client: 'Várzea Nova',           unit: 'Prefeitura',        bank: 'BD_VARZEA_NOVA',                    status: 'Ativo' },
  { client: 'Wenceslau Guimarães',   unit: 'Prefeitura',        bank: 'BD_WENCESLAU_GUIMARAES',            status: 'Ativo' },
  // Teste / Homologação
  { client: 'Apresentação',          unit: 'Teste/Homologação', bank: 'BD_APRESENTACAO',                   status: 'Ativo' },
  { client: 'Suporte',                unit: 'Teste/Homologação', bank: 'BD_SUPORTE',                        status: 'Ativo' },
  { client: 'Lauro de Freitas',       unit: 'Homologação',       bank: 'BD_LAURO_HOMOLOGACAO',              status: 'Ativo' },
  { client: 'Emanuel',                unit: 'Teste',             bank: 'BD_TESTE_FORMOSA_RIO_PRETO',        status: 'Ativo' },
];

function loadClients() {
  const page = localPages[CLIENTS_KEY];
  if (!page) return [];
  if (Array.isArray(page.clients)) return page.clients;
  try { return JSON.parse(page.content || '[]'); } catch { return []; }
}

function saveClients(clients) {
  const data = { title: 'Clientes', content: JSON.stringify(clients), icon: '👥', intro: '', links: [], clients };
  localPages[CLIENTS_KEY] = data;
  saveLocalPages();
  wsSend({ type: 'page_update', pageKey: CLIENTS_KEY, ...data });
}

function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function statusBadge(s) {
  const map = { 'Ativo': 'status-ativo', 'Bloqueado': 'status-bloqueado', 'Offline': 'status-offline' };
  const cls = map[s] || 'status-ativo';
  return `<span class="status-badge ${cls}">${escHtml(s || 'Ativo')}</span>`;
}

function clientRowHTML(c, i, canEdit) {
  return `
    <tr>
      <td>${escHtml(c.client)}</td>
      <td>${escHtml(c.unit)}</td>
      <td>${escHtml(c.bank)}</td>
      <td>${statusBadge(c.status)}</td>
      ${canEdit ? `<td>
        <div class="clients-row-actions">
          <button class="clients-row-edit" data-ci="${i}" title="Editar"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="clients-row-del" data-ci="${i}" title="Excluir"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
        </div>
      </td>` : ''}
    </tr>`;
}

function renderClientsPanel() {
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'editor';
  const clients = loadClients();
  const panel = document.getElementById('clientsPanel');

  panel.innerHTML = `
    ${canEdit ? `
    <div class="clients-form">
      <div class="clients-form-field">
        <label>Cliente</label>
        <input type="text" id="_fClient" placeholder="Nome do cliente">
      </div>
      <div class="clients-form-field">
        <label>Unidade</label>
        <input type="text" id="_fUnit" placeholder="Nome da unidade">
      </div>
      <div class="clients-form-field">
        <label>Banco</label>
        <input type="text" id="_fBank" placeholder="Nome do banco">
      </div>
      <div class="clients-form-field" style="flex:0;min-width:130px">
        <label>Status</label>
        <select id="_fStatus" class="clients-status-select">
          <option value="Ativo">Ativo</option>
          <option value="Bloqueado">Bloqueado</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      <button class="clients-form-add" id="_clientAddBtn">+ Adicionar</button>
    </div>` : ''}
    <div class="clients-toolbar">
      <input class="clients-filter" id="_clientFilter" type="text" placeholder="Filtrar por cliente, unidade, banco ou status...">
      <button class="clients-copy-all-btn" id="_copyActiveBanksBtn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar bancos ativos</button>
    </div>
    <div class="clients-table-wrap">
      ${clients.length === 0
        ? '<div class="clients-empty">Nenhum registro ainda.<br><span style="font-size:12px">Preencha os campos acima e clique em "+ Adicionar".</span></div>'
        : `<table class="clients-table" id="_clientsTable">
            <thead><tr>
              <th>Cliente</th>
              <th>Unidade</th>
              <th>Banco</th>
              <th>Status</th>
              ${canEdit ? '<th></th>' : ''}
            </tr></thead>
            <tbody>${clients.map((c, i) => clientRowHTML(c, i, canEdit)).join('')}</tbody>
          </table>`}
    </div>
    <div class="clients-footer">
      <span id="_clientsCount">${clients.length} registro${clients.length !== 1 ? 's' : ''} cadastrado${clients.length !== 1 ? 's' : ''}</span>
    </div>`;

  if (canEdit) {

    panel.querySelector('#_clientAddBtn')?.addEventListener('click', () => {
      const unit   = document.getElementById('_fUnit').value.trim();
      const bank   = document.getElementById('_fBank').value.trim();
      const client = document.getElementById('_fClient').value.trim();
      const status = document.getElementById('_fStatus').value;
      if (!unit && !bank && !client) return;
      const cls = loadClients();
      cls.push({ unit, bank, client, status });
      saveClients(cls);
      renderClientsPanel();
    });

    panel.querySelectorAll('.clients-row-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci  = parseInt(btn.dataset.ci);
        const cls = loadClients();
        const c   = cls[ci];
        const tr  = btn.closest('tr');
        const st = c.status || 'Ativo';
        tr.innerHTML = `
          <td><input class="clients-edit-input" data-field="client" value="${escHtml(c.client)}"></td>
          <td><input class="clients-edit-input" data-field="unit"   value="${escHtml(c.unit)}"></td>
          <td><input class="clients-edit-input" data-field="bank"   value="${escHtml(c.bank)}"></td>
          <td><select class="clients-status-select _editStatus" style="width:100%">
            <option value="Ativo"     ${st==='Ativo'    ?'selected':''}>Ativo</option>
            <option value="Bloqueado" ${st==='Bloqueado'?'selected':''}>Bloqueado</option>
            <option value="Offline"   ${st==='Offline'  ?'selected':''}>Offline</option>
          </select></td>
          <td>
            <div class="clients-row-actions">
              <button class="clients-row-save">✓ Salvar</button>
              <button class="clients-row-cancel">✕</button>
            </div>
          </td>`;
        tr.querySelector('.clients-edit-input').focus();
        tr.querySelector('.clients-row-save').addEventListener('click', () => {
          tr.querySelectorAll('.clients-edit-input').forEach(inp => { cls[ci][inp.dataset.field] = inp.value.trim(); });
          cls[ci].status = tr.querySelector('._editStatus').value;
          saveClients(cls);
          renderClientsPanel();
        });
        tr.querySelector('.clients-row-cancel').addEventListener('click', () => renderClientsPanel());
      });
    });

    panel.querySelectorAll('.clients-row-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const ci  = parseInt(btn.dataset.ci);
        const cls = loadClients();
        const label = cls[ci].unit || cls[ci].client || 'este registro';
        showConfirm({
          title: 'Remover registro',
          message: `Deseja remover <strong>"${label}"</strong>?`,
          confirmLabel: 'Remover',
          onConfirm: () => { cls.splice(ci, 1); saveClients(cls); renderClientsPanel(); }
        });
      });
    });
  }

  // Filtro em tempo real
  const filterInput = panel.querySelector('#_clientFilter');
  if (filterInput) {
    filterInput.addEventListener('input', () => {
      const q = filterInput.value.toLowerCase();
      const rows = panel.querySelectorAll('#_clientsTable tbody tr');
      let visible = 0;
      rows.forEach(row => {
        const match = row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      const counter = panel.querySelector('#_clientsCount');
      if (counter) counter.textContent = `${visible} registro${visible !== 1 ? 's' : ''} cadastrado${visible !== 1 ? 's' : ''}`;
    });
  }

  // Copiar todos os bancos ativos
  panel.querySelector('#_copyActiveBanksBtn')?.addEventListener('click', function() {
    const ativos = loadClients()
      .filter(c => !c.status || c.status === 'Ativo')
      .map(c => c.bank)
      .filter(Boolean);
    if (!ativos.length) { showAlert({ title: 'Atenção', message: 'Nenhum banco ativo encontrado.' }); return; }
    navigator.clipboard.writeText(ativos.join('\n')).then(() => {
      const orig = this.textContent;
      this.textContent = `✓ ${ativos.length} copiados`;
      this.classList.add('copied');
      setTimeout(() => { this.textContent = orig; this.classList.remove('copied'); }, 2000);
    });
  });
}

function showClientsPanel() {
  if (loadClients().length === 0) saveClients([...DEFAULT_CLIENTS]);
  document.getElementById('clientsPanel').classList.add('visible');
  document.getElementById('editorScroll').style.display = 'none';
  document.getElementById('toolbar').style.display = 'none';
  renderClientsPanel();
}

function hideClientsPanel() {
  document.getElementById('clientsPanel').classList.remove('visible');
  document.getElementById('editorScroll').style.display = '';
}

// ─── Image resize interaction ──────────────────────────────────────────────
function setupImageInteraction() {
  const editor  = document.getElementById('editor');
  const toolbar = document.getElementById('imgResizeToolbar');
  let selectedImg = null;

  function canEdit() { return currentUser.role === 'admin' || currentUser.role === 'editor'; }

  function getPct(img) {
    const w = img.style.width || img.style.maxWidth || '';
    const n = parseInt(w);
    return isNaN(n) ? 100 : n;
  }

  function applyPct(img, v) {
    if (parseInt(v) >= 100) {
      img.style.width    = '';
      img.style.maxWidth = '100%';
    } else {
      img.style.width    = v + '%';
      img.style.maxWidth = '';
    }
  }

  function updatePresets(v) {
    document.querySelectorAll('.it-preset').forEach(b => {
      b.classList.toggle('it-active', parseInt(b.dataset.v) === parseInt(v));
    });
  }

  function positionToolbar(img) {
    const rect = img.getBoundingClientRect();
    const top  = rect.bottom + 8;
    const left = Math.max(8, rect.left + rect.width / 2 - 200);
    toolbar.style.top  = top  + 'px';
    toolbar.style.left = left + 'px';
  }

  function showToolbar(img) {
    if (!canEdit()) return;
    if (selectedImg) selectedImg.classList.remove('img-selected');
    selectedImg = img;
    img.classList.add('img-selected');
    const pct = getPct(img);
    const range = document.getElementById('_itRange');
    range.value = pct;
    document.getElementById('_itPct').textContent = pct + '%';
    updatePresets(pct);
    positionToolbar(img);
    toolbar.classList.add('visible');
  }

  function hideToolbar() {
    if (selectedImg) { selectedImg.classList.remove('img-selected'); selectedImg = null; }
    toolbar.classList.remove('visible');
  }

  editor.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') { showToolbar(e.target); return; }
    if (!toolbar.contains(e.target)) hideToolbar();
  });

  // Evita cursor nativo antes/depois da imagem ao clicar — impede "primeiro Delete em branco"
  editor.addEventListener('mousedown', e => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault(); // não cria cursor nativo; nossa toolbar faz a gestão
      showToolbar(e.target);
    }
    // Botão de excluir bloco de código
    if (e.target.classList.contains('code-del-btn')) {
      e.preventDefault();
      const block = e.target.closest('[data-code-block]');
      if (block && editor.contains(block)) {
        block.remove();
        savePage();
      }
    }
    // Marcar / desmarcar checkbox
    if (e.target.classList.contains('task-cb')) {
      e.preventDefault();
      const checked = e.target.dataset.checked === '1';
      e.target.dataset.checked = checked ? '0' : '1';
      const lbl = e.target.nextElementSibling;
      if (lbl && lbl.classList.contains('task-label')) {
        lbl.classList.toggle('done', !checked);
      }
      savePage();
    }
  });

  const range = document.getElementById('_itRange');
  range.addEventListener('input', () => {
    if (!selectedImg) return;
    const v = range.value;
    document.getElementById('_itPct').textContent = v + '%';
    applyPct(selectedImg, v);
    updatePresets(v);
    clearTimeout(window._imgSaveTimer);
    window._imgSaveTimer = setTimeout(savePage, 1200);
  });

  document.querySelectorAll('.it-preset').forEach(b => {
    b.addEventListener('click', () => {
      if (!selectedImg) return;
      range.value = b.dataset.v;
      range.dispatchEvent(new Event('input'));
    });
  });

  document.getElementById('_itAlignLeft').addEventListener('click', () => {
    if (!selectedImg) return;
    selectedImg.style.marginLeft = '0'; selectedImg.style.marginRight = 'auto';
    savePage();
  });
  document.getElementById('_itAlignCenter').addEventListener('click', () => {
    if (!selectedImg) return;
    selectedImg.style.marginLeft = 'auto'; selectedImg.style.marginRight = 'auto';
    savePage();
  });
  document.getElementById('_itAlignRight').addEventListener('click', () => {
    if (!selectedImg) return;
    selectedImg.style.marginLeft = 'auto'; selectedImg.style.marginRight = '0';
    savePage();
  });

  function deleteSelectedImg() {
    if (!selectedImg) return;
    const imgToRemove = selectedImg;
    hideToolbar();
    imgToRemove.remove();
    savePage();
  }

  document.getElementById('_itDelete').addEventListener('click', () => {
    if (!selectedImg) return;
    const imgToRemove = selectedImg;
    showConfirm({
      title: 'Remover imagem',
      message: 'Deseja remover esta imagem do conteúdo?',
      confirmLabel: 'Remover',
      onConfirm: () => { imgToRemove.remove(); hideToolbar(); savePage(); }
    });
  });

  // Delete/Backspace com imagem selecionada — remove na primeira tecla
  document.addEventListener('keydown', e => {
    if (!selectedImg) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteSelectedImg();
    }
    if (e.key === 'Escape') hideToolbar();
  });

  document.addEventListener('mousedown', e => {
    if (!toolbar.contains(e.target) && e.target.tagName !== 'IMG') hideToolbar();
  });
  document.getElementById('editorScroll').addEventListener('scroll', () => {
    if (selectedImg && toolbar.classList.contains('visible')) positionToolbar(selectedImg);
  });
}

// ─── Table edit interaction ────────────────────────────────────────────────
function setupTableInteraction() {
  const editor  = document.getElementById('editor');
  const toolbar = document.getElementById('tblEditToolbar');
  let activeCell  = null;
  let activeTable = null;

  function canEdit() { return currentUser.role === 'admin' || currentUser.role === 'editor'; }

  function positionToolbar(table) {
    const rect = table.getBoundingClientRect();
    toolbar.style.top  = Math.max(4, rect.top - 40) + 'px';
    toolbar.style.left = Math.max(8, rect.left) + 'px';
  }

  function showToolbar(cell, table) {
    if (!canEdit()) return;
    if (activeTable) activeTable.classList.remove('tbl-active');
    activeCell  = cell;
    activeTable = table;
    table.classList.add('tbl-active');
    positionToolbar(table);
    toolbar.classList.add('visible');
  }

  function hideToolbar() {
    if (activeTable) activeTable.classList.remove('tbl-active');
    activeCell = activeTable = null;
    toolbar.classList.remove('visible');
  }

  editor.addEventListener('click', e => {
    const cell  = e.target.closest('td, th');
    const table = e.target.closest('table');
    if (cell && table && editor.contains(table)) { showToolbar(cell, table); return; }
    if (!toolbar.contains(e.target)) hideToolbar();
  });

  function makeCell(row) {
    return row.closest('thead') ? document.createElement('th') : document.createElement('td');
  }

  document.getElementById('_tblAddRowAbove').addEventListener('click', () => {
    if (!activeCell || !activeTable) return;
    const row  = activeCell.closest('tr');
    const cols = activeTable.rows[0]?.cells.length || 1;
    const newRow = row.parentNode.insertRow(row.sectionRowIndex);
    for (let i = 0; i < cols; i++) { const td = newRow.insertCell(); td.innerHTML = '&nbsp;'; }
    savePage();
  });

  document.getElementById('_tblAddRowBelow').addEventListener('click', () => {
    if (!activeCell || !activeTable) return;
    const row  = activeCell.closest('tr');
    const cols = activeTable.rows[0]?.cells.length || 1;
    const newRow = row.parentNode.insertRow(row.sectionRowIndex + 1);
    for (let i = 0; i < cols; i++) { const td = newRow.insertCell(); td.innerHTML = '&nbsp;'; }
    savePage();
  });

  document.getElementById('_tblAddColLeft').addEventListener('click', () => {
    if (!activeCell || !activeTable) return;
    const idx = activeCell.cellIndex;
    Array.from(activeTable.rows).forEach(row => {
      const c = makeCell(row);
      c.innerHTML = row.closest('thead') ? 'Coluna' : '&nbsp;';
      row.insertBefore(c, row.cells[idx] || null);
    });
    savePage();
  });

  document.getElementById('_tblAddColRight').addEventListener('click', () => {
    if (!activeCell || !activeTable) return;
    const idx = activeCell.cellIndex;
    Array.from(activeTable.rows).forEach(row => {
      const c = makeCell(row);
      c.innerHTML = row.closest('thead') ? 'Coluna' : '&nbsp;';
      const ref = row.cells[idx + 1];
      ref ? row.insertBefore(c, ref) : row.appendChild(c);
    });
    savePage();
  });

  document.getElementById('_tblDelRow').addEventListener('click', () => {
    if (!activeCell) return;
    const row = activeCell.closest('tr');
    if (activeTable.rows.length <= 1) {
      showConfirm({ title: 'Remover tabela', message: 'Deseja remover a tabela inteira?', confirmLabel: 'Remover', onConfirm: () => { activeTable.remove(); hideToolbar(); savePage(); } });
      return;
    }
    row.remove(); activeCell = null; savePage();
  });

  document.getElementById('_tblDelCol').addEventListener('click', () => {
    if (!activeCell || !activeTable) return;
    const idx = activeCell.cellIndex;
    if (activeTable.rows[0]?.cells.length <= 1) {
      showConfirm({ title: 'Remover tabela', message: 'Deseja remover a tabela inteira?', confirmLabel: 'Remover', onConfirm: () => { activeTable.remove(); hideToolbar(); savePage(); } });
      return;
    }
    Array.from(activeTable.rows).forEach(row => { if (row.cells[idx]) row.deleteCell(idx); });
    activeCell = null; savePage();
  });

  document.getElementById('_tblDelete').addEventListener('click', () => {
    if (!activeTable) return;
    showConfirm({ title: 'Remover tabela', message: 'Deseja remover esta tabela?', confirmLabel: 'Remover', onConfirm: () => { activeTable.remove(); hideToolbar(); savePage(); } });
  });

  document.addEventListener('mousedown', e => {
    if (!toolbar.contains(e.target) && !e.target.closest('table')) hideToolbar();
  });
  document.getElementById('editorScroll').addEventListener('scroll', () => {
    if (activeTable && toolbar.classList.contains('visible')) positionToolbar(activeTable);
  });
}

// ─── Emoji picker ──────────────────────────────────────────────────────────
function buildEmojiPicker() {
  const ep = document.getElementById('emojiPicker');
  EMOJIS.forEach(em => {
    const s = document.createElement('span');
    s.className = 'ep-emoji'; s.textContent = em;
    s.addEventListener('click', () => { document.getElementById('iconBtn').textContent = em; ep.classList.remove('show'); savePage(); });
    ep.appendChild(s);
  });
  document.getElementById('iconBtn').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    ep.style.top = (r.bottom + 6) + 'px'; ep.style.left = r.left + 'px';
    ep.classList.toggle('show');
  });
  document.addEventListener('click', e => { if (!ep.contains(e.target) && e.target.id !== 'iconBtn') ep.classList.remove('show'); });
}

// ─── Contagem ─────────────────────────────────────────────────────────────
function updateCounts() {
  const text = document.getElementById('editor').innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent = words + ' palavra' + (words !== 1 ? 's' : '');
  document.getElementById('charCount').textContent = text.length + ' caractere' + (text.length !== 1 ? 's' : '');
}

// ─── Painel Admin ───────────────────────────────────────────────────────────
function openAdminPanel() {
  if (currentUser.role !== 'admin') return;
  if (document.getElementById('adminModal')) return;

  const modal = document.createElement('div');
  modal.id = 'adminModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.7);z-index:99998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;width:520px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.35);overflow:hidden">
      <!-- Header -->
      <div style="background:#2d3561;padding:18px 22px;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d3561" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          <div>
            <div style="color:#fff;font-size:14px;font-weight:700">Gerenciar Usuários</div>
            <div style="color:#a5b4fc;font-size:11px">Controle de acesso ao manual</div>
          </div>
        </div>
        <button id="adminCloseBtn" style="background:none;border:none;color:rgba(255,255,255,.6);font-size:20px;cursor:pointer;padding:4px 8px;border-radius:6px;line-height:1;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.15)'" onmouseout="this.style.background='none'">✕</button>
      </div>

      <!-- Legenda de permissões -->
      <div style="padding:14px 22px 0;display:flex;gap:8px;flex-wrap:wrap">
        ${[
          { role:'admin',  label:'Administrador', color:'#6366f1', desc:'Edita, gerencia usuários e acessa tudo' },
          { role:'editor', label:'Editor',         color:'#10b981', desc:'Edita conteúdo e notas' },
          { role:'viewer', label:'Visualizador',   color:'#64748b', desc:'Apenas leitura e busca' },
        ].map(r => `
          <div style="display:flex;align-items:center;gap:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:6px 10px;flex:1;min-width:140px">
            <span style="width:8px;height:8px;border-radius:50%;background:${r.color};flex-shrink:0"></span>
            <div>
              <div style="font-size:11px;font-weight:600;color:#1e293b">${r.label}</div>
              <div style="font-size:10px;color:#94a3b8">${r.desc}</div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Lista de usuários -->
      <div style="flex:1;overflow-y:auto;padding:14px 22px">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:8px">Usuários cadastrados</div>
        <div id="adminUserList"></div>
      </div>

      <!-- Adicionar usuário -->
      <div style="border-top:1px solid #f1f5f9;padding:16px 22px;background:#f8fafc">
        <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px">Adicionar usuário</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="adminNewName" type="text" placeholder="Nome exato do usuário"
            style="flex:1;min-width:160px;border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:13px;font-family:Inter,sans-serif;outline:none;transition:border .2s;background:#fff"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'" />
          <select id="adminNewRole"
            style="border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:13px;font-family:Inter,sans-serif;outline:none;background:#fff;cursor:pointer;transition:border .2s"
            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'">
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
          <button id="adminAddBtn"
            style="background:#2d3561;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s"
            onmouseover="this.style.background='#1e2340'" onmouseout="this.style.background='#2d3561'">
            + Adicionar
          </button>
        </div>
        <div id="adminMsg" style="font-size:11px;color:#10b981;margin-top:6px;height:14px;opacity:0;transition:opacity .3s"></div>
      </div>
    </div>`;

  document.body.appendChild(modal);

  document.getElementById('adminCloseBtn').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  document.getElementById('adminAddBtn').addEventListener('click', adminAddUser);
  document.getElementById('adminNewName').addEventListener('keydown', e => { if (e.key === 'Enter') adminAddUser(); });

  renderUserList();
}

const ROLE_CONFIG = {
  admin:  { label: 'Administrador', color: '#6366f1', bg: '#eef2ff' },
  editor: { label: 'Editor',         color: '#10b981', bg: '#f0fdf4' },
  viewer: { label: 'Visualizador',   color: '#64748b', bg: '#f8fafc' },
};

function renderUserList() {
  const container = document.getElementById('adminUserList');
  if (!container) return;
  const entries = Object.entries(currentWhitelist);

  if (entries.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:#94a3b8;font-size:13px">Nenhum usuário cadastrado.<br><span style="font-size:11px">Adicione o primeiro usuário abaixo.</span></div>';
    return;
  }

  container.innerHTML = entries.map(([name, role]) => {
    const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.viewer;
    const isMe = name === currentUser.name;
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:6px;background:#fff;transition:border .15s" onmouseover="this.style.borderColor='#c7d2fe'" onmouseout="this.style.borderColor='#e2e8f0'">
        <div style="width:34px;height:34px;border-radius:50%;background:${cfg.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">${name.charAt(0).toUpperCase()}</div>
        <div style="flex:1;overflow:hidden">
          <div style="font-size:13px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}${isMe ? ' <span style="font-size:10px;color:#94a3b8">(você)</span>' : ''}</div>
        </div>
        <select data-name="${name}" class="role-select"
          style="border:1.5px solid #e2e8f0;border-radius:7px;padding:4px 8px;font-size:12px;font-family:Inter,sans-serif;outline:none;background:${cfg.bg};color:${cfg.color};font-weight:600;cursor:pointer;transition:border .2s">
          <option value="viewer" ${role==='viewer'?'selected':''}>Visualizador</option>
          <option value="editor" ${role==='editor'?'selected':''}>Editor</option>
          <option value="admin"  ${role==='admin' ?'selected':''}>Administrador</option>
        </select>
        ${isMe ? '' : `<button data-name="${name}" class="del-user-btn"
          style="background:none;border:1.5px solid #fecdd3;color:#f43f5e;border-radius:7px;padding:4px 8px;cursor:pointer;font-size:12px;transition:background .15s;flex-shrink:0"
          onmouseover="this.style.background='#fff1f2'" onmouseout="this.style.background='none'" title="Remover">✕</button>`}
      </div>`;
  }).join('');

  // Listener: mudar role via select
  container.querySelectorAll('.role-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const name = sel.dataset.name;
      const newRole = sel.value;
      currentWhitelist[name] = newRole;
      localWhitelist[name] = newRole;
      saveLocalWhitelist();
      wsSend({ type: 'manage_users', action: 'add', userName: name, userRole: newRole });
      adminFeedback(`Permissão de ${name} atualizada para ${ROLE_CONFIG[newRole]?.label}`);
      renderUserList();
    });
  });

  // Listener: remover usuário
  container.querySelectorAll('.del-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      showConfirm({
        title: 'Remover usuário',
        message: `Deseja remover <strong>"${name}"</strong> da whitelist?`,
        confirmLabel: 'Remover',
        svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d3561" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        onConfirm: () => {
          delete currentWhitelist[name];
          delete localWhitelist[name];
          saveLocalWhitelist();
          wsSend({ type: 'manage_users', action: 'delete', userName: name });
          adminFeedback(`${name} removido`);
          renderUserList();
        }
      });
    });
  });
}

function adminAddUser() {
  const name = document.getElementById('adminNewName').value.trim();
  const role = document.getElementById('adminNewRole').value;
  if (!name) { document.getElementById('adminNewName').focus(); return; }
  if (currentWhitelist[name]) { adminFeedback(`${name} já existe — altere a permissão na lista`, true); return; }
  currentWhitelist[name] = role;
  localWhitelist[name] = role;
  saveLocalWhitelist();
  wsSend({ type: 'manage_users', action: 'add', userName: name, userRole: role });
  document.getElementById('adminNewName').value = '';
  adminFeedback(`${name} adicionado como ${ROLE_CONFIG[role]?.label}`);
  renderUserList();
}

function adminFeedback(text, isError = false) {
  const el = document.getElementById('adminMsg');
  if (!el) return;
  el.textContent = text;
  el.style.color  = isError ? '#f43f5e' : '#10b981';
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ─── Modais padrão do sistema ──────────────────────────────────────────────
function showAlert({ title, message, svgIcon }) {
  const _SVG_INFO = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d3561" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  const icon = svgIcon || _SVG_INFO;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:14px;width:340px;max-width:92vw;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden;font-family:Inter,sans-serif">
      <div style="background:#2d3561;padding:14px 18px;display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;background:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icon}</div>
        <span style="color:#fff;font-size:13px;font-weight:700">${title}</span>
      </div>
      <div style="padding:20px 18px 8px;color:#475569;font-size:13px">${message}</div>
      <div style="padding:12px 18px 16px;display:flex;justify-content:flex-end">
        <button id="_alOk" style="background:#2d3561;color:#fff;border:none;border-radius:8px;padding:8px 22px;font-size:13px;font-weight:600;cursor:pointer">OK</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('_alOk').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function showConfirm({ title, message, svgIcon, confirmLabel = 'Confirmar', confirmColor = '#f43f5e', onConfirm }) {
  const _SVG_TRASH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d3561" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  const icon = svgIcon || _SVG_TRASH;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:14px;width:340px;max-width:92vw;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden;font-family:Inter,sans-serif">
      <div style="background:#2d3561;padding:14px 18px;display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;background:#fff;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icon}</div>
        <span style="color:#fff;font-size:13px;font-weight:700">${title}</span>
      </div>
      <div style="padding:20px 18px 8px;color:#475569;font-size:13px">${message}</div>
      <div style="padding:12px 18px 16px;display:flex;gap:8px;justify-content:flex-end">
        <button id="_cfCancel" style="border:1.5px solid #e2e8f0;background:#fff;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer">Cancelar</button>
        <button id="_cfConfirm" style="background:${confirmColor};color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer">${confirmLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('_cfCancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('_cfConfirm').addEventListener('click', () => { overlay.remove(); onConfirm(); });
}

// ─── Botões topbar ─────────────────────────────────────────────────────────
function setupTopbarButtons() {
  // Colapsar/expandir grupo de botões
  const collapseBtn = document.getElementById('topbarCollapseBtn');
  const actionsEl   = document.getElementById('topbarActions');
  collapseBtn.addEventListener('click', () => {
    const isCollapsed = actionsEl.classList.toggle('collapsed');
    collapseBtn.classList.toggle('collapsed', isCollapsed);
  });

  document.getElementById('saveBtn').addEventListener('click', savePage);
  document.getElementById('adminBtn').addEventListener('click', openAdminPanel);
  document.getElementById('logoutBtn').addEventListener('click', doLogout);

  document.getElementById('previewBtn').addEventListener('click', () => {
    savePage();
    const title = document.getElementById('pageTitle').value || 'Página';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body{font-family:Inter,sans-serif;max-width:760px;margin:60px auto;padding:0 24px;color:#334155;line-height:1.7}
    h1{font-size:32px;font-weight:700;margin-bottom:24px}img{max-width:100%;border-radius:8px}
    blockquote{border-left:3px solid #c7d2fe;padding-left:14px;color:#64748b}
    pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:13px;overflow-x:auto}
    table{border-collapse:collapse;width:100%}td,th{border:1px solid #e2e8f0;padding:6px 10px}th{background:#f8fafc}</style>
    </head><body><h1>${document.getElementById('iconBtn').textContent} ${title}</h1>${document.getElementById('editor').innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    savePage();
    const title = document.getElementById('pageTitle').value || 'Página';
    const icon  = document.getElementById('iconBtn').textContent;
    const rawBody = document.getElementById('editor').innerHTML;

    // Remove nós vazios do final via DOM (mais preciso que regex)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawBody;
    let last = tempDiv.lastChild;
    while (last) {
      const isEmpty =
        (last.nodeType === 3 && !last.textContent.trim()) ||
        (last.nodeType === 1 && !last.textContent.trim() && !last.querySelector('img,table,video,iframe'));
      if (isEmpty) { const prev = last.previousSibling; last.remove(); last = prev; }
      else break;
    }
    const body = tempDiv.innerHTML;

    const css = `
    @page { size: A4; margin: 1.5cm 2cm }
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Inter,Arial,sans-serif;font-size:12px;line-height:1.75;color:#334155;-webkit-print-color-adjust:exact;print-color-adjust:exact}

    /* ── Título da página ── */
    .page-title{font-size:22px;font-weight:700;color:#0f172a;margin-bottom:6px;line-height:1.3}
    .title-sep{border:none;border-top:1px solid #e2e8f0;margin-bottom:22px}

    /* ── Tipografia ── */
    h1{font-size:17px;font-weight:700;color:#0f172a;margin:22px 0 8px}
    h2{font-size:14px;font-weight:600;color:#1e293b;margin:18px 0 6px}
    h3{font-size:13px;font-weight:600;color:#334155;margin:14px 0 4px}
    p{margin:0 0 7px}
    ul,ol{padding-left:22px;margin:6px 0}
    li{margin:3px 0}
    blockquote{border-left:3px solid #6366f1;padding:8px 14px;color:#64748b;margin:12px 0;background:#f8faff;border-radius:0 6px 6px 0}
    pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 16px;font-size:11px;font-family:monospace;white-space:pre-wrap;word-break:break-all;margin:10px 0}
    a{color:#2d3561;text-decoration:none}
    img{max-width:100%;border-radius:6px;display:block;margin:10px 0}

    /* ── Tabelas ── */
    table{border-collapse:collapse;width:100%;margin:12px 0}
    th{background:#2d3561;color:#fff;font-size:11px;font-weight:700;padding:9px 12px;text-align:left;letter-spacing:.05em;text-transform:uppercase}
    td{border:1px solid #e2e8f0;padding:8px 12px;font-size:12px;vertical-align:top}
    tr:nth-child(even) td{background:#f8fafc}

    /* ── Impressão ── */
    @media print{
      pre,blockquote,table,img{page-break-inside:avoid}
      h1,h2,h3{page-break-after:avoid}
      p,li{orphans:3;widows:3}
    }`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>${title} — Manual CompraGil</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${css}</style>
</head>
<body>
  <div class="page-title">${icon} ${title}</div>
  <hr class="title-sep"/>
  ${body}
</body>
</html>`;

    // Imprime via iframe oculto — evita que o Chrome expanda a janela ao tamanho
    // da viewport do blob URL, o que gerava uma segunda página em branco.
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:0;visibility:hidden';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => iframe.remove(), 4000);
    }, 1200);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    showConfirm({
      title: 'Limpar página',
      message: 'Deseja limpar esta página para <strong>todos os usuários</strong>?',
      confirmLabel: 'Limpar',
      svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d3561" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`,
      onConfirm: () => {
        document.getElementById('editor').innerHTML = '';
        document.getElementById('pageTitle').value = '';
        document.getElementById('iconBtn').textContent = navItems[activeIdx]?.icon || '📄';
        updateCounts();
        savePage();
      }
    });
  });
}