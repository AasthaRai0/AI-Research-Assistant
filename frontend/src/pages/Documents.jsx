import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import UploadBox from "../components/UploadBox";
import DocumentCard from "../components/DocumentCard";
import { useApp } from "../context/AppContext";
import { Search } from "lucide-react";

export default function Documents() {
  const { documents, addDocuments, setDocuments } = useApp();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleDelete = (id) => setDocuments((prev) => prev.filter((d) => d.id !== id));
  const handleChat = () => navigate("/chat");

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="font-display text-2xl font-semibold text-ink-950">Documents</h1>
            <p className="mt-1 text-sm text-ink-500">Upload PDFs to make them searchable and chat-ready.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mb-8"
          >
            <UploadBox onFiles={addDocuments} />
          </motion.div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-950">
              Your documents <span className="text-ink-400 font-normal">({documents.length})</span>
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents"
                className="w-48 rounded-lg border border-ink-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100 sm:w-64"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} onChat={handleChat} />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-200 py-16 text-center text-sm text-ink-400">
              No documents match "{query}"
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
