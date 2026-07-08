// render.js — plain, minimal home view (post-kill baseline).
// Removed: rainbow gradient, liquid glass, theme swatches, script-font name,
// search / ⌘K, product DOING/DONE/Archive filters, "Vibe Coding" tiles.

function homeView() {
  const visibleArticles = state.articlesExpanded ? articles : articles.slice(0, 10);

  const entries = visibleArticles.map((a) => `
    <a class="entry" href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">
      <span class="title">${escapeHtml(a.title)}</span>
      <span class="date">${escapeHtml(fmtDate(a.date))}</span>
    </a>`).join('');

  const more = (!state.articlesExpanded && articles.length > 10)
    ? `<button class="more" id="more">展开全部 ${articles.length} 篇</button>`
    : '';

  const productList = products.map((p) => {
    const link = (p.links || [])[0];
    const status = p.status ? `<span class="status">${escapeHtml(p.status)}</span>` : '';
    const tags = (p.tags || []).join(' · ');
    const linkHtml = link
      ? ` — <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)}</a>`
      : '';
    return `
    <div class="product">
      <div><span class="title">${escapeHtml(p.title)}</span>${status}</div>
      <p class="desc">${escapeHtml(p.description)}</p>
      <div class="meta">${escapeHtml(tags)}${linkHtml}</div>
    </div>`;
  }).join('');

  return `
    <div class="sky"></div>
    <div class="stars" id="stars"></div>
    <div class="skyfield"><div class="cel sun" id="cel"></div></div>
    <div class="wrap">
      <div class="skybar"><span>Chii Magnus</span><span class="phase" id="phaseLab">—</span></div>
      <img class="avatar" src="public/avatar.png" alt="Chii Magnus" />
      <h1 class="name">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1>
      <p class="about">热爱创造与表达，做 iOS / macOS 产品与工具。</p>
      <div class="social">
        <a href="mailto:chii_magnus@outlook.com">Email</a>
        <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://m.igetget.com/native/mine/account#/user/detail?enId=GEznR6VwQNKxEeXPOz9xB9Ojy0d24k" target="_blank" rel="noopener noreferrer">得到</a>
        <a href="https://space.bilibili.com/1055823731" target="_blank" rel="noopener noreferrer">Bilibili</a>
      </div>

      <div class="section-title">文章</div>
      <div>${entries}</div>
      ${more}

      <div class="section-title">产品开发</div>
      <div>${productList}</div>

      <footer>© ${new Date().getFullYear()} Chii Magnus</footer>
    </div>`;
}
