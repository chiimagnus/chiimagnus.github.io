function homeView() {
  const renderEntries = (list) => list.map((a) => `
    <a class="entry" href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">
      <span class="title">${escapeHtml(a.title)}</span>
      <span class="date">${escapeHtml(fmtDate(a.date))}</span>
    </a>`).join('');
  const visibleArticles = state.articlesExpanded ? articles : articles.slice(0, 12);
  const articleEntries = renderEntries(visibleArticles);
  const articleMore = (!state.articlesExpanded && articles.length > 12)
    ? `<button class="more">展开全部 ${articles.length} 篇 →</button>` : '';

  const connectorSvg = `<svg class="connector" viewBox="0 0 12 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="connector-base" d="M6,0 C11,28 1,72 6,100" pathLength="100"/>
        <path class="connector-flow" d="M6,0 C11,28 1,72 6,100" pathLength="100"/>
      </svg>`;
  const productList = products.map((p, i) => {
    const link = (p.links || [])[0];
    const statusText = p.status || '';
    const status = statusText ? `<span class="status">${escapeHtml(statusText)}</span>` : '';
    const linkHtml = link
      ? `<a class="plink" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)} ↗</a>`
      : '';
    const desc = p.description ? `<p class="desc">${escapeHtml(p.description)}</p>` : '';
    const connector = i < products.length - 1 ? connectorSvg : '';
    return `
    <div class="product">
      <div class="phead"><span class="title">${escapeHtml(p.title)}</span>${status}${linkHtml}</div>
      ${desc}
      ${connector}
    </div>`;
  }).join('');

  return `
    <div class="sky"></div>
    <div class="stars" id="stars"></div>
    <div class="skyfield"><div class="cel sun" id="cel"></div></div>
    <div class="wrap mode-${state.mode}">
      <header class="hero">
        <div class="idrow">
          <button class="avatar-btn" id="avatarBtn" type="button" title="点击切换 产品 / 文章" aria-label="点击头像切换 产品 / 文章">
            <img class="avatar av-products" src="public/avatar-products.png" alt="𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼" />
            <img class="avatar av-articles" src="public/avatar.png" alt="Chii" />
          </button>
          <h1 class="name"><span class="name-products">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</span><span class="name-articles">𝓒𝓱𝓲𝓲</span></h1>
        </div>
        <p class="about products">狂热的开源玩家。</p>
        <p class="about articles">我的前面有两条路，我选择了人迹更少的道路，因此生命迥然不同。</p>
      </header>

      <section class="block block-products">
        <h2 class="stitle">「产品」</h2>
        <div class="products">${productList}</div>
      </section>

      <section class="block block-articles">
        <h2 class="stitle">「文章」</h2>
        <div class="entries">${articleEntries}</div>
        ${articleMore}
      </section>

      <footer>
        <span class="copyright">© ${new Date().getFullYear()} 𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</span>
        <span class="social">
          <a href="mailto:chii_magnus@outlook.com">Email</a>
          <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer">GitHub</a>
        </span>
      </footer>
    </div>`;
}
