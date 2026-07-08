function sidebar() {
  const themeButtons = themes.map((theme) => `<button class="theme-button w-7 h-7 rounded-full cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${state.theme.name === theme.name ? 'ring-2 ring-offset-2 ring-accent ring-offset-gray-800' : ''}" style="background:${theme.colors.gradient}" aria-label="Select ${theme.name} theme" title="${theme.name}" data-theme="${theme.name}"></button>`).join('');
  return `
    <div id="sidebar-overlay" class="fixed inset-0 z-30 lg:hidden ${state.sidebarOpen ? 'block' : 'hidden'}"></div>
    <aside id="sidebar" class="fixed inset-y-4 left-4 w-64 z-40 transform transition-transform duration-300 ease-in-out ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'} lg:translate-x-0 flex flex-col space-y-4 p-0">
      ${liquid(`<div class="p-4 text-center"><div class="flex justify-between items-start lg:justify-center"><div class="flex flex-col items-center w-full"><img src="public/avatar.png" alt="头像" class="w-24 h-24 rounded-full mb-4 border-2 border-white"><h1 class="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1></div><button id="close-sidebar" class="lg:hidden p-1 -mr-2 -mt-2 text-white">${svg.x}</button></div><div class="flex justify-center space-x-2 mt-4"><a href="mailto:chii_magnus@outlook.com" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="Email">${svg.mail}</a><a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="GitHub">${svg.github}</a><a href="https://m.igetget.com/native/mine/account#/user/detail?enId=GEznR6VwQNKxEeXPOz9xB9Ojy0d24k" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="得到">${svg.dedao}</a><a href="https://space.bilibili.com/1055823731" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="哔哩哔哩">${svg.bilibili}</a></div></div>`, 'rounded-2xl overflow-hidden')}
      ${liquid('<div><nav><ul class="space-y-1 p-2"><li><a href="#articles" data-nav="articles" class="block py-2 px-4 rounded-lg text-left transition-all duration-200 ease-in-out text-white hover:bg-white/10 hover:pl-6">文章</a></li><li><a href="#products" data-nav="products" class="block py-2 px-4 rounded-lg text-left transition-all duration-200 ease-in-out text-white hover:bg-white/10 hover:pl-6">产品开发</a></li><li><a href="#about" data-nav="about" class="block py-2 px-4 rounded-lg text-left transition-all duration-200 ease-in-out text-white hover:bg-white/10 hover:pl-6">关于我</a></li></ul></nav></div>', 'rounded-2xl overflow-hidden')}
      ${liquid(`<div class="p-4"><div class="flex flex-nowrap items-center justify-between">${themeButtons}</div></div>`, 'rounded-2xl overflow-hidden')}
      ${liquid(`<div class="relative rounded-2xl"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">${svg.search}</div><input id="search-input" type="text" placeholder="搜索 (⌘K)" value="${escapeHtml(state.searchQuery)}" class="w-full pl-10 pr-4 py-3 border-none rounded-2xl text-sm bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div>`, 'rounded-2xl overflow-hidden')}
    </aside>
  `;
}

function renderHome() {
  $('#app').innerHTML = `
    <div class="min-h-screen flex">
      ${sidebar()}
      <div class="flex-1 flex flex-col lg:ml-72">
        <main class="flex-1 p-6 pt-16 sm:p-8 sm:pt-16 lg:p-10 relative">
          ${liquid(`<button id="open-sidebar" class="p-2">${svg.menu}</button>`, `lg:hidden rounded-md fixed top-4 left-4 z-50 overflow-hidden ${state.sidebarOpen ? 'hidden' : ''}`)}
          <div class="max-w-4xl mx-auto">${homeContent()}</div>
        </main>
        <footer class="py-6 text-center text-sm text-white text-opacity-70"><p>&copy; ${new Date().getFullYear()} Chii Magnus. All rights reserved.</p></footer>
      </div>
    </div>
  `;
  bindHome();
  initLiquidGlass();
  scrollHash();
}

function bindHome() {
  $('#open-sidebar')?.addEventListener('click', () => { state.sidebarOpen = true; renderHome(); });
  $('#close-sidebar')?.addEventListener('click', () => { state.sidebarOpen = false; renderHome(); });
  $('#sidebar-overlay')?.addEventListener('click', () => { state.sidebarOpen = false; renderHome(); });
  $('#toggle-articles')?.addEventListener('click', () => { state.articleExpanded = !state.articleExpanded; renderHome(); });
  $('#search-input')?.addEventListener('input', (event) => { state.searchQuery = event.target.value; renderHome(); $('#search-input')?.focus(); });
  document.querySelectorAll('[data-nav]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById(link.dataset.nav)?.scrollIntoView({ behavior: 'smooth' });
    if (innerWidth < 1024) {
      state.sidebarOpen = false;
      renderHome();
    }
  }));
  document.querySelectorAll('.tag-filter').forEach((button) => button.addEventListener('click', () => {
    state.selectedTags = state.selectedTags.includes(button.dataset.tag) ? [] : [button.dataset.tag];
    renderHome();
  }));
  document.querySelectorAll('.theme-button').forEach((button) => button.addEventListener('click', () => {
    setTheme(button.dataset.theme);
    renderHome();
  }));
}

function scrollHash() {
  if (!location.hash) return;
  requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' }));
}

function initLiquidGlass() {
  document.querySelectorAll('.liquid-glass:not([data-liquid-ready])').forEach((container) => {
    const id = `liquid-glass-${Math.random().toString(36).slice(2)}`;
    container.dataset.liquidReady = 'true';
    container.style.backdropFilter = `url(#${id}_filter) blur(1px) contrast(1.2) brightness(1.05) saturate(1.1)`;
    container.style.webkitBackdropFilter = `url(#${id}_filter) blur(1px) contrast(1.2) brightness(1.05) saturate(1.1)`;
    container.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:fixed;top:0;left:0;pointer-events:none"><defs><filter id="${id}_filter" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feImage result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><canvas style="display:none"></canvas>`);
    const canvas = container.querySelector('canvas');
    const feImage = container.querySelector('feImage');
    const displacement = container.querySelector('feDisplacementMap');
    const smoothStep = (a, b, t) => {
      const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };
    const updateShader = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const data = new Uint8ClampedArray(w * h * 4);
      const raw = [];
      let maxScale = 0;
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        const ix = x / w - 0.5;
        const iy = y / h - 0.5;
        const aspect = w / h;
        const qx = Math.abs(ix * aspect) - 0.4 * aspect + 0.4;
        const qy = Math.abs(iy) - 0.4 + 0.4;
        const distance = Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - 0.4;
        const scaled = smoothStep(0, 1, smoothStep(0.8, 0.0, distance - 0.15));
        const dx = (ix * scaled + 0.5) * w - x;
        const dy = (iy * scaled + 0.5) * h - y;
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        raw.push(dx, dy);
      }
      maxScale = Math.max(1, maxScale);
      let index = 0;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = (raw[index++] / maxScale + 0.5) * 255;
        data[i + 1] = (raw[index++] / maxScale + 0.5) * 255;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
      context.putImageData(new ImageData(data, w, h), 0, 0);
      feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL());
      displacement.setAttribute('scale', String(maxScale));
    };
    updateShader();
    new ResizeObserver(updateShader).observe(container);
  });
}

function route() {
  setTheme(state.theme.name);
  if (location.protocol === 'file:') return renderHome();
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/syncnos') return SyncNosRedirects.renderRedirect(SyncNosRedirects.notionUrl);
  if (path === '/syncnos-oauth/callback') return SyncNosOAuth.renderCallback();
  if (path === '/syncnos-oauth/test') return SyncNosOAuth.renderTest();
  if (path !== '/' && path !== '/blog') return history.replaceState(null, '', '/'), renderHome();
  if (SyncNosRedirects.shouldRedirectHome()) return SyncNosRedirects.renderRedirect(SyncNosRedirects.notionUrl);
  return renderHome();
}

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    $('#search-input')?.focus();
  }
});

startGradientClock();
route();
