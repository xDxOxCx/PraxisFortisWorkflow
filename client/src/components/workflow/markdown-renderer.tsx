
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MermaidDiagram from './mermaid-diagram';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-emerald-500">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4 flex items-center">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-slate-700 mt-6 mb-3">
              {children}
            </h3>
          ),
          
          // Professional table styling
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-emerald-50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-gray-200">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-slate-600 border-b border-gray-100">
              {children}
            </td>
          ),
          
          // Professional paragraph and list styling
          p: ({ children }) => (
            <p className="text-slate-600 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-slate-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-600">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          
          // Code block handling with Mermaid support
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (!inline && language === 'mermaid') {
              return <MermaidDiagram code={String(children).replace(/\n$/, '')} />;
            }
            
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  className="rounded-lg my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
            
            return (
              <code className="bg-gray-100 text-slate-800 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          
          // Blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50 italic text-slate-700">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-t-2 border-gray-200" />
          ),
          
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-800">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
