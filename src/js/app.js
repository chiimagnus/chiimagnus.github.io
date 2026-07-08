// app.js — render + routing. SyncNos redirect/oauth routes preserved as-is.

function renderHome() {
  $('#app').innerHTML = homeView();
  bindHome();
  if (window.initSky) window.initSky();
}

function bindHome() {
  $('#more')?.addEventListener('click', () => {
    state.articlesExpanded = true;
    renderHome();
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
