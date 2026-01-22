import articlesData from '../../data/articles.json';
import productsData from '../../data/products.json';
import { themes } from '../../data/themes';

export interface DiceLink {
  text: string;
  url: string;
}

export interface DiceArticleCard {
  type: 'article';
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  external: boolean;
}

export interface DiceProductCard {
  type: 'product';
  id: string;
  title: string;
  description: string;
  tags: string[];
  status?: string;
  links: DiceLink[];
}

export interface DiceAboutCard {
  type: 'about';
  id: 'about';
}

export interface DiceThemeCard {
  type: 'theme';
  id: string;
  themeName: string;
}

export type DiceCard = DiceArticleCard | DiceProductCard | DiceAboutCard | DiceThemeCard;

interface DrawCardParams {
  diceResult: number;
  pool: DiceCard[];
}

/**
 * getRandomUint32
 * 使用 Web Crypto 生成随机数；若不可用则回退到 Math.random。
 */
const getRandomUint32 = (): number => {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] ?? 0;
  }
  return Math.floor(Math.random() * 2 ** 32);
};

/**
 * buildDicePool
 * 构建“命运抽卡池”（扁平等概率）。
 *
 * 约定：
 * - 包含：文章 / 产品 / 关于我（1张） / 主题（所有 themes）
 * - 明确不包含：AI 小助手（不从路由/Sidebar 读取任何内容）
 */
export const buildDicePool = (): DiceCard[] => {
  const pool: DiceCard[] = [];

  // Articles
  const articles = (
    articlesData as Array<{ title: string; date: string; description: string; url: string; external?: boolean }>
  ).map((article, index) => ({
      type: 'article' as const,
      id: `article-${index}`,
      title: article.title,
      description: article.description,
      publishedAt: article.date,
      url: article.url,
      external: Boolean(article.external),
    }));
  pool.push(...articles);

  // Products
  const products = (
    productsData as Array<{
      title: string;
      description: string;
      tags: string[];
      status?: string;
      links: DiceLink[];
    }>
  ).map((product, index) => ({
    type: 'product' as const,
    id: `product-${index}`,
    title: product.title,
    description: product.description,
    tags: product.tags,
    status: product.status,
    links: product.links,
  }));
  pool.push(...products);

  // About（固定 1 张）
  pool.push({ type: 'about', id: 'about' });

  // Themes
  const themeCards = themes.map((theme) => ({
    type: 'theme' as const,
    id: `theme-${theme.name}`,
    themeName: theme.name,
  }));
  pool.push(...themeCards);

  return pool;
};

/**
 * drawCard
 * 用 diceResult + 随机数混合后取模，从 pool 中抽取一张卡。
 */
export const drawCard = ({ diceResult, pool }: DrawCardParams): DiceCard | null => {
  if (pool.length === 0) return null;

  const random = getRandomUint32();
  const safeDice = Number.isFinite(diceResult) ? Math.trunc(diceResult) : 0;
  const index = (safeDice + (random % pool.length)) % pool.length;

  return pool[index] ?? null;
};
