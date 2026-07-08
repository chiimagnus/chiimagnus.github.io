const articles = window.ARTICLES || [];
const products = window.PRODUCTS || [];

const $ = (selector) => document.querySelector(selector);

const _params = new URLSearchParams(location.search);
const _m = _params.get('mode');

const state = {
  articlesExpanded: false,
  mode: _m === 'thinker' ? 'articles' : 'products',
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function fmtDate(value) {
  const m = String(value || '').match(/(\d{4})年(\d{2})月(\d{2})日/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : String(value || '');
}
