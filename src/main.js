import './index.css';
import articles from './data/articles.json';
import products from './data/products.json';

const NOTION_SYNCNOS_URL = 'https://chiimagnus.notion.site/syncnos';
const $ = (selector) => document.querySelector(selector);

const themes = [
  { name: 'rainbow', colors: { primary: '#ff6b6b', secondary: '#6c5ce7', accent: '#ff6b6b', gradient: 'linear-gradient(45deg, #ff6b6b 0%, #ffd93d 20%, #6c5ce7 40%, #00b894 60%, #0984e3 80%, #e84393 100%)', topBarColor: '#00b894', bottomBarColor: '#6c5ce7' } },
  { name: 'aurora', colors: { primary: '#2d3436', secondary: '#81ecec', accent: '#2d3436', gradient: 'linear-gradient(45deg, #2d3436 0%, #6c5ce7 30%, #00b894 60%, #81ecec 100%)', topBarColor: '#00b894', bottomBarColor: '#6c5ce7' } },
  { name: 'sunset-beach', colors: { primary: '#e17055', secondary: '#00cec9', accent: '#e17055', gradient: 'linear-gradient(45deg, #e17055 0%, #fdcb6e 30%, #0984e3 60%, #00cec9 100%)', topBarColor: '#0984e3', bottomBarColor: '#fdcb6e' } },
  { name: 'cherry-blossom', colors: { primary: '#e84393', secondary: '#dfe6e9', accent: '#e84393', gradient: 'linear-gradient(45deg, #e84393 0%, #fd79a8 30%, #fab1a0 60%, #dfe6e9 100%)', topBarColor: '#fab1a0', bottomBarColor: '#fd79a8' } },
  { name: 'autumn', colors: { primary: '#d63031', secondary: '#ffeaa7', accent: '#d63031', gradient: 'linear-gradient(45deg, #d63031 0%, #fdcb6e 50%, #ffeaa7 100%)', topBarColor: '#fdcb6e', bottomBarColor: '#fdcb6e' } },
  { name: 'neon-noir', colors: { primary: '#ff00ff', secondary: '#00ffff', accent: '#ff00ff', gradient: 'linear-gradient(45deg, #000000 0%, #1a1a1a 30%, #ff00ff 60%, #00ffff 80%, #000000 100%)', topBarColor: '#ff00ff', bottomBarColor: '#1a1a1a' } },
];

