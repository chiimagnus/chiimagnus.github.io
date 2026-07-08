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
