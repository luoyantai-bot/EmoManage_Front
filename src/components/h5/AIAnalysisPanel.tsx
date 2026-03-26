'use client';

/**
 * AIAnalysisPanel - AI 分析面板组件
 * 
 * 设计意图：展示 AI 生成的分析报告
 * 支持 Markdown 渲染，分区块折叠
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { ChevronRight, Bot } from 'lucide-react';

interface AIAnalysisPanelProps {
  content: string;
  className?: string;
}

// AI 分析区块配置
const SECTIONS = [
  { id: 'overview', title: '总体健康状态概述', icon: '📊', defaultExpanded: true },
  { id: 'detail', title: '各板块详细分析', icon: '🔍', defaultExpanded: false },
  { id: 'risk', title: '风险指标预警', icon: '⚠️', defaultExpanded: false },
  { id: 'advice', title: '个性化健康建议', icon: '💡', defaultExpanded: false },
];

export function AIAnalysisPanel({ content, className }: AIAnalysisPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(SECTIONS.filter(s => s.defaultExpanded).map(s => s.id))
  );

  // 解析 Markdown 内容，按标题分块
  const parsedSections = useMemo(() => {
    const sections: Array<{ id: string; title: string; icon: string; content: string }> = [];
    const lines = content.split('\n');
    let currentSection: { id: string; title: string; icon: string; content: string[] } | null = null;

    lines.forEach((line) => {
      // 检测三级标题作为分块标志
      const headerMatch = line.match(/^### (.+)$/);
      if (headerMatch) {
        // 保存上一个区块
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.join('\n'),
          });
        }
        
        // 提取标题和图标
        const fullTitle = headerMatch[1];
        const iconMatch = fullTitle.match(/^([\u{1F300}-\u{1F9FF}])\s*/u);
        const icon = iconMatch ? iconMatch[1] : '📝';
        const title = iconMatch ? fullTitle.replace(iconMatch[0], '') : fullTitle;
        
        // 匹配预定义的区块
        const sectionConfig = SECTIONS.find(s => 
          title.includes(s.title.replace(/[📊🔍⚠️💡]/g, '').trim()) ||
          s.title.includes(title)
        );
        
        currentSection = {
          id: sectionConfig?.id || title.toLowerCase().replace(/\s+/g, '-'),
          title,
          icon,
          content: [],
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    });

    // 保存最后一个区块
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentSection.content.join('\n'),
      });
    }

    return sections.length > 0 ? sections : [{ id: 'default', title: 'AI 分析', icon: '🤖', content }];
  }, [content]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 标题栏 */}
      <div className="flex items-center gap-2 px-1">
        <Bot className="w-5 h-5 text-blue-500" />
        <h3 className="text-base font-semibold text-gray-800">AI 健康顾问</h3>
      </div>

      {/* 区块列表 */}
      <div className="flex flex-col gap-2">
        {parsedSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div
              key={section.id}
              className="bg-white/50 rounded-xl overflow-hidden border border-gray-100"
            >
              {/* 区块标题 */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 transition-colors"
              >
                <span className="text-lg">{section.icon}</span>
                <span className="flex-1 font-medium text-gray-700">
                  {section.title}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>

              {/* 区块内容 */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold text-gray-800 mt-4 mb-2">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-gray-800 mt-3 mb-2">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold text-gray-700 mt-2 mb-1">{children}</h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 leading-relaxed">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-600">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-800">{children}</strong>
                          ),
                          hr: () => <hr className="my-4 border-gray-200" />,
                        }}
                      >
                        {section.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 底部提示 */}
      <p className="text-xs text-gray-400 text-center mt-2">
        由 AI 辅助生成，仅供健康参考，不构成医疗建议
      </p>
    </div>
  );
}

export default AIAnalysisPanel;
