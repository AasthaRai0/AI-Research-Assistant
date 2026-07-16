import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, MessageSquare, FileText } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useApp } from "../context/AppContext";
import { formatRelativeDate } from "../lib/format";

export default function History() {
  const { chatHistory, historyLoading, deleteHistoryEntry, documents } = useApp();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const filtered = chatHistory.filter((c) =>
    c.question.toLowerCase().includes(query.toLowerCase())
  );

  const getDocName = (docId) => documents.find((d) => d.id === docId)?.name || "Unknown document";

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteHistoryEntry(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-950">History</h1>
              <p className="mt-1 text-sm text-ink-500">Revisit and manage your past conversations.</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats"
                className="w-48 rounded-lg border border-ink-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100 sm:w-64"
              />
            </div>
          </motion.div>

          {historyLoading && chatHistory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 py-16 text-center text-sm text-ink-400">
              Loading your history...
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.03 }}
                    className="group flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
                  >
                    <button
                      onClick={() => navigate("/chat", { state: { documentId: c.document_id } })}
                      className="flex flex-1 items-center gap-3 text-left min-w-0"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                        <MessageSquare size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-900">{c.question}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
                          <FileText size={11} />
                          <span className="truncate">{getDocName(c.document_id)}</span>
                          <span>·</span>
                          <span>{formatRelativeDate(c.created_at)}</span>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="flex-shrink-0 rounded-lg p-2 text-ink-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                      title="Delete conversation"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!historyLoading && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-200 py-16 text-center text-sm text-ink-400">
              {chatHistory.length === 0 ? "No conversations yet — ask a question in Chat to get started." : `No chats match "${query}"`}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
