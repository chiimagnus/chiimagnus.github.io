import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SyncNos OAuth 回调测试页面
 * 
 * 用于测试 OAuth 回调功能，可以手动输入参数来模拟 Notion 的重定向
 */
const SyncNosOAuthTest: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('test_code_12345');
  const [state, setState] = useState('test_state_67890');
  const [error, setError] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  const handleTestSuccess = () => {
    // 模拟成功回调
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('state', state);
    navigate(`/syncnos-oauth/callback?${params.toString()}`);
  };

  const handleTestError = () => {
    // 模拟错误回调
    const params = new URLSearchParams();
    params.append('error', error || 'access_denied');
    if (errorDescription) {
      params.append('error_description', errorDescription);
    }
    navigate(`/syncnos-oauth/callback?${params.toString()}`);
  };

  const handleDirectRedirect = () => {
    // 直接测试 URL scheme 重定向
    const params = new URLSearchParams();
    if (code && state) {
      params.append('code', code);
      params.append('state', state);
    }
    const callbackURL = `syncnos://oauth/callback?${params.toString()}`;
    window.location.href = callbackURL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          SyncNos OAuth 回调测试
        </h1>

        <div className="space-y-6">
          {/* 成功场景测试 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ✅ 成功场景测试
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorization Code:
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="test_code_12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State:
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="test_state_67890"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleTestSuccess}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  测试回调页面重定向
                </button>
                <button
                  onClick={handleDirectRedirect}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  直接测试 URL Scheme
                </button>
              </div>
            </div>
          </div>

          {/* 错误场景测试 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ❌ 错误场景测试
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Code:
                </label>
                <input
                  type="text"
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="access_denied"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Description (可选):
                </label>
                <input
                  type="text"
                  value={errorDescription}
                  onChange={(e) => setErrorDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="User denied access"
                />
              </div>
              <button
                onClick={handleTestError}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                测试错误回调
              </button>
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">测试说明：</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>测试回调页面重定向</strong>：会导航到回调页面，然后自动重定向到 syncnos://</li>
              <li>• <strong>直接测试 URL Scheme</strong>：直接尝试打开 syncnos://，如果应用已安装会立即打开</li>
              <li>• <strong>测试错误回调</strong>：模拟 Notion 返回错误的情况</li>
              <li>• 如果应用没有安装，浏览器可能会显示"无法打开"的提示</li>
            </ul>
          </div>

          {/* 快速测试链接 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">快速测试链接：</h3>
            <div className="space-y-2 text-sm">
              <a
                href="/syncnos-oauth/callback?code=test123&state=test456"
                className="block text-blue-600 hover:underline"
              >
                /syncnos-oauth/callback?code=test123&state=test456
              </a>
              <a
                href="/syncnos-oauth/callback?error=access_denied&error_description=User%20denied"
                className="block text-red-600 hover:underline"
              >
                /syncnos-oauth/callback?error=access_denied&error_description=User%20denied
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncNosOAuthTest;

