import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 700);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12">
      <Link to="/" className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={15} /> Back home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-glow text-white">
            <Sparkles size={20} />
          </span>
          <h1 className="font-display text-2xl font-semibold text-ink-950">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-500">Start researching with grounded, cited AI answers.</p>
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-7 shadow-card">
          <button className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink-200 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-50">
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-xs text-ink-400">or</span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  className="w-full rounded-xl border border-ink-200 py-2.5 pl-10 pr-3.5 text-sm text-ink-900 outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-ink-200 py-2.5 pl-10 pr-3.5 text-sm text-ink-900 outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-ink-200 py-2.5 pl-10 pr-10 text-sm text-ink-900 outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.66z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.28a12 12 0 0 0 0 10.74l3.99-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.63l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
