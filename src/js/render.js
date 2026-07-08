function homeView() {
  const workArticles = articles.filter((a) => a.category === 'work');
  const lifeArticles = articles.filter((a) => a.category !== 'work');

  const renderEntries = (list) => list.map((a) => `
    <a class="entry" href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">
      <span class="title">${escapeHtml(a.title)}</span>
      <span class="date">${escapeHtml(fmtDate(a.date))}</span>
    </a>`).join('');
  const sliced = (list) => state.articlesExpanded ? list : list.slice(0, 12);
  const moreBtn = (list) => (!state.articlesExpanded && list.length > 12)
    ? `<button class="more">展开全部 ${list.length} 篇 →</button>` : '';

  const workEntries = renderEntries(sliced(workArticles));
  const workMore = moreBtn(workArticles);
  const lifeEntries = renderEntries(sliced(lifeArticles));
  const lifeMore = moreBtn(lifeArticles);

  const productList = products.map((p) => {
    const link = (p.links || [])[0];
    const statusText = p.status || '';
    const status = statusText ? `<span class="status">${escapeHtml(statusText)}</span>` : '';
    const linkHtml = link
      ? `<a class="plink" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)} ↗</a>`
      : '';
    const desc = p.description ? `<p class="desc">${escapeHtml(p.description)}</p>` : '';
    return `
    <div class="product">
      <div class="phead"><span class="title">${escapeHtml(p.title)}</span>${status}${linkHtml}</div>
      ${desc}
    </div>`;
  }).join('');

  return `
    <div class="sky"></div>
    <div class="stars" id="stars"></div>
    <div class="skyfield"><div class="cel sun" id="cel"></div></div>
    <div class="wrap mode-${state.mode}">
      <header class="hero">
        <div class="idrow">
          <button class="avatar-btn" id="avatarBtn" type="button" title="点击切换 工作思考 / 个人生活思考" aria-label="点击头像切换 工作思考 / 个人生活思考">
            <img class="avatar av-products" src="public/avatar-products.png" alt="Chii Magnus" />
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

      <section class="block block-worknotes">
        <h2 class="stitle">「手记」</h2>
        <div class="entries">${workEntries}</div>
        ${workMore}
      </section>

      <section class="block block-articles">
        <h2 class="stitle">「文章」</h2>
        <div class="entries">${lifeEntries}</div>
        ${lifeMore}
      </section>

      <footer>
        <span class="copyright">© ${new Date().getFullYear()} Chii Magnus</span>
        <span class="social">
          <a href="mailto:chii_magnus@outlook.com">Email</a>
          <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer">GitHub</a>
        </span>
      </footer>
    </div>`;
}
