function renderHome() {
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

function bindHome() {
  document.querySelectorAll('.more').forEach((b) => b.addEventListener('click', () => {
    state.articlesExpanded = true;
    renderHome();
  }));
  $('#avatarBtn')?.addEventListener('click', () => {
    setMode(state.mode === 'products' ? 'articles' : 'products');
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
