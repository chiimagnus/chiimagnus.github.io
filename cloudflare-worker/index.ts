export interface Env {
  ZHIPU_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    if (request.headers.get('Content-Type') !== 'application/json') {
      return new Response('Expected Content-Type to be application/json', { status: 400 });
    }

    try {
      const { question, context } = (await request.json()) as { question: string; context: any[] };

      if (!question) {
        return new Response('Missing question in request body', { status: 400 });
      }
      
      const contextText = context.map(c => `### ${c.title}\n${c.content}`).join('\n\n');
      
      const systemPrompt = `你是我的个人AI助手，名为"Chii AI"。你的知识完全来源于我提供给你的背景信息。请根据这些信息，用第一人称"我"来回答用户的问题。
      你的回答应遵循以下规则：
      1.  **忠于原文**：只使用我提供的信息作答，不要编造或从外部获取信息。
      2.  **自然流畅**：语言风格要像一个博主在与读者对话，亲切、自然。
      3.  **简洁明了**：如果信息不足，就直接说"关于这个问题，我的资料里没有提到"或类似的话。
      4.  **保护隐私**：不要透露任何关于API密钥、代码实现等技术细节。
      
      【背景信息】
      ${contextText}
      `;

      const body = {
        model: "GLM-4-Flash-250414",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        stream: true,
      };

      const zhipuResponse = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.ZHIPU_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!zhipuResponse.ok) {
        return new Response('Failed to fetch from Zhipu AI API', { status: zhipuResponse.status });
      }

      return new Response(zhipuResponse.body, {
        headers: {
          'Access-Control-Allow-Origin': '*', // 最好换成你的网站域名
          'Content-Type': 'text/event-stream; charset=utf-8',
        },
      });

    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  },
};

function handleOptions(request: Request) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS preflight requests.
    const respHeaders = {
      'Access-Control-Allow-Origin': '*', // 最好换成你的网站域名
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
    return new Response(null, { headers: respHeaders });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: { Allow: 'POST,OPTIONS' },
    });
  }
} 