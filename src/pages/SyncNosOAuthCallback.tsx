import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * SyncNos OAuth 回调页面
 * 
 * Notion OAuth 会重定向到此页面（GitHub Pages），
 * 然后此页面会将回调重定向到自定义 URL scheme（syncnos://）
 * 以便 macOS 应用接收回调。
 */
const SyncNosOAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 从 URL 参数中提取 code 和 state
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

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
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          正在重定向到 SyncNos...
        </h1>
        <p className="text-gray-600 mb-4">
          请稍候，正在完成 OAuth 授权流程
        </p>
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

