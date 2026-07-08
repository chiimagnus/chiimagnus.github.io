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

function redirectPage(to) {
  $('#app').innerHTML = `<main class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"><div class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12 text-center"><h1 class="text-xl font-semibold">Redirecting…</h1><p class="mt-3 text-sm text-slate-600 dark:text-slate-300">If you are not redirected automatically, open:</p><a class="mt-3 break-all text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300" href="${to}" rel="noreferrer">${to}</a></div></main>`;
  window.location.replace(to);
}

function renderOAuthCallback() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const oauthState = params.get('state');
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  const isWebClipper = Boolean(oauthState?.startsWith('webclipper_'));
  const isHealthIOS = Boolean(oauthState?.startsWith('syncnos_health_ios_'));
  let mode = 'app';
  let loading = true;
  let title = '无法识别的回调请求';
  let subtitle = '缺少 state 或 state 前缀不受支持；请返回发起授权的应用重新尝试。';
  let fallback = '';

  const closeButtons = '<div class="flex items-center justify-center gap-3"><button id="close-page" type="button" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors">关闭此页</button><div class="px-4 py-2 rounded-lg bg-white/70 text-gray-900 font-semibold border border-white/60 shadow-sm">回到 WebClipper 扩展</div></div>';

  if (isWebClipper) {
    mode = 'webclipper';
    loading = false;
    if (error) {
      title = 'WebClipper 授权失败';
      subtitle = errorDescription ? `${error}: ${errorDescription}` : error;
    } else if (code && oauthState) {
      title = 'WebClipper 授权已回传';
      subtitle = '页面将自动关闭；若未关闭，请手动关闭并返回 WebClipper。';
      setTimeout(tryCloseCurrentPage, 1200);
    } else {
      title = 'WebClipper 回调参数缺失';
      subtitle = '请返回扩展重新发起 Connect。';
    }
  } else if (isHealthIOS && (error || (code && oauthState))) {
    title = '正在重定向到 SyncNos...';
    subtitle = '请稍候，正在尝试打开 SyncNos 应用并完成 OAuth 授权流程。';
    const callbackParams = new URLSearchParams();
    if (error) {
      callbackParams.append('error', error);
      if (errorDescription) callbackParams.append('error_description', errorDescription);
    } else {
      callbackParams.append('code', code);
      callbackParams.append('state', oauthState);
    }
    setTimeout(() => { location.href = `syncnos-health-ios://oauth/callback?${callbackParams}`; }, 250);
    setTimeout(() => {
      $('#app-fallback')?.classList.remove('hidden');
    }, 2000);
    fallback = '<div id="app-fallback" class="hidden mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p class="text-yellow-800">如果 SyncNos 应用没有自动打开，请确保：</p><ul class="text-left text-yellow-700 mt-2 space-y-1"><li>• SyncNos 应用已安装</li><li>• 应用已正确配置 URL scheme</li><li>• 尝试手动打开 SyncNos 应用</li></ul></div>';
  } else if (isHealthIOS) {
    title = '回调参数缺失';
    subtitle = '未收到 code/state 或 error；请返回应用重新发起授权。';
  }

  $('#app').innerHTML = `<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div class="text-center p-8"><div class="mb-4">${loading ? '<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>' : '<div class="inline-flex items-center justify-center rounded-full h-12 w-12 bg-white/70 border border-white/60 shadow-sm text-2xl">✓</div>'}</div><h1 class="text-2xl font-bold text-gray-900 mb-2">${escapeHtml(title)}</h1><p class="text-gray-600 mb-4">${escapeHtml(subtitle)}</p>${mode === 'webclipper' ? closeButtons : ''}${fallback}</div></div>`;
  $('#close-page')?.addEventListener('click', tryCloseCurrentPage);
}

function tryCloseCurrentPage() {
  window.close();
  window.open('', '_self');
  window.close();
}

