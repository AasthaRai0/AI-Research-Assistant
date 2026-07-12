import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Search, Quote, Zap, ArrowRight, UploadCloud } from "lucide-react";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import HeroGraphic from "../components/HeroGraphic";

const features = [
  {
    icon: Brain,
    title: "AI-powered document analysis",
    description: "Upload any PDF and Lumen reads, structures, and understands it in seconds — no manual tagging required.",
  },
  {
    icon: Search,
    title: "RAG-based accurate answers",
    description: "Every answer is grounded in retrieval-augmented generation, pulling directly from your source material.",
  },
  {
    icon: Zap,
    title: "Semantic search",
    description: "Find what you mean, not just what you typed. Search across every uploaded document instantly.",
  },
  {
    icon: Quote,
    title: "Source citations",
    description: "Trace every claim back to its exact page and document — no black-box answers.",
  },
];

const steps = [
  { title: "Upload", desc: "Drop in your PDFs — papers, notes, reports, whatever you're researching." },
  { title: "Ask", desc: "Chat naturally. Lumen retrieves the most relevant passages before answering." },
  { title: "Verify", desc: "Every response comes with page-level citations so you can check the source." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
              Retrieval-augmented · grounded in your documents
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl"
            >
              Your Personal <span className="text-gradient">AI Research</span> Assistant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500"
            >
              Upload documents, ask questions, and get intelligent answers powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center justify-center gap-2 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-ink-800"
              >
                Start Researching
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/documents")}
                className="flex items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-6 py-3.5 text-sm font-medium text-ink-800 shadow-soft transition-colors hover:border-ink-300"
              >
                <UploadCloud size={16} />
                Upload Document
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex items-center gap-6 text-xs text-ink-400"
            >
              <span>Trusted for research across</span>
              <div className="flex items-center gap-4 font-display font-medium text-ink-500">
                <span>Academia</span>
                <span>·</span>
                <span>Legal</span>
                <span>·</span>
                <span>Product</span>
              </div>
            </motion.div>
          </div>

          <HeroGraphic />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-600">Capabilities</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
              Built for research you can trust
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-ink-200 bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-600">Workflow</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
              Three steps to your answer
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <span className="font-display text-4xl font-semibold text-ink-100">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl bg-ink-950 px-8 py-16 text-center"
        >
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Start researching smarter today
          </h2>
          <p className="max-w-md text-ink-300">
            Upload your first document and get grounded, cited answers in under a minute.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-2 flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink-950 shadow-soft transition-transform hover:scale-[1.03]"
          >
            Start Researching
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-ink-200 px-6 py-8 text-center text-xs text-ink-400 lg:px-8">
        © 2026 Lumen. Built for researchers, by researchers.
      </footer>
    </div>
  );
}
