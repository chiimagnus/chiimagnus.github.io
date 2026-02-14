import React, { useEffect, useMemo, useState } from 'react';
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
  const [detail, setDetail] = useState<{ title: string; subtitle: string }>({
    title: '正在处理 OAuth 回调...',
    subtitle: '请稍候'
  });

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
      if (error) {
        setDetail({
          title: 'WebClipper 授权失败',
          subtitle: errorDescription ? `${error}: ${errorDescription}` : error
        });
      } else if (code && state) {
        setDetail({
          title: 'WebClipper 授权完成',
          subtitle: '你可以关闭此页面并回到浏览器扩展（WebClipper）继续操作。'
        });
      } else {
        setDetail({
          title: 'WebClipper 回调参数缺失',
          subtitle: '请返回扩展重新发起 Connect。'
        });
      }
      return;
    }

    setMode('app');
    setDetail({
      title: '正在重定向到 SyncNos...',
      subtitle: '请稍候，正在完成 OAuth 授权流程'
    });

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

    // 重定向到自定义 URL scheme
    // 这会触发 macOS 应用打开并接收回调
    window.location.href = callbackURL;

    // 如果应用没有安装或无法处理 URL scheme，
    // 显示友好的提示信息
    setTimeout(() => {
      // 如果 2 秒后还在这个页面，说明应用可能没有安装
      // 显示提示信息
      const messageDiv = document.getElementById('oauth-message');
      if (messageDiv) {
        messageDiv.style.display = 'block';
      }
    }, 2000);
  }, [parsed]);

  const isLoading = mode === 'pending' || mode === 'app';

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
              onClick={() => {
                try {
                  window.close();
                } catch (_e) {
                  // ignore
                }
              }}
            >
              关闭此页
            </button>
            <div className="px-4 py-2 rounded-lg bg-white/70 text-gray-900 font-semibold border border-white/60 shadow-sm">
              回到 WebClipper 扩展
            </div>
          </div>
        ) : null}

        <div id="oauth-message" className="hidden mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            如果 SyncNos 应用没有自动打开，请确保：
          </p>
          <ul className="text-left text-yellow-700 mt-2 space-y-1">
            <li>• SyncNos 应用已安装</li>
            <li>• 应用已正确配置 URL scheme</li>
            <li>• 尝试手动打开 SyncNos 应用</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SyncNosOAuthCallback;
