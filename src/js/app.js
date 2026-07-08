function renderHome() {
  $('#app').innerHTML = homeView();
  bindHome();
  if (window.initSky) window.initSky();
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
  if (location.protocol === 'file:') return renderHome();
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/syncnos') return SyncNosRedirects.renderRedirect(SyncNosRedirects.notionUrl);
  if (path === '/syncnos-oauth/callback') return SyncNosOAuth.renderCallback();
  if (path === '/syncnos-oauth/test') return SyncNosOAuth.renderTest();
  if (path !== '/' && path !== '/blog') {
    history.replaceState(null, '', '/');
    return renderHome();
  }
  if (SyncNosRedirects.shouldRedirectHome()) return SyncNosRedirects.renderRedirect(SyncNosRedirects.notionUrl);
  return renderHome();
}

route();
