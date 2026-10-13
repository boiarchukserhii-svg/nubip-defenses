/* Move the existing controls, preserving their state and handlers. */
(() => {
  const filters = document.querySelector('.filters');
  const nav = document.querySelector('.mobile-nav');
  if (!filters || !nav) return;
  const oldPanel = filters.closest('.panel');
  const dock = document.createElement('div');
  dock.className = 'search-dock';
  const panel = document.createElement('details');
  panel.className = 'bottom-search';
  const summary = document.createElement('summary');
  summary.textContent = 'Пошук і фільтри';
  panel.append(summary, filters);
  dock.append(panel, nav);
  document.body.append(dock);
  oldPanel.hidden = true;
  const style = document.createElement('style');
  style.textContent = `
.search-dock{position:fixed;z-index:999;bottom:calc(12px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),560px);display:grid;gap:8px}
.search-dock .mobile-nav{position:static;transform:none;width:100%;margin:0}
.bottom-search{background:#fffffff5;border:1px solid #d5ebe3;border-radius:20px;box-shadow:0 8px 28px #273a4d22;backdrop-filter:blur(18px);overflow:hidden}
.bottom-search summary{cursor:pointer;padding:13px 16px;color:#147d6b;font-weight:750;min-height:48px}
.filter-status{font-size:12px;font-weight:500;margin-left:8px}
.bottom-search .filters{margin:0;padding:0 12px 12px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;max-height:40dvh;overflow:auto}
.bottom-search input{grid-column:1/-1;min-width:0;width:100%;font-size:16px}
.bottom-search select{min-width:0;width:100%;font-size:16px}
.bottom-search button{grid-column:1/-1;min-height:44px;color:#147d6b;background:#e8f5ee}
.bottom-search summary:focus-visible{outline:3px solid #138d78;outline-offset:-4px}
body{padding-bottom:var(--search-dock-height,160px)!important}
html{scroll-padding-bottom:var(--search-dock-height,160px)}
`;
  document.head.append(style);
  const resize = () => document.documentElement.style.setProperty('--search-dock-height', `${dock.getBoundingClientRect().height + 32}px`);
  new ResizeObserver(resize).observe(dock);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { panel.open = false; summary.focus(); }
  });
  resize();
})();
