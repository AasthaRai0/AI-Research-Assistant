import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import SourceCitation from "./SourceCitation";
import { TypingDots } from "./Loader";

function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const language = /language-(\w+)/.exec(className || "")?.[1] || "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-ink-800 bg-ink-950 text-left">
      <div className="flex items-center justify-between border-b border-ink-800 px-3.5 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-ink-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 thin-scrollbar">
        <code className="font-mono text-[13px] leading-relaxed text-ink-100">{code}</code>
      </pre>
    </div>
  );
}

export default function ChatMessage({ message, isTyping = false }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-ink-900 text-white" : "bg-gradient-to-br from-accent-500 to-accent-glow text-white"
        }`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} />}
      </div>

      <div className={`flex max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed ${
            isUser
              ? "bg-ink-900 text-white rounded-tr-sm"
              : "bg-white border border-ink-200 text-ink-800 rounded-tl-sm shadow-soft"
          }`}
        >
          {isTyping ? (
            <TypingDots />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    if (inline) {
                      return (
                        <code
                          className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[13px] text-accent-600"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                  strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && !isTyping && <SourceCitation sources={message.sources} />}
      </div>
    </motion.div>
  );
}
