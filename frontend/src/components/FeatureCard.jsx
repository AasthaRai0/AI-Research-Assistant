import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-white transition-colors group-hover:bg-gradient-to-br group-hover:from-accent-500 group-hover:to-accent-glow">
        <Icon size={19} />
      </div>
      <h3 className="mb-1.5 font-display text-base font-semibold text-ink-950">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-500">{description}</p>
    </motion.div>
  );
}
