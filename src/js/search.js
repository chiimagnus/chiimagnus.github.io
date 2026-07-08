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
