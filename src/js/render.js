// render.js — 首页视图（「时辰流动」主题 · 单栏 · 点击头像循环切换 产品/文章）。
// 默认产品。无顶栏。产品/文章各用不同头像，点击头像切换。
// 产品不再展示技术栈标签；仅保留真实状态（已发布/获奖/已归档）与 GitHub 链接。

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
    const archived = (p.tags || []).some((t) => t.indexOf('归档') !== -1);
    const statusText = p.status || (archived ? '📁 已归档' : '');
    const status = statusText ? `<span class="status">${escapeHtml(statusText)}</span>` : '';
    const linkHtml = link
      ? `<div class="meta"><a class="plink" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)} ↗</a></div>`
      : '';
    return `
    <div class="product">
      <div class="phead"><span class="title">${escapeHtml(p.title)}</span>${status}</div>
      <p class="desc">${escapeHtml(p.description)}</p>
      ${linkHtml}
    </div>`;
  }).join('');

  return `
    <div class="sky"></div>
    <div class="stars" id="stars"></div>
    <div class="skyfield"><div class="cel sun" id="cel"></div></div>
    <div class="wrap mode-${state.mode}">
      <button class="avatar-btn" id="avatarBtn" type="button" title="点击切换 产品 / 文章" aria-label="点击头像切换 产品 / 文章">
        <img class="avatar av-products" src="public/avatar-products.png" alt="Chii Magnus" />
        <img class="avatar av-articles" src="public/avatar.png" alt="Chii Magnus" />
      </button>
      <h1 class="name">𝓒𝓱𝓲𝓲 𝓜𝓪𝓭𝓷𝓾𝓼</h1>
      <p class="about products">热爱创造与表达，做 iOS / macOS 产品与工具。</p>
      <p class="about articles">我的前面有两条路，我选择了人迹更少的道路，因此生命迥然不同。</p>
      <div class="social">
        <a href="mailto:chii_magnus@outlook.com">Email</a>
        <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>

      <section class="block block-products">
        <div class="section-title">产品开发</div>
        <div class="products">${productList}</div>
      </section>

      <section class="block block-articles">
        <div class="section-title">文章</div>
        <div class="entries">${entries}</div>
        ${more}
      </section>

      <footer>© ${new Date().getFullYear()} Chii Magnus <span class="phase" id="phaseLab">—</span></footer>
    </div>`;
}
