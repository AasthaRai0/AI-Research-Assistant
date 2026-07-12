import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function SourceCitation({ sources = [] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sources.map((s, i) => (
        <motion.button
          key={`${s.doc}-${s.page}-${i}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -1 }}
          className="group flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-left shadow-soft transition-colors hover:border-accent-400/60 hover:bg-accent-50"
        >
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-500 group-hover:bg-accent-500/10 group-hover:text-accent-600">
            <FileText size={13} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-ink-800 max-w-[180px] truncate">
              {s.doc}
            </span>
            <span className="text-[11px] text-ink-500">Page {s.page}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}
