function renderHome() {
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
  $('#app').innerHTML = homeView();
  bindHome();
  if (window.initSky) window.initSky();
  if (window.initDebug) window.initDebug();
}

function setMode(m) {
  state.mode = m;
  const wrap = document.querySelector('.wrap');
  if (wrap) {
    wrap.classList.remove('mode-products', 'mode-articles');
    wrap.classList.add('mode-' + m);
  }
  const url = new URL(location.href);
  url.searchParams.set('mode', m === 'articles' ? 'thinker' : 'producer');
  history.replaceState(null, '', url);
}

function setLanguage(lang) {
  state.lang = lang;
  const url = new URL(location.href);
  if (lang === 'en') url.searchParams.set('lang', 'en');
  else url.searchParams.delete('lang');
  history.replaceState(null, '', url);
  renderHome();
}

function bindHome() {
  document.querySelectorAll('.more').forEach((b) => b.addEventListener('click', () => {
    state.articlesExpanded = true;
    renderHome();
  }));
  $('#avatarBtn')?.addEventListener('click', () => {
    setMode(state.mode === 'products' ? 'articles' : 'products');
  });
  $('#langBtn')?.addEventListener('click', () => {
    setLanguage(state.lang === 'en' ? 'zh' : 'en');
  });
}

function route() {
  if (location.protocol !== 'file:') {
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (path !== '/') history.replaceState(null, '', '/');
  }
  renderHome();
}

route();
