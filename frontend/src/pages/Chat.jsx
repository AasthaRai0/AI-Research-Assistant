import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  FileText,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ChatMessage from "../components/ChatMessage";
import { useApp } from "../context/AppContext";

export default function Chat() {
  const { documents, chatHistory, askQuestion } = useApp();
  const location = useLocation();
  const readyDocs = documents.filter((d) => d.status === "ready");

  const [selectedDocId, setSelectedDocId] = useState(
    location.state?.documentId || readyDocs[0]?.id || null
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!selectedDocId && readyDocs.length > 0) setSelectedDocId(readyDocs[0].id);
  }, [readyDocs, selectedDocId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Rebuild the visible thread from chat history whenever the selected
  // document changes — the backend stores one Q&A pair per entry, so each
  // history row becomes a user message + an assistant message.
  useEffect(() => {
    if (!selectedDocId) {
      setMessages([]);
      return;
    }
    const entries = chatHistory
      .filter((c) => c.document_id === selectedDocId)
      .slice()
      .reverse(); // oldest first

    const thread = entries.flatMap((c) => [
      { id: `${c.id}-q`, role: "user", content: c.question },
      { id: `${c.id}-a`, role: "assistant", content: c.answer, sources: c.sources },
    ]);
    setMessages(thread);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocId]);

  const handleSend = async () => {
    if (!input.trim() || !selectedDocId || isTyping) return;

    const question = input.trim();
    const userMessage = { id: `local-${Date.now()}`, role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsTyping(true);

    try {
      const { answer, sources } = await askQuestion(selectedDocId, question);
      setMessages((prev) => [
        ...prev,
        { id: `local-${Date.now() + 1}`, role: "assistant", content: answer, sources },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong answering that question.");
      // Roll back the optimistic user message so it doesn't look like it was silently ignored.
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setInput(question);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Document selector */}
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-ink-200 bg-white md:flex">
          <div className="border-b border-ink-100 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Chat with</p>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2 thin-scrollbar">
            {readyDocs.length === 0 && (
              <p className="px-2 py-4 text-xs text-ink-400">No documents ready yet. Upload one first.</p>
            )}
            {readyDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedDocId === doc.id
                    ? "bg-ink-950 text-white"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                <FileText size={15} className="flex-shrink-0" />
                <span className="truncate">{doc.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-ink-100 p-3">
            <button
              onClick={() => setMessages([])}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 py-2 text-xs font-medium text-ink-700 hover:bg-ink-50"
            >
              <Plus size={14} /> Clear thread
            </button>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-ink-200 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-glow text-white">
                <Sparkles size={15} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {selectedDoc?.name || "Select a document"}
                </p>
                <p className="text-xs text-ink-400">Grounded answers with page citations</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6 thin-scrollbar">
            {messages.length === 0 && !isTyping && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                  <Sparkles size={22} />
                </span>
                <p className="font-display text-lg font-semibold text-ink-900">
                  {selectedDocId ? "Ask anything about this document" : "Select a document to start chatting"}
                </p>
                {selectedDocId && (
                  <p className="mt-1 max-w-sm text-sm text-ink-500">
                    Try: "What is gradient descent?" or "Summarize the key findings."
                  </p>
                )}
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isTyping && (
                <ChatMessage
                  key="typing"
                  message={{ id: "typing", role: "assistant", content: "" }}
                  isTyping
                />
              )}
            </AnimatePresence>
          </div>

          {/* Input box */}
          <div className="border-t border-ink-200 bg-white px-5 py-4">
            {error && (
              <div className="mx-auto mb-3 flex max-w-3xl items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-ink-200 bg-ink-50 p-2 shadow-soft focus-within:border-accent-400">
              <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                <Paperclip size={17} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedDocId ? "Ask a question about this document..." : "Select a document to start chatting"}
                disabled={!selectedDocId}
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400 disabled:cursor-not-allowed"
              />
              <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                <Mic size={17} />
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim() || !selectedDocId || isTyping}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white transition-opacity disabled:opacity-30"
              >
                <Send size={15} />
              </motion.button>
            </div>
            <p className="mx-auto mt-2 flex max-w-3xl items-center gap-1.5 text-[11px] text-ink-400">
              <CheckCircle2 size={11} /> Answers are grounded in your uploaded documents with page citations.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
