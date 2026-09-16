const articles = window.ARTICLES || [];
const products = window.PRODUCTS || [];

const $ = (selector) => document.querySelector(selector);

const _params = new URLSearchParams(location.search);
const _m = _params.get('mode');
const _lang = _params.get('lang');

const state = {
  articlesExpanded: false,
  mode: _m === 'thinker' ? 'articles' : 'products',
  lang: _lang === 'en' ? 'en' : 'zh',
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const localize = (item, key) => state.lang === 'en'
  ? (item[`${key}En`] || item[key] || '')
  : (item[key] || '');

function fmtDate(value) {
  const m = String(value || '').match(/(\d{4})年(\d{2})月(\d{2})日/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : String(value || '');
}
