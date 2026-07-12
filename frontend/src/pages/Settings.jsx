import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Check, Sun, Moon, Save } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useApp } from "../context/AppContext";
import { aiModels } from "../lib/mockData";

export default function Settings() {
  const { user, setUser, theme, setTheme } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [model, setModel] = useState("lumen-pro");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
            <h1 className="font-display text-2xl font-semibold text-ink-950">Settings</h1>
            <p className="mt-1 text-sm text-ink-500">Manage your profile, model, and appearance preferences.</p>
          </motion.div>

          {/* Profile */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-soft"
          >
            <h2 className="mb-4 font-display text-base font-semibold text-ink-950">Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-glow text-lg font-semibold text-white">
                  {name.charAt(0)}
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-600">Full name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink-600">Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-800"
                >
                  {saved ? <Check size={15} /> : <Save size={15} />}
                  {saved ? "Saved" : "Save changes"}
                </button>
              </div>
            </form>
          </motion.section>

          {/* Model selection */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-soft"
          >
            <h2 className="mb-4 font-display text-base font-semibold text-ink-950">AI model</h2>
            <div className="space-y-2">
              {aiModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-colors ${
                    model === m.id ? "border-accent-500 bg-accent-50" : "border-ink-200 hover:bg-ink-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-ink-900">{m.name}</p>
                    <p className="text-xs text-ink-500">{m.description}</p>
                  </div>
                  {model === m.id && (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Theme */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft"
          >
            <h2 className="mb-4 font-display text-base font-semibold text-ink-950">Appearance</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors ${
                  theme === "light" ? "border-accent-500 bg-accent-50 text-accent-700" : "border-ink-200 text-ink-600 hover:bg-ink-50"
                }`}
              >
                <Sun size={15} /> Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors ${
                  theme === "dark" ? "border-accent-500 bg-accent-50 text-accent-700" : "border-ink-200 text-ink-600 hover:bg-ink-50"
                }`}
              >
                <Moon size={15} /> Dark
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-400">Dark mode preview coming soon — theme preference is saved for when it ships.</p>
          </motion.section>
        </div>
      </div>
    </DashboardLayout>
  );
}
