import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-navy-900 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-navy-800 mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-navy-700 mb-2 mt-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-semibold text-navy-600 mb-2 mt-3">{children}</h4>,
          p: ({ children }) => <p className="text-slate-700 mb-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-slate-700 ml-2">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-navy-800">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50 rounded-r text-slate-700 my-4">{children}</blockquote>,
          code: ({ children }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">{children}</code>,
          pre: ({ children }) => <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono text-slate-800 my-4">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}