const state = {
  articleExpanded: false,
  searchQuery: '',
  selectedTags: ['DOING'],
  sidebarOpen: false,
  theme: themes.find((theme) => theme.name === localStorage.getItem('theme')) || themes[0],
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const svg = {
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  x: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  search: '<svg class="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C17 4.4 18 4.7 18 4.7c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v4.1c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>',
  dedao: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/><text x="6" y="16" font-size="10" font-weight="bold" fill="currentColor">得</text></svg>',
  bilibili: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.659.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906l-1.174 1.12zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>',
  arrow: '<svg class="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  book: '<svg class="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  package: '<svg class="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
}

function setTheme(name) {
  state.theme = themes.find((theme) => theme.name === name) || state.theme;
  const { colors } = state.theme;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
  root.style.setProperty('--bg-gradient', colors.gradient);
  root.style.setProperty('--link-color', colors.primary);
  root.style.setProperty('--hover-color', colors.secondary);
  root.style.setProperty('--primary-color-rgb', hexToRgb(colors.primary));
  root.style.setProperty('--secondary-color-rgb', hexToRgb(colors.secondary));
  document.body.style.backgroundColor = colors.bottomBarColor;
  document.body.style.backgroundImage = colors.gradient;
  document.body.style.backgroundSize = '400% 400%';
  document.body.style.backgroundRepeat = 'no-repeat';
  $('meta[name="theme-color"]')?.setAttribute('content', colors.topBarColor);
  localStorage.setItem('theme', state.theme.name);
}

function startGradientClock() {
  const startedAt = performance.now();
  const tick = (now) => {
    const phase = ((now - startedAt) / 15000) % 1;
    const wave = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
    document.body.style.backgroundPosition = `${(wave * 100).toFixed(3)}% 50%`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function formatDate(value, withTime = true) {
  const match = value.match(/^(\d{4})年(\d{2})月(\d{2})日(?:\s+(\d{2}):(\d{2}))?/);
  if (!match) return value;
  return withTime && match[4] ? `${match[1]}年${match[2]}月${match[3]}日 ${match[4]}:${match[5]}` : `${match[1]}年${match[2]}月${match[3]}日`;
}

function tagColor(tag) {
  if (tag.includes('发布')) return 'bg-yellow-400 text-yellow-900';
  if (tag.includes('归档')) return 'bg-red-400 text-red-900';
  if (tag.includes('已发布')) return 'bg-green-400 text-green-900';
  return 'bg-white bg-opacity-25 text-white';
}

function statusTags() {
  const found = new Set();
  products.forEach((product) => {
    if (product.status?.includes('开发中') || product.status?.includes('即将发布') || product.status?.includes('AdventureX')) found.add('DOING');
    if (product.status?.includes('已发布')) found.add('DONE');
    if (product.tags.some((tag) => tag.includes('归档'))) found.add('Archive');
  });
  return ['DOING', 'DONE', 'Archive'].filter((tag) => found.has(tag));
}

function filteredProducts() {
  if (state.selectedTags.length === 0) return products;
  return products.filter((product) => state.selectedTags.some((tag) => {
    if (tag === 'DOING') return product.status?.includes('开发中') || product.status?.includes('即将发布') || product.status?.includes('AdventureX');
    if (tag === 'DONE') return product.status?.includes('已发布');
    if (tag === 'Archive') return product.tags.some((item) => item.includes('归档'));
    return false;
  }));
}

function searchResults() {
  const query = state.searchQuery.trim().toLowerCase();
  if (!query) return [];
  const articleResults = articles
    .filter((article) => [article.title, article.description, article.slug, article.date].some((value) => value.toLowerCase().includes(query)))
    .map((article, index) => ({ ...article, id: `${article.slug}-${index}`, type: 'article' }));
  const productResults = products
    .filter((product) => (
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.status?.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      product.links.some((link) => link.text.toLowerCase().includes(query))
    ))
    .map((product) => ({ ...product, type: 'product' }));
  return [...articleResults, ...productResults];
}

function liquid(content, className = '') {
  return `<div class="liquid-glass ${className}" style="backdrop-filter:blur(1px) contrast(1.2) brightness(1.05) saturate(1.1);-webkit-backdrop-filter:blur(1px) contrast(1.2) brightness(1.05) saturate(1.1);box-shadow:0 4px 8px rgba(0,0,0,.25),0 -10px 25px inset rgba(0,0,0,.15)">${content}</div>`;
}

function blogCard(article) {
  return liquid(`
    <div class="p-6 h-full flex flex-col">
      <h3 class="text-xl font-bold mb-2">${escapeHtml(article.title)}</h3>
      <p class="text-sm text-gray-300 mb-3">${formatDate(article.date)}</p>
      <p class="text-gray-200 mb-4 flex-grow">${escapeHtml(article.description)}</p>
      <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center font-semibold text-purple-300 hover:text-purple-200">阅读全文 ${svg.arrow}</a>
    </div>
  `, 'rounded-2xl overflow-hidden h-full');
}

function productCard(product) {
  const tags = product.tags.map((tag) => `<span class="text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor(tag)} transition-transform duration-200 hover:scale-105">${escapeHtml(tag)}</span>`).join('');
  const status = product.status ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400 text-blue-900 transition-transform duration-200 hover:scale-105">${escapeHtml(product.status)}</span>` : '';
  const links = product.links.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="block text-sm font-semibold text-purple-300 hover:text-purple-200">${escapeHtml(link.text)}</a>`).join('');
  return liquid(`
    <div class="p-5 flex flex-col h-full">
      <h3 class="text-lg font-bold mb-2">${escapeHtml(product.title)}</h3>
      <p class="text-gray-200 text-sm mb-4 flex-grow">${escapeHtml(product.description)}</p>
      <div class="flex flex-wrap gap-2 mb-4">${tags}${status}</div>
      <div class="mt-auto space-y-1">${links}</div>
    </div>
  `, 'rounded-2xl overflow-hidden h-full');
}

function tagFilter() {
  const normal = {
    DOING: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
    DONE: 'bg-green-400/20 text-green-300 border-green-400/30',
    Archive: 'bg-red-400/20 text-red-300 border-red-400/30',
  };
  const selected = {
    DOING: 'bg-yellow-400 text-yellow-900 border-yellow-400',
    DONE: 'bg-green-400 text-green-900 border-green-400',
    Archive: 'bg-red-400 text-red-900 border-red-400',
  };
  return `
    <div class="flex items-center w-full" style="min-width:0">
      <div class="overflow-x-auto scrollbar-hide py-1" style="flex:1 1 0%;min-width:0;width:0">
        <div class="flex space-x-2 sm:space-x-2" style="width:max-content">
          ${statusTags().map((tag) => {
            const color = state.selectedTags.includes(tag) ? selected[tag] : `${normal[tag]} hover:bg-white/30`;
            return `<button class="tag-filter text-xs sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0 touch-manipulation min-h-[32px] sm:min-h-auto ${color}" data-tag="${tag}">${tag}</button>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function aboutCard() {
  const skills = [
    ['📱', 'iOS/macOS', 'Swift'],
    ['⚛️', 'React', 'TypeScript'],
    ['🔌', '插件开发', 'Chrome/IDE'],
    ['🤖', 'AI集成', 'LLM/API'],
    ['🎨', '产品设计', 'UX/UI'],
  ];
  return `
    <div class="space-y-6">
      ${liquid('<div class="p-6"><p class="text-center text-lg mb-4">热爱创造与表达的多面体，致力于将诗意融入产品设计。</p><div class="flex justify-center flex-wrap gap-3"><span class="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">✍️ 诗人</span><span class="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">⚡ Builder</span><span class="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">🚀 创业者</span><span class="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">💡 产品设计与开发</span><span class="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">🧠 INTJ</span></div></div>', 'rounded-2xl overflow-hidden')}
      ${liquid(`<div class="p-8"><h3 class="text-center text-2xl font-bold mb-8 text-white">核心技能：Vibe Coding</h3><div class="grid grid-cols-2 md:grid-cols-5 gap-4">${skills.map(([icon, name, tech]) => `<div class="text-center group"><div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-opacity-20 hover:scale-105"><div class="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">${icon}</div><h4 class="text-white font-semibold text-sm mb-1">${name}</h4><p class="text-white text-opacity-70 text-xs">${tech}</p></div></div>`).join('')}</div></div>`, 'rounded-2xl overflow-hidden')}
    </div>
  `;
}

function homeContent() {
  if (state.searchQuery.trim()) return searchContent();
  const visibleArticles = state.articleExpanded ? articles : articles.slice(0, 3);
  return `
    <div class="transition-opacity duration-500 opacity-100">
      <div class="space-y-12">
        <section id="articles">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">文章</h2>
            <button id="toggle-articles" class="flex items-center space-x-2 text-sm text-gray-300 hover:text-white">
              <span>${state.articleExpanded ? '收起' : '展开'}</span>
              <span class="transform transition-transform ${state.articleExpanded ? 'rotate-180' : ''}">↓</span>
            </button>
          </div>
          <div class="space-y-6">${visibleArticles.map(blogCard).join('')}</div>
        </section>
        <section id="products">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 min-w-0 w-full">
            <h2 class="text-2xl font-bold flex-shrink-0">产品开发</h2>
            <div class="flex-1 sm:ml-6 min-w-0 max-w-full overflow-hidden">${tagFilter()}</div>
          </div>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">${filteredProducts().map(productCard).join('')}</div>
        </section>
        <section id="about">
          <h2 class="text-2xl font-bold mb-6">关于我</h2>
          ${aboutCard()}
        </section>
      </div>
    </div>
  `;
}

function searchContent() {
  const results = searchResults();
  const cards = results.map((item) => {
    if (item.type === 'article') {
      return `<div class="glass-card p-4"><div class="flex items-center space-x-3 mb-2">${svg.book}<h3 class="text-lg font-semibold">${escapeHtml(item.title)}</h3><span class="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-20">文章</span></div><div class="ml-8"><p class="text-sm text-gray-400 mb-2">${formatDate(item.date, false)}</p><p class="text-sm text-gray-300 mb-3">${escapeHtml(item.description)}</p><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200">阅读全文 ${svg.arrow}</a></div></div>`;
    }
    const tags = item.tags.map((tag) => `<span class="text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor(tag)}">${escapeHtml(tag)}</span>`).join('');
    const status = item.status ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400 text-blue-900">${escapeHtml(item.status)}</span>` : '';
    const links = item.links.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="block text-sm font-semibold text-purple-300 hover:text-purple-200">${escapeHtml(link.text)}</a>`).join('');
    return `<div class="glass-card p-4"><div class="flex items-center space-x-3 mb-2">${svg.package}<h3 class="text-lg font-semibold">${escapeHtml(item.title)}</h3><span class="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-20">产品</span></div><div class="ml-8"><p class="text-sm text-gray-300 mb-3">${escapeHtml(item.description)}</p><div class="flex flex-wrap gap-2 mb-3">${tags}${status}</div><div class="space-y-1">${links}</div></div></div>`;
  }).join('');
  return `<div class="transition-opacity duration-500 opacity-100"><div class="space-y-6"><h2 class="text-2xl font-bold">搜索结果: <span class="text-purple-300">${escapeHtml(state.searchQuery)}</span></h2>${results.length ? `<div class="space-y-4">${cards}</div>` : '<div class="text-center py-10"><p class="text-lg text-gray-400">找不到相关内容。</p></div>'}</div></div>`;
}

function sidebar() {
  const themeButtons = themes.map((theme) => `<button class="theme-button w-7 h-7 rounded-full cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${state.theme.name === theme.name ? 'ring-2 ring-offset-2 ring-accent ring-offset-gray-800' : ''}" style="background:${theme.colors.gradient}" aria-label="Select ${theme.name} theme" title="${theme.name}" data-theme="${theme.name}"></button>`).join('');
  return `
    <div id="sidebar-overlay" class="fixed inset-0 z-30 lg:hidden ${state.sidebarOpen ? 'block' : 'hidden'}"></div>
    <aside id="sidebar" class="fixed inset-y-4 left-4 w-64 z-40 transform transition-transform duration-300 ease-in-out ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'} lg:translate-x-0 flex flex-col space-y-4 p-0">
      ${liquid(`<div class="p-4 text-center"><div class="flex justify-between items-start lg:justify-center"><div class="flex flex-col items-center w-full"><img src="/avatar.png" alt="头像" class="w-24 h-24 rounded-full mb-4 border-2 border-white"><h1 class="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1></div><button id="close-sidebar" class="lg:hidden p-1 -mr-2 -mt-2 text-white">${svg.x}</button></div><div class="flex justify-center space-x-2 mt-4"><a href="mailto:chii_magnus@outlook.com" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="Email">${svg.mail}</a><a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="GitHub">${svg.github}</a><a href="https://m.igetget.com/native/mine/account#/user/detail?enId=GEznR6VwQNKxEeXPOz9xB9Ojy0d24k" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="得到">${svg.dedao}</a><a href="https://space.bilibili.com/1055823731" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="哔哩哔哩">${svg.bilibili}</a></div></div>`, 'rounded-2xl overflow-hidden')}
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
