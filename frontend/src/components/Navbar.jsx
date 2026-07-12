import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-ink-50/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-white">
            <Sparkles size={16} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-950">Lumen</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-ink-600 hover:text-ink-950 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors">
            Log in
          </Link>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/signup")}
            className="rounded-full bg-ink-950 px-4 py-2 text-sm font-medium text-white shadow-soft hover:bg-ink-800 transition-colors"
          >
            Get started
          </motion.button>
        </div>

        <button className="md:hidden text-ink-800" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-ink-100 bg-ink-50 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-ink-700">
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <Link to="/login" className="flex-1 rounded-full border border-ink-200 py-2 text-center text-sm font-medium text-ink-800">
                Log in
              </Link>
              <Link to="/signup" className="flex-1 rounded-full bg-ink-950 py-2 text-center text-sm font-medium text-white">
                Get started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
