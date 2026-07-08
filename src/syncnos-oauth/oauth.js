const SyncNosOAuth = {
  renderCallback() {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const oauthState = params.get('state');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    const isWebClipper = Boolean(oauthState?.startsWith('webclipper_'));
    const isHealthIOS = Boolean(oauthState?.startsWith('syncnos_health_ios_'));
    let mode = 'app';
    let loading = true;
    let title = '无法识别的回调请求';
    let subtitle = '缺少 state 或 state 前缀不受支持；请返回发起授权的应用重新尝试。';
    let fallback = '';

    const closeButtons = '<div class="flex items-center justify-center gap-3"><button id="close-page" type="button" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors">关闭此页</button><div class="px-4 py-2 rounded-lg bg-white/70 text-gray-900 font-semibold border border-white/60 shadow-sm">回到 WebClipper 扩展</div></div>';

    if (isWebClipper) {
      mode = 'webclipper';
      loading = false;
      if (error) {
        title = 'WebClipper 授权失败';
        subtitle = errorDescription ? `${error}: ${errorDescription}` : error;
      } else if (code && oauthState) {
        title = 'WebClipper 授权已回传';
        subtitle = '页面将自动关闭；若未关闭，请手动关闭并返回 WebClipper。';
        setTimeout(this.tryCloseCurrentPage, 1200);
      } else {
        title = 'WebClipper 回调参数缺失';
        subtitle = '请返回扩展重新发起 Connect。';
      }
    } else if (isHealthIOS && (error || (code && oauthState))) {
      title = '正在重定向到 SyncNos...';
      subtitle = '请稍候，正在尝试打开 SyncNos 应用并完成 OAuth 授权流程。';
      const callbackParams = new URLSearchParams();
      if (error) {
        callbackParams.append('error', error);
        if (errorDescription) callbackParams.append('error_description', errorDescription);
      } else {
        callbackParams.append('code', code);
        callbackParams.append('state', oauthState);
      }
      setTimeout(() => { location.href = `syncnos-health-ios://oauth/callback?${callbackParams}`; }, 250);
      setTimeout(() => {
        $('#app-fallback')?.classList.remove('hidden');
      }, 2000);
      fallback = '<div id="app-fallback" class="hidden mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p class="text-yellow-800">如果 SyncNos 应用没有自动打开，请确保：</p><ul class="text-left text-yellow-700 mt-2 space-y-1"><li>• SyncNos 应用已安装</li><li>• 应用已正确配置 URL scheme</li><li>• 尝试手动打开 SyncNos 应用</li></ul></div>';
    } else if (isHealthIOS) {
      title = '回调参数缺失';
      subtitle = '未收到 code/state 或 error；请返回应用重新发起授权。';
    }

    $('#app').innerHTML = `<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div class="text-center p-8"><div class="mb-4">${loading ? '<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>' : '<div class="inline-flex items-center justify-center rounded-full h-12 w-12 bg-white/70 border border-white/60 shadow-sm text-2xl">✓</div>'}</div><h1 class="text-2xl font-bold text-gray-900 mb-2">${escapeHtml(title)}</h1><p class="text-gray-600 mb-4">${escapeHtml(subtitle)}</p>${mode === 'webclipper' ? closeButtons : ''}${fallback}</div></div>`;
    $('#close-page')?.addEventListener('click', this.tryCloseCurrentPage);
  },

  tryCloseCurrentPage() {
    window.close();
    window.open('', '_self');
    window.close();
  },

  renderTest() {
    $('#app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">SyncNos OAuth 回调测试</h1>
          <div class="space-y-6">
            <div class="border border-gray-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-gray-800 mb-4">✅ 成功场景测试</h2><div class="space-y-4"><label class="block text-sm font-medium text-gray-700 mb-2">Authorization Code:</label><input id="test-code" type="text" value="test_code_12345" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><label class="block text-sm font-medium text-gray-700 mb-2">State:</label><input id="test-state" type="text" value="test_state_67890" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><div class="flex gap-4"><button id="test-success" class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">测试回调页面重定向</button><button id="test-direct" class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">直接测试 URL Scheme</button></div></div></div>
            <div class="border border-gray-200 rounded-lg p-6"><h2 class="text-xl font-semibold text-gray-800 mb-4">❌ 错误场景测试</h2><div class="space-y-4"><label class="block text-sm font-medium text-gray-700 mb-2">Error Code:</label><input id="test-error" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="access_denied"><label class="block text-sm font-medium text-gray-700 mb-2">Error Description (可选):</label><input id="test-error-description" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="User denied access"><button id="test-error-button" class="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">测试错误回调</button></div></div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 class="font-semibold text-blue-900 mb-2">测试说明：</h3><ul class="text-sm text-blue-800 space-y-1"><li>• <strong>测试回调页面重定向</strong>：会导航到回调页面，然后自动重定向到 syncnos://</li><li>• <strong>直接测试 URL Scheme</strong>：直接尝试打开 syncnos://，如果应用已安装会立即打开</li><li>• <strong>测试错误回调</strong>：模拟 Notion 返回错误的情况</li><li>• 如果应用没有安装，浏览器可能会显示"无法打开"的提示</li></ul></div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4"><h3 class="font-semibold text-gray-900 mb-2">快速测试链接：</h3><div class="space-y-2 text-sm"><a href="/syncnos-oauth/callback?code=test123&state=test456" class="block text-blue-600 hover:underline">/syncnos-oauth/callback?code=test123&state=test456</a><a href="/syncnos-oauth/callback?error=access_denied&error_description=User%20denied" class="block text-red-600 hover:underline">/syncnos-oauth/callback?error=access_denied&error_description=User%20denied</a></div></div>
          </div>
        </div>
      </div>
    `;
    $('#test-success').addEventListener('click', () => {
      const params = new URLSearchParams({ code: $('#test-code').value, state: $('#test-state').value });
      location.href = `/syncnos-oauth/callback?${params}`;
    });
    $('#test-direct').addEventListener('click', () => {
      const params = new URLSearchParams({ code: $('#test-code').value, state: $('#test-state').value });
      location.href = `syncnos://oauth/callback?${params}`;
    });
    $('#test-error-button').addEventListener('click', () => {
      const params = new URLSearchParams({ error: $('#test-error').value || 'access_denied' });
      if ($('#test-error-description').value) params.append('error_description', $('#test-error-description').value);
      location.href = `/syncnos-oauth/callback?${params}`;
    });
  },
};
