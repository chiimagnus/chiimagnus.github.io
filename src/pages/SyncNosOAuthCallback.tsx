import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * SyncNos OAuth 回调页面
 * 
 * Notion OAuth 会重定向到此页面（GitHub Pages），
 * - macOS App：此页面会将回调重定向到自定义 URL scheme（syncnos://），以便应用接收回调。
 * - WebClipper：此页面不会跳转到 syncnos://，避免被 Universal Link 拉起 App；
 *   由扩展通过 webNavigation 监听此 URL 来完成授权。
 */
const SyncNosOAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'pending' | 'webclipper' | 'app'>('pending');
  const [webclipperProcessing, setWebclipperProcessing] = useState(false);
  const [showCloseBlockedHint, setShowCloseBlockedHint] = useState(false);
  const [showAppFallback, setShowAppFallback] = useState(false);
  const [detail, setDetail] = useState<{ title: string; subtitle: string }>({
    title: '正在处理 OAuth 回调...',
    subtitle: '请稍候'
  });

  const tryCloseCurrentPage = useCallback(() => {
    setShowCloseBlockedHint(false);

    try {
      window.close();
    } catch (_e) {
      // ignore
    }

    try {
      // 某些浏览器对直接 close 有限制，这个是常见兜底写法。
      window.open('', '_self');
      window.close();
    } catch (_e) {
      // ignore
    }

    window.setTimeout(() => {
      // 如果页面仍可见，说明浏览器策略阻止了脚本关闭标签页。
      if (document.visibilityState === 'visible') {
        setShowCloseBlockedHint(true);
      }
    }, 500);
  }, []);

  const parsed = useMemo(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const isWebClipper = Boolean(state && state.startsWith('webclipper_'));
    return { code, state, error, errorDescription, isWebClipper };
  }, [searchParams]);

  useEffect(() => {
    const { code, state, error, errorDescription, isWebClipper } = parsed;

    if (isWebClipper) {
      setMode('webclipper');
      setShowAppFallback(false);
      if (error) {
        setWebclipperProcessing(false);
        setDetail({
          title: 'WebClipper 授权失败',
          subtitle: errorDescription ? `${error}: ${errorDescription}` : error
        });
        return;
      } else if (code && state) {
        setWebclipperProcessing(true);
        setShowCloseBlockedHint(false);
        setDetail({
          title: '正在完成 WebClipper 授权…',
          subtitle: '授权结果已发送到扩展，通常会在几秒内自动关闭此页。'
        });

        const autoCloseTimer = window.setTimeout(() => {
          tryCloseCurrentPage();
        }, 1200);

        const settleTimer = window.setTimeout(() => {
          setWebclipperProcessing(false);
          setDetail({
            title: 'WebClipper 授权已回传',
            subtitle: '如果页面尚未自动关闭，请手动关闭此页并返回 WebClipper。'
          });
        }, 8500);

        return () => {
          window.clearTimeout(autoCloseTimer);
          window.clearTimeout(settleTimer);
        };
      } else {
        setWebclipperProcessing(false);
        setDetail({
          title: 'WebClipper 回调参数缺失',
          subtitle: '请返回扩展重新发起 Connect。'
        });
        return;
      }
    }

    setMode('app');
    setWebclipperProcessing(false);
    setShowCloseBlockedHint(false);
    setDetail({
      title: '正在重定向到 SyncNos...',
      subtitle: '请稍候，正在尝试打开 SyncNos 应用并完成 OAuth 授权流程。'
    });
    setShowAppFallback(false);

    // 构建自定义 URL scheme 回调
    const customScheme = 'syncnos://oauth/callback';
    const params = new URLSearchParams();
    
    if (error) {
      // 如果有错误，传递错误信息
      params.append('error', error);
      if (errorDescription) {
        params.append('error_description', errorDescription);
      }
    } else if (code && state) {
      // 正常情况：传递 code 和 state
      params.append('code', code);
      params.append('state', state);
    }

    const callbackURL = `${customScheme}?${params.toString()}`;

    const redirectTimer = window.setTimeout(() => {
      // 重定向到自定义 URL scheme
      // 这会触发 macOS 应用打开并接收回调
      window.location.href = callbackURL;
    }, 250);

    // 如果应用没有安装或无法处理 URL scheme，
    // 显示友好的提示信息
    const appFallbackTimer = window.setTimeout(() => {
      // 如果 2 秒后还在这个页面，说明应用可能没有安装
      setShowAppFallback(true);
    }, 2000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearTimeout(appFallbackTimer);
    };
  }, [parsed, tryCloseCurrentPage]);

  const isLoading = mode === 'pending' || mode === 'app' || (mode === 'webclipper' && webclipperProcessing);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        {isLoading ? (
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="inline-flex items-center justify-center rounded-full h-12 w-12 bg-white/70 border border-white/60 shadow-sm text-2xl">
              ✓
            </div>
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{detail.title}</h1>
        <p className="text-gray-600 mb-4">{detail.subtitle}</p>

        {mode === 'webclipper' ? (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors"
              onClick={tryCloseCurrentPage}
            >
              {webclipperProcessing ? '关闭此页（可手动）' : '关闭此页'}
            </button>
            <div className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 font-semibold border border-white/60 shadow-sm">
              回到 WebClipper 扩展
            </div>
          </div>
        ) : null}

        {mode === 'webclipper' && showCloseBlockedHint ? (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              浏览器阻止了脚本自动关闭标签页，请手动关闭此页后回到 WebClipper。
            </p>
          </div>
        ) : null}

        {mode === 'app' && showAppFallback ? (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            如果 SyncNos 应用没有自动打开，请确保：
          </p>
          <ul className="text-left text-yellow-700 mt-2 space-y-1">
            <li>• SyncNos 应用已安装</li>
            <li>• 应用已正确配置 URL scheme</li>
            <li>• 尝试手动打开 SyncNos 应用</li>
          </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SyncNosOAuthCallback;
