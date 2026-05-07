import { motion } from "framer-motion";
import { BarChart3, Cloud, Lock, LogOut, Server } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%)]" />
      <aside className="fixed left-0 top-0 h-full w-72 border-r border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-300"><Cloud size={24} /></div>
          <div>
            <p className="text-lg font-bold">GCP MERN</p>
            <p className="text-sm text-slate-400">MongoDB Auth Starter</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          <a className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-white" href="/dashboard"><BarChart3 size={18} /> Dashboard</a>
          <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5" href="/dashboard"><Lock size={18} /> Protected</a>
          <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-white/5" href="/dashboard"><Server size={18} /> API Health</a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="mb-4 truncate text-xs text-slate-400">{user?.email}</p>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
