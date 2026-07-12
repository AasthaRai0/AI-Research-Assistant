import { motion } from "framer-motion";
import { FileText, Sparkles, Link2 } from "lucide-react";

const nodes = [
  { x: "78%", y: "18%", label: "Page 12", delay: 0.2 },
  { x: "88%", y: "48%", label: "Page 23", delay: 0.5 },
  { x: "74%", y: "78%", label: "Page 41", delay: 0.8 },
];

export default function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-accent-400/25 via-accent-glow/15 to-transparent blur-3xl" />

      {/* Document card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute left-[8%] top-[12%] w-[58%] overflow-hidden rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <FileText size={14} />
          </span>
          <div className="h-2 w-24 rounded bg-ink-100" />
        </div>
        {[100, 90, 95, 70, 85].map((w, i) => (
          <div key={i} className="mb-2 h-2 rounded bg-ink-100" style={{ width: `${w}%` }} />
        ))}

        {/* Scan line */}
        <motion.div
          className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-accent-400/25 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Citation nodes */}
      {nodes.map((n, i) => (
        <motion.div
          key={n.label}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: n.delay + 0.6 },
            scale: { duration: 0.5, delay: n.delay + 0.6 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: n.delay },
          }}
          style={{ left: n.x, top: n.y }}
          className="absolute flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-soft"
        >
          <Link2 size={11} className="text-accent-500" />
          {n.label}
        </motion.div>
      ))}

      {/* AI badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1, type: "spring" }}
        className="absolute bottom-[6%] left-[22%] flex items-center gap-2 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-glow px-4 py-3 text-white shadow-card"
      >
        <Sparkles size={16} />
        <span className="text-sm font-medium">Answer synthesized</span>
      </motion.div>
    </div>
  );
}
