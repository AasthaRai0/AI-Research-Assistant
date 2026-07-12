import { motion } from "framer-motion";
import { FileText, MoreVertical, CheckCircle2, Loader2, Trash2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./Loader";

const STATUS_MAP = {
  uploading: { label: "Uploading...", color: "text-amber-500" },
  extracting: { label: "Extracting text...", color: "text-amber-500" },
  embedding: { label: "Creating embeddings...", color: "text-accent-500" },
  ready: { label: "Ready for chat", color: "text-mint-500" },
  error: { label: "Failed to process", color: "text-red-500" },
};

export default function DocumentCard({ doc, onDelete, onChat, layout = "grid" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_MAP[doc.status] || STATUS_MAP.ready;
  const isReady = doc.status === "ready";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group relative flex ${
        layout === "grid" ? "flex-col" : "flex-row items-center"
      } gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-soft transition-shadow hover:shadow-card`}
    >
      <div className={`flex items-center gap-3 ${layout === "grid" ? "" : "flex-1 min-w-0"}`}>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <FileText size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">{doc.name}</p>
          <p className="text-xs text-ink-500">
            {doc.pages} pages · {doc.size}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 ${layout === "grid" ? "justify-between mt-1" : ""}`}>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
          {isReady ? <CheckCircle2 size={14} /> : <Spinner size={13} />}
          <span>{status.label}</span>
        </div>

        <div className="relative flex items-center gap-1">
          {isReady && (
            <button
              onClick={() => onChat?.(doc)}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-accent-600 transition-colors"
              title="Chat with document"
            >
              <MessageSquare size={15} />
            </button>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-8 z-10 w-36 overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-card"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete?.(doc.id);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
