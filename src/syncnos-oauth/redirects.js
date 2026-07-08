const SyncNosRedirects = {
  notionUrl: 'https://chiimagnus.notion.site/syncnos',

  renderRedirect(to) {
    $('#app').innerHTML = `<main class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"><div class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12 text-center"><h1 class="text-xl font-semibold">Redirecting…</h1><p class="mt-3 text-sm text-slate-600 dark:text-slate-300">If you are not redirected automatically, open:</p><a class="mt-3 break-all text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300" href="${to}" rel="noreferrer">${to}</a></div></main>`;
    window.location.replace(to);
  },

  shouldRedirectHome() {
    const params = new URLSearchParams(location.search);
    const redirect = (params.get('redirect') || '').toLowerCase();
    const to = (params.get('to') || '').toLowerCase();
    const syncnos = (params.get('syncnos') || '').toLowerCase();
    const referrer = (document.referrer || '').toLowerCase();

    return (
      redirect === 'syncnos' ||
      to === 'syncnos' ||
      syncnos === '1' ||
      syncnos === 'true' ||
      location.hash.toLowerCase() === '#syncnos' ||
      referrer.includes('chromewebstore.google.com') ||
      referrer.includes('chrome.google.com/webstore') ||
      referrer.includes('chrome.google.com')
    );
  },
};
