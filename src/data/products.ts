export interface Product {
    title: string;
    icon: string;
    description: string;
    tags: string[];
    linkText: string;
    linkUrl: string;
}

export const products: Product[] = [
    {
        title: "LifeWealth",
        icon: "⌛",
        description: "基于萨希尔·布卢姆的五种财富理念，帮助你平衡生活中的时间、社交、精神、物质和经验财富。",
        tags: ['iOS', 'macOS', '即将发布!'],
        linkText: "详细介绍",
        linkUrl: "#"
    },
    {
        title: "Logseq-AI-Search",
        icon: "🔌",
        description: "Logseq智能搜索插件，基于当前block内容，进行logseq文档内的全局搜索，返回笔记来源，并可以进行AI总结。",
        tags: ['Logseq-Plugin', 'AI', '已发布'],
        linkText: "GitHub",
        linkUrl: "#"
    },
    {
        title: "Vniverse",
        icon: "📖",
        description: "macOS软件, markdown、PDF、AI Chat聊天记录阅读器, 能够自然语言文本朗读和自动高亮朗读文本。",
        tags: ['macOS', '语音合成', '已归档'],
        linkText: "GitHub",
        linkUrl: "#"
    },
    {
        title: "ChatHistoryBox",
        icon: "📦",
        description: "Chrome扩展，保存各个AI Chat对话记录为JSON文件。",
        tags: ['Chrome-Plugin', 'ChatHistory', '已归档'],
        linkText: "GitHub",
        linkUrl: "#"
    },
    {
        title: "File-Path-to-Embed-Converter",
        icon: "🔗",
        description: "Logseq 插件，用于快速将文件路径转换为 Logseq 的嵌入语法。",
        tags: ['Logseq 插件', '已归档'],
        linkText: "GitHub",
        linkUrl: "#"
    },
    {
        title: "StreamVoice",
        icon: "🔊",
        description: "macOS应用，为 GPT-SoVITS 语音合成引擎提供图形界面，支持实时语音文本朗读和流式音频输出。",
        tags: ['macOS应用', '语音合成', '已归档'],
        linkText: "GitHub",
        linkUrl: "#"
    }
]; 