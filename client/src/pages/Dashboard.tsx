import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

export default function Dashboard() {
  const [protectedMessage, setProtectedMessage] = useState("Checking protected API...");

  useEffect(() => {
    api.get("/protected")
      .then((res) => setProtectedMessage(res.data.message))
      .catch(() => setProtectedMessage("Protected API check failed"));
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Debian 12 • MongoDB • Google Cloud</p>
        <h1 className="mt-3 text-4xl font-bold">Dark Auth Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-400">A production-oriented MERN starter with refresh-token auth, protected routes, and Google Cloud deployment notes.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Auth", "JWT + HTTP-only refresh cookies"],
          ["Database", "MongoDB with Mongoose models"],
          ["Deploy", "Debian 12 VM on Google Cloud"]
        ].map(([title, body]) => (
          <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-3 text-2xl font-bold">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <p className="text-sm text-slate-400">Protected API response</p>
        <p className="mt-2 text-lg font-semibold text-blue-200">{protectedMessage}</p>
      </div>
    </Layout>
  );
}
