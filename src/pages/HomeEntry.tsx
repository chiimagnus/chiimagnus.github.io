import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DicePage from './DicePage';

const NOTION_SYNCNOS_URL = 'https://chiimagnus.notion.site/syncnos';

/**
 * HomeEntry
 * - 站点首页入口（`/`）
 * - 仅在“来自 Chrome Web Store/插件页面跳转”或带指定 query/hash 时，重定向到 Notion
 *
 * 说明：
 * - GitHub Pages 是纯静态托管，无法基于来源做服务端重定向，因此这里使用前端判断。
 * - `document.referrer` 可能因为浏览器策略为空，所以推荐在落地 URL 上加 query：
 *   例如在商店里填写 `https://chiimagnus.github.io/?redirect=syncnos`
 */
const HomeEntry: React.FC = () => {
  const location = useLocation();

  /**
   * shouldRedirectToSyncNos
   * - 显式触发：`/?redirect=syncnos`、`/?to=syncnos`、`/?syncnos=1`、`/#syncnos`
   * - 兜底触发：referrer 来自 Chrome Web Store 相关域名
   */
  const shouldRedirectToSyncNos = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = (params.get('redirect') || '').toLowerCase();
    const to = (params.get('to') || '').toLowerCase();
    const syncnos = (params.get('syncnos') || '').toLowerCase();
    const hash = (location.hash || '').toLowerCase();

    if (redirect === 'syncnos') return true;
    if (to === 'syncnos') return true;
    if (syncnos === '1' || syncnos === 'true') return true;
    if (hash === '#syncnos') return true;

    const referrer = (document.referrer || '').toLowerCase();
    if (!referrer) return false;

    return (
      referrer.includes('chromewebstore.google.com') ||
      referrer.includes('chrome.google.com/webstore') ||
      referrer.includes('chrome.google.com')
    );
  }, [location.hash, location.search]);

  useEffect(() => {
    if (!shouldRedirectToSyncNos) return;
    // `replace` 避免用户点击“返回”又回到这个中转页造成循环体验不佳。
    window.location.replace(NOTION_SYNCNOS_URL);
  }, [shouldRedirectToSyncNos]);

  if (shouldRedirectToSyncNos) {
    return (
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
          <h1 className="text-xl font-semibold">Redirecting…</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            If you are not redirected automatically, open:
          </p>
          <a
            className="mt-3 break-all text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            href={NOTION_SYNCNOS_URL}
            rel="noreferrer"
          >
            {NOTION_SYNCNOS_URL}
          </a>
        </div>
      </main>
    );
  }

  return <DicePage />;
};

export default HomeEntry;