function renderOAuthTest() {
  $('#app').innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">SyncNos OAuth 回调测试</h1>
        <div class="space-y-6">
          <div class="border border-gray-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-gray-800 mb-4">✅ 成功场景测试</h2><div class="space-y-4"><label class="block text-sm font-medium text-gray-700 mb-2">Authorization Code:</label><input id="test-code" type="text" value="test_code_12345" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><label class="block text-sm font-medium text-gray-700 mb-2">State:</label><input id="test-state" type="text" value="test_state_67890" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><div class="flex gap-4"><button id="test-success" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">测试回调页面重定向</button><button id="test-direct" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">直接测试 URL Scheme</button></div></div></div>
          <div class="border border-gray-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-gray-800 mb-4">❌ 错误场景测试</h2><div class="space-y-4"><label class="block text-sm font-medium text-gray-700 mb-2">Error Code:</label><input id="test-error" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="access_denied"><label class="block text-sm font-medium text-gray-700 mb-2">Error Description (可选):</label><input id="test-error-description" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="User denied access"><button id="test-error-button" class="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">测试错误回调</button></div></div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 class="font-semibold text-blue-900 mb-2">测试说明：</h3><ul class="text-sm text-blue-800 space-y-1"><li>• <strong>测试回调页面重定向</strong>：会导航到回调页面，然后自动重定向到 syncnos://</li><li>• <strong>直接测试 URL Scheme</strong>：直接尝试打开 syncnos://，如果应用已安装会立即打开</li><li>• <strong>测试错误回调</strong>：模拟 Notion 返回错误的情况</li><li>• 如果应用没有安装，浏览器可能会显示"无法打开"的提示</li></ul></div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4"><h3 class="font-semibold text-gray-900 mb-2">快速测试链接：</h3><div class="space-y-2 text-sm"><a href="/syncnos-oauth/callback?code=test123&state=test456" class="block text-blue-600 hover:underline">/syncnos-oauth/callback?code=test123&state=test456</a><a href="/syncnos-oauth/callback?error=access_denied&error_description=User%20denied" class="block text-red-600 hover:underline">/syncnos-oauth/callback?error=access_denied&error_description=User%20denied</a></div></div>
        </div>
      </div>
    </div>
  `;
  $('#test-success').addEventListener('click', () => {
    const params = new URLSearchParams({ code: $('#test-code').value, state: $('#test-state').value });
    location.href = `/syncnos-oauth/callback?${params}`;
  });
  $('#test-direct').addEventListener('click', () => {
    const params = new URLSearchParams({ code: $('#test-code').value, state: $('#test-state').value });
    location.href = `syncnos://oauth/callback?${params}`;
  });
  $('#test-error-button').addEventListener('click', () => {
    const params = new URLSearchParams({ error: $('#test-error').value || 'access_denied' });
    if ($('#test-error-description').value) params.append('error_description', $('#test-error-description').value);
    location.href = `/syncnos-oauth/callback?${params}`;
  });
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

function shouldRedirectHome() {
  const params = new URLSearchParams(location.search);
  const redirect = (params.get('redirect') || '').toLowerCase();
  const to = (params.get('to') || '').toLowerCase();
  const syncnos = (params.get('syncnos') || '').toLowerCase();
  const referrer = (document.referrer || '').toLowerCase();
  return redirect === 'syncnos' || to === 'syncnos' || syncnos === '1' || syncnos === 'true' || location.hash.toLowerCase() === '#syncnos' || referrer.includes('chromewebstore.google.com') || referrer.includes('chrome.google.com/webstore') || referrer.includes('chrome.google.com');
}

function route() {
  setTheme(state.theme.name);
  if (location.protocol === 'file:') return renderHome();
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/syncnos') return redirectPage(NOTION_SYNCNOS_URL);
  if (path === '/syncnos-oauth/callback') return renderOAuthCallback();
  if (path === '/syncnos-oauth/test') return renderOAuthTest();
  if (path !== '/' && path !== '/blog') return history.replaceState(null, '', '/'), renderHome();
  if (shouldRedirectHome()) return redirectPage(NOTION_SYNCNOS_URL);
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
