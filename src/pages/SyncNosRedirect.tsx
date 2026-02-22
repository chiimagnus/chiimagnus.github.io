import { useEffect } from 'react'

interface SyncNosRedirectProps {
  /** External destination URL to redirect to. */
  to: string
}

/**
 * Client-side redirect to an external URL.
 * Used for GitHub Pages (static hosting) where server-side redirects are unavailable.
 */
export default function SyncNosRedirect({ to }: SyncNosRedirectProps) {
  // Redirect on mount. `replace` avoids adding an extra history entry.
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Redirecting…</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          If you are not redirected automatically, open:
        </p>
        <a
          className="mt-3 break-all text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          href={to}
          rel="noreferrer"
        >
          {to}
        </a>
      </div>
    </main>
  )
}

