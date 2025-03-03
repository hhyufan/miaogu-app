import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prism-themes/themes/prism-one-light.css';
import { toast } from '@/plugins/toast.js';

// 配置必须在模块作用域
Prism.plugins.autoloader.languages_path =
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
Prism.languages.vue = Prism.languages.html; // 提前注册扩展语言

// 语言显示名称映射表
const LANGUAGE_DISPLAY_MAP = {
    html: 'HTML',
    xml: 'XML',
    sql: 'SQL',
    css: 'CSS',
    cpp: 'C++',
    sass: 'Sass',
    scss: 'Sass',
    js: 'JavaScript',
    ts: 'TypeScript',
    py: 'Python',
    php: 'PHP',
    md: 'Markdown',
    yml: 'YAML',
    yaml: 'YAML',
    json: 'JSON',
    rb: 'Ruby',
};

const MarkdownRenderer = ({ content }) => {
    const containerRef = useRef(null);

    // 清理旧标签
    const cleanupLabels = () => {
        const existingTags = containerRef.current?.querySelectorAll('.lang-tag');
        existingTags?.forEach((tag) => tag.remove());
    };

    // 添加语言标签
    const addLanguageLabels = () => {
        cleanupLabels();

        const codeBlocks = containerRef.current?.querySelectorAll('code') || [];

        codeBlocks.forEach((code) => {
            const pre = code.closest('pre');
            if (!pre) return;

            // 提取语言类型
            const langClass = [...code.classList].find((c) => c.startsWith('language-'));
            const rawLang = langClass ? langClass.split('-')[1] || '' : '';
            const langKey = rawLang.toLowerCase();

            // 获取显示名称
            let displayLang = LANGUAGE_DISPLAY_MAP[langKey];

            // 处理未定义的特殊情况
            if (!displayLang) {
                const versionMatch = langKey.match(/^(\D+)(\d+)$/);
                if (versionMatch) {
                    displayLang = `${versionMatch[1].charAt(0).toUpperCase()}${versionMatch[1].slice(
                        1
                    )} ${versionMatch[2]}`;
                } else {
                    displayLang = langKey.charAt(0).toUpperCase() + langKey.slice(1);
                }
            }

            // 创建标签
            const tag = document.createElement('button');
            tag.className = 'lang-tag';
            Object.assign(tag.style, {
                position: 'absolute',
                top: '8px',
                right: '12px',
                color: 'var(--color-text)',
                fontSize: '0.8em',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 1
            });

            // 设置显示名称
            tag.textContent = displayLang;

            // 添加点击事件
            tag.addEventListener('click', () => copyToClipboard(code.textContent));

            // 添加悬停效果
            tag.addEventListener('mouseover', () => {
                tag.style.backgroundColor = '#f8f7f7'; // hover 时的背景色
            });
            tag.addEventListener('mouseout', () => {
                tag.style.backgroundColor = ''; // 恢复默认背景色
            });

            // 确保 pre 元素有定位上下文
            pre.style.position = 'relative';

            // 将标签添加到 pre 元素
            pre.appendChild(tag);
        });
    };

    // 高亮核心逻辑
    const highlightCode = () => {
        Prism.highlightAllUnder(containerRef.current);
        addLanguageLabels();
    };

    // 复制到剪贴板
    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(async () => {
                await toast.success('内容已复制', {debounce: 3000, closable: true});
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    useEffect(() => {
        const debounceTimer = setTimeout(highlightCode, 50); // 延迟确保 DOM 更新
        return () => clearTimeout(debounceTimer);
    });

    return (
        <div ref={containerRef}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ className, children, ...props }) {
                        const language = className?.replace('language-', '') || '';
                        return language ? (
                            <pre className={`language-${language}`} style={{ position: 'relative', fontSize: '0.8rem'}}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
                        ) : (
                            <code style={{
                                backgroundColor: 'rgba(246,224,224,0.4)', // 背景色
                                padding: '2px 4px', // 内边距
                                borderRadius: '4px', // 圆角
                                fontSize: '1em', // 字体大小
                                fontFamily: 'monospace', // 等宽字体
                                color: 'rgb(55,55,57)', // 文字颜色
                            }}{...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
