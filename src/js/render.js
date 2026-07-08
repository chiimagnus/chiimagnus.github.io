// render.js — 首页视图（「时辰流动」主题 · 左对齐非对称 · 花体大字名当主角）。
// 不复刻别人的 style：专属基因 = 时辰天色 + 花体名 + Frost 诗 + 「」角括号板块标题。
// 产品 mode 用全名 Chii Magnus（创造者）；文章 mode 只用花名 Chii（写作者）。
// 两个列表的 UI/UX 有意拉开：文章 = 紧凑索引（标题+日期+细线）；产品 = 编号作品陈列（序号+胶囊状态+描述）。
// 默认产品。无顶栏。点击头像循环切换。

function homeView() {
  const visibleArticles = state.articlesExpanded ? articles : articles.slice(0, 12);

  const entries = visibleArticles.map((a) => `
    <a class="entry" href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">
      <span class="title">${escapeHtml(a.title)}</span>
      <span class="date">${escapeHtml(fmtDate(a.date))}</span>
    </a>`).join('');

  const more = (!state.articlesExpanded && articles.length > 12)
    ? `<button class="more" id="more">展开全部 ${articles.length} 篇 →</button>`
    : '';

  const productList = products.map((p) => {
    const link = (p.links || [])[0];
    const archived = (p.tags || []).some((t) => t.indexOf('归档') !== -1);
    const statusText = p.status || (archived ? '📁 已归档' : '');
    const status = statusText ? `<span class="status">${escapeHtml(statusText)}</span>` : '';
    const linkHtml = link
      ? `<a class="plink" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)} ↗</a>`
      : '';
    return `
    <div class="product">
      <div class="phead"><span class="title">${escapeHtml(p.title)}</span>${status}${linkHtml}</div>
      <p class="desc">${escapeHtml(p.description)}</p>
    </div>`;
  }).join('');

  return `
    <div class="sky"></div>
    <div class="stars" id="stars"></div>
    <div class="skyfield"><div class="cel sun" id="cel"></div></div>
    <div class="wrap mode-${state.mode}">
      <header class="hero">
        <button class="avatar-btn" id="avatarBtn" type="button" title="点击切换 产品 / 文章" aria-label="点击头像切换 产品 / 文章">
          <img class="avatar av-products" src="public/avatar-products.png" alt="Chii Magnus" />
          <img class="avatar av-articles" src="public/avatar.png" alt="Chii" />
        </button>
        <h1 class="name"><span class="name-products">𝓒𝓱𝓲𝓲 𝓜𝓪𝓭𝓷𝓾𝓼</span><span class="name-articles">𝓒𝓱𝓲𝓲</span></h1>
        <p class="about products">热爱创造与表达，做 iOS / macOS 产品与工具。</p>
        <p class="about articles">我的前面有两条路，我选择了人迹更少的道路，因此生命迥然不同。</p>
        <div class="social">
          <a href="mailto:chii_magnus@outlook.com">Email</a>
          <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </header>

      <section class="block block-products">
        <h2 class="stitle">「产品」</h2>
        <div class="products">${productList}</div>
      </section>

      <section class="block block-articles">
        <h2 class="stitle">「文章」</h2>
        <div class="entries">${entries}</div>
        ${more}
      </section>

      <footer>© ${new Date().getFullYear()} Chii Magnus</footer>
    </div>`;
}
