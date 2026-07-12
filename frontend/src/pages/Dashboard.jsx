import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, UploadCloud, Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useApp } from "../context/AppContext";
import { activityFeed, formatRelativeDate } from "../lib/mockData";

export default function Dashboard() {
  const { documents, conversations, totalQueries, user } = useApp();
  const navigate = useNavigate();

  const stats = [
    { label: "Documents uploaded", value: documents.length, icon: FileText },
    { label: "Queries asked", value: totalQueries, icon: MessageSquare },
    { label: "Conversations", value: conversations.length, icon: Clock },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-950">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-ink-500">Here's what's happening with your research.</p>
            </div>
            <button
              onClick={() => navigate("/documents")}
              className="flex items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-ink-800"
            >
              <UploadCloud size={16} />
              Upload document
            </button>
          </motion.div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <s.icon size={16} />
                  </span>
                </div>
                <p className="font-display text-3xl font-semibold text-ink-950">{s.value}</p>
                <p className="mt-1 text-sm text-ink-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-ink-950">Recent activity</h2>
              </div>
              <div className="space-y-1">
                {activityFeed.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-ink-50">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                      {a.type === "upload" ? <UploadCloud size={14} /> : <MessageSquare size={14} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink-800">{a.label}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-ink-400">{a.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="lg:col-span-2 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-ink-950">Your documents</h2>
                <button onClick={() => navigate("/documents")} className="text-xs font-medium text-accent-600 hover:text-accent-700">
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {documents.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate("/chat")}
                    className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-ink-50"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                      <FileText size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink-800">{d.name}</p>
                      <p className="text-xs text-ink-400">{formatRelativeDate(d.uploadedAt)}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-ink-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
            className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink-950 p-6 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Ready for your next question?</h3>
              <p className="mt-1 text-sm text-ink-300">Jump into chat and ask anything about your documents.</p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-950"
            >
              Open chat <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